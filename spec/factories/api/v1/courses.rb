# frozen_string_literal: true

FactoryBot.define do
  factory :api_v1_course, class: 'Api::V1::Course' do
    title { Faker::Educator.course_name }
    course_code { "#{Faker::Alphanumeric.alpha(number: 4)} #{Faker::Number.number(digits: 4)}" }
    status { 'active' }
    goal { 80.0 }
    deliverable_goal { 80.0 }
    grade { 0.0 }
    semester factory: :api_v1_semester
    user factory: :api_v1_user
  end
end
