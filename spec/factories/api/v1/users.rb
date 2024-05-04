FactoryBot.define do
  factory :api_v1_user, class: "Api::V1::User" do
    first_name { "Test" }
    last_name { "Test" }
    email { "test@test.com" }
    supabase_id { "c7689623-6852-4664-928d-43f778264337" }
  end
end
