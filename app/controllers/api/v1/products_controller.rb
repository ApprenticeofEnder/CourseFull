class Api::V1::ProductsController < Api::V1::ApplicationController
  def index
    @products = Stripe::Product.list()
    render json: @products
  end
end
