# frozen_string_literal: true

FactoryBot.define do
  factory :api_v1_semester, class: 'Api::V1::Semester' do
    name { "#{Faker::Lorem.word} #{Faker::Number.number(digits: 4)}" }
    status { 'not_started' }
    goal { 80.0 }
    user factory: :api_v1_user
  end
end
