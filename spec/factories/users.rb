FactoryBot.define do
  sequence(:email_number)

  factory :user do
    email { "speaker-#{generate(:email_number)}@sfruby.test" }
    name { Faker::Name.name }
  end
end
