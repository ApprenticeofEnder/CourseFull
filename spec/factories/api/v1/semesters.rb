FactoryBot.define do
  factory :api_v1_semester, class: "Api::V1::Semester" do
    name { "Fall 2024" }
    status { 0 }
    goal { 80.0 }
    user
  end
end
