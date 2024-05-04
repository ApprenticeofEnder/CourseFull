FactoryBot.define do
  factory :api_v1_user, class: "Api::V1::User" do
    first_name { Faker::Name.unique.first_name }
    last_name { Faker::Name.unique.last_name }
    email { Faker::Internet.unique.email }
    supabase_id { SecureRandom.uuid }
    courses_remaining { 3 }
  end
end
