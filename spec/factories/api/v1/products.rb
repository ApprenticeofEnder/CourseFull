# frozen_string_literal: true

FactoryBot.define do
  factory :api_v1_product, class: 'Api::V1::Product' do
    stripe_price { 'MyString' }
    name { 'MyString' }
    stripe_id { 'MyString' }
    description { 'MyString' }
    price { '9.99' }
  end
end
