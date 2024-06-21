class Api::V1::PaymentsController < Api::V1::ApplicationController
  before_action :authenticated, only: %i[ create ]

  def create
    Rails.logger.debug("Initializing payment.")

    @payment = Api::V1::Payment.new(api_v1_payment_params)

    unless @payment.valid?
      render json: { errors: @payment.errors }, status: :bad_request
      return
    end

    Rails.logger.debug(@payment.inspect)

    # Figure out if bulk payments make sense or if coupons do
    # Coupon with minimum order value works!

    session = Stripe::Checkout::Session.create({
      line_items: [@payment.as_json],
      mode: "payment",
      metadata: {
        user: @api_v1_user.id,
      },
      success_url: ENV["APP_URL"] + "/payments/success",
      cancel_url: ENV["APP_URL"] + "/payments/cancel",
    })

    Rails.logger.debug("Session creation complete.")

    render json: { redirect: session.url }, status: :ok
  end

  def webhook
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = Rails.configuration.stripe[:webhook_secret]
    event = nil

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, endpoint_secret
      )
    rescue JSON::ParserError => e
      # Invalid payload
      Rails.logger.error("Error while parsing JSON for payments webhook: %p" % e.message)
      status 400
      return
    rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      Rails.logger.error("Invalid Stripe signature for payments webhook: %p" % e.message)
      status 400
      return
    end

    # Handle the event
    case event.type
    when "checkout.session.completed"
      Rails.logger.debug("Checkout session completed.")
      checkout_session = event.data.object
      process_checkout_session_complete(checkout_session)
      # ... handle other event types
    else
      return
    end
  end

  private

  module Product
    COURSE_TICKET = "prod_Q7XITHNBLjVqlT"
  end

  def api_v1_payment_params
    params.require(:payment).permit(:price, :quantity)
  end

  def process_checkout_session_complete(checkout_session)
    Rails.logger.debug(checkout_session.inspect)
    unless checkout_session.payment_status == "paid"
      Rails.logger.warn("Checkout session %p complete but not paid." % checkout_session.id)
      return
    end
    line_items = Stripe::Checkout::Session.list_line_items(checkout_session.id)
    line_items.data.each do |line_item|
      process_line_item(line_item, checkout_session.metadata)
    end
    Rails.logger.debug(line_items.data.inspect)
  end

  def process_line_item(line_item, metadata)
    if line_item.price.product == Product::COURSE_TICKET
      api_v1_user = Api::V1::User.find_by(id: metadata.user)
      api_v1_user.add_course_tickets(line_item.quantity)
    end
  end
end
