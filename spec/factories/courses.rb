FactoryBot.define do
  factory :course do
    title { "Introduction to Computer Science I" }
    course_code { "COMP 1405" }
    status { "active" }
    semester
  end
end
