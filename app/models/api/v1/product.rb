# frozen_string_literal: true

module Api
  module V1
    class Product < ApplicationRecord
      validates :price, numericality: { greater_than: 0 }
    end
  end
end
