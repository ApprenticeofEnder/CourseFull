# frozen_string_literal: true

module Api
  module V1
    class Payment
      include ActiveModel::Validations
      include ActiveModel::Conversion
      extend ActiveModel::Naming

      attr_accessor :price, :quantity

      validates :price, presence: { message: 'Price must be present.' }
      validates :quantity, numericality: { greater_than: 0, message: 'Quantity must be at least 1.' }

      def initialize(attributes = {})
        attributes.each do |name, value|
          send("#{name}=", value)
        end
      end

      def persisted?
        false
      end

      # belongs_to :user, foreign_key: "api_v1_user_id", dependent: :destroy

      # validates :user, presence: true
    end
  end
end
