FactoryBot.define do
  sequence(:email_number)

  factory :user do
    email { "speaker-#{generate(:email_number)}@sfruby.test" }
    name { Faker::Name.name }

    trait :reviewer do
      role { :reviewer }
    end

    trait :speaker do
      after(:create) do |user|
        user.speaker_profile = create(:speaker_profile, user:)
      end

      after(:stub) do |user|
        user.speaker_profile = build_stubbed(:speaker_profile, user:)
      end
    end
  end

  factory :reviewer, parent: :user, traits: [:reviewer]
  factory :speaker, parent: :user, traits: [:speaker]
end
