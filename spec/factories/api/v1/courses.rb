FactoryBot.define do
  factory :api_v1_course, class: "Api::V1::Course" do
    title { Faker::Educator.course_name }
    course_code { "#{Faker::Alphanumeric.alpha(number: 4)} #{Faker::Number.number(digits: 4)}" }
    status { "active" }
    api_v1_semester
  end
end
