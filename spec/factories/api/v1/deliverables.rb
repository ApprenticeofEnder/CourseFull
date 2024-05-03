FactoryBot.define do
  factory :api_v1_deliverable, class: 'Api::V1::Deliverable' do
    name { "MyString" }
    weight { 1.5 }
    mark { 1.5 }
    notes { "MyText" }
    course { nil }
    status { 1 }
    goal { 1.5 }
  end
end
