class Api::V1::ProductsController < Api::V1::ApplicationController
  def index
    @products = Api::V1::Product.all()
    render json: @products
  end
end
