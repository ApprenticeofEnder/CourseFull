FactoryBot.define do
  factory :api_v1_deliverable, class: "Api::V1::Deliverable" do
    mark { 0.0 }
    status { "active" }
    notes { Faker::Lorem.paragraph }
    goal { 80.0 }
    course factory: :api_v1_course

    factory :api_v1_assignment do
      name { "Assignment #{Faker::Number.between(from: 1, to: 10)}: #{Faker::Lorem.word}" }
      weight { 6.0 }

      factory :api_v1_completed_assignment do
        status { "complete" }
        mark { Faker::Number.between(from: 0.0, to: 100.0) }
      end
    end

    factory :api_v1_midterm do
      name { "Midterm #{Faker::Number.between(from: 1, to: 3)}" }
      weight { 30.0 }

      factory :api_v1_completed_midterm do
        status { "complete" }
        mark { Faker::Number.between(from: 0.0, to: 100.0) }
      end
    end

    factory :api_v1_exam do
      name { "Exam" }
      weight { 40.0 }

      factory :api_v1_completed_exam do
        status { "complete" }
        mark { Faker::Number.between(from: 0.0, to: 100.0) }
      end
    end
  end
end
