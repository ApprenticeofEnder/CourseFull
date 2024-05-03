FactoryBot.define do
  factory :api_v1_user, class: "Api::V1::User" do
    first_name { "Test" }
    last_name { "Test" }
    email { "test@test.com" }
    supabase_id { "" }
    courses_remaining { 3 }
  end
end
