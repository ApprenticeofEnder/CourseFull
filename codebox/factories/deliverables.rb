FactoryBot.define do
  factory :deliverable do
    mark { 0.0 }
    status { "active" }
    notes { "" }
    course

    factory :assignment do
      name { "Assignment" }
      weight { 6.0 }

      factory :completed_assignment do
        status { "complete" }
        mark { 75.0 }
      end
    end

    factory :midterm do
      name { "Midterm" }
      weight { 30.0 }

      factory :completed_midterm do
        status { "complete" }
        mark { 82.0 }
      end
    end

    factory :exam do
      name { "Exam" }
      weight { 40.0 }

      factory :completed_exam do
        status { "complete" }
        mark { 77.0 }
      end
    end
  end
end
