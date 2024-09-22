# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Products', type: :request do
  describe 'GET /index' do
    it 'renders a successful response' do
      get '/api/v1/products', as: :json
      expect(response).to be_successful
    end
  end
end
