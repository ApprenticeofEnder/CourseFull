FactoryBot.define do
  factory :api_v1_course, class: "Api::V1::Course" do
    title { "Introduction to Computer Science I" }
    course_code { "COMP 1405" }
    status { 0 }
    semester
  end
end
