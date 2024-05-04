FactoryBot.define do
  factory :api_v1_user, class: "Api::V1::User" do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.email }
    supabase_id { "c7689623-6852-4664-928d-43f778264337" }
  end
end
