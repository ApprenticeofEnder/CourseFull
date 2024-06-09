class Api::V1::PaymentsController < Api::V1::ApplicationController
  before_action :authenticated, only: %i[ create ]
  before_action :webhook_auth, only: %i[ webhook ]

  def create
    @api_v1_payments = params[:products].map { |payment|
      Api::V1::Payment.new({ product: payment[:product], quantity: payment[:quantity], user: @api_v1_user.id })
    }

    # Figure out if bulk payments make sense or if coupons do
    # Coupon with minimum order value works!

    payments = JSON.parse(@api_v1_payments.to_json(:exclude => :user))

    session = Stripe::Checkout::Session.create({
      line_items: payments,
      mode: "payment",
      metadata: {
        user: @api_v1_user.id,
      },
      success_url: YOUR_DOMAIN + "/payments/success",
      cancel_url: YOUR_DOMAIN + "/payments/cancel",
    })
    render json: session.url, status: 303
  end

  def webhook
  end

  def webhook_auth
  end

  def api_v1_payment_params
    params.require(:products).permit(:product, :quantity)
  end
end
