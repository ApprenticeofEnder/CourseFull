FactoryBot.define do
  factory :course do
    title { "Introduction to Computer Science I" }
    course_code { "COMP 1405" }
    goal { 80.0 }
    semester
  end
end
