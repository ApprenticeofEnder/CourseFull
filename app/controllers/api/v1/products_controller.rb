# frozen_string_literal: true

module Api
  module V1
    class ProductsController < Api::V1::ApplicationController
      def index
        @products = Api::V1::Product.all
        render json: @products
      end
    end
  end
end
