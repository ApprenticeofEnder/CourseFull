FactoryBot.define do
  factory :api_v1_user, class: "Api::V1::User" do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    email { Faker::Internet.email }
    supabase_id { SecureRandom.uuid }
    courses_remaining { 3 }
  end
end
