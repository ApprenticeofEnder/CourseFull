class Api::V1::PaymentsController < Api::V1::ApplicationController
  before_action :authenticated, only: %i[ create ]

  def create
    Rails.logger.debug("Initializing payment.")

    @line_items = []

    api_v1_payment_params[:products].each do |product|
      Rails.logger.info("Account %p is attempting to purchase %d items of product %p" % [@api_v1_user.id, product[:quantity], product[:stripe_id]])
      @line_items.push({ price: product[:stripe_price], quantity: product[:quantity] })
    end

    unless @line_items.length > 0
      render json: { error: "You cannot check out with an empty cart!", error_type: "empty_cart" }, status: :bad_request
      return
    end

    session = Stripe::Checkout::Session.create({
      line_items: @line_items,
      mode: "payment",
      metadata: {
        user: @api_v1_user.id,
      },
      success_url: ENV["APP_URL"] + "/payments/success",
      cancel_url: ENV["APP_URL"] + "/payments/cancel",
      allow_promotion_codes: true,
    })

    render json: { redirect: session.url }, status: :created
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
    params.require(:payment).permit(products: [:stripe_id, :stripe_price, :quantity])
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
    product = Api::V1::Product.find_by(stripe_id: line_item.price.product)
    case product.name
    when "Course Ticket"
      api_v1_user = Api::V1::User.find_by(id: metadata.user)
      api_v1_user.add_course_tickets(line_item.quantity)
    else
      return
    end
  end
end
