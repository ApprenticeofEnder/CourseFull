# frozen_string_literal: true

require 'factory_bot'
require 'faker'

RSpec.configure do |config|
  config.before do
    Faker::Name.unique.clear
  end

  config.include FactoryBot::Syntax::Methods
end
