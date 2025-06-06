FactoryBot.define do
  sequence(:email_number)

  factory :user do
    email { "speaker-#{generate(:email_number)}@sfruby.test" }
    name { Faker::Name.name }

    trait :reviewer do
      role { :reviewer }
    end
  end

  factory :reviewer, parent: :user, traits: [:reviewer]
end
