FactoryBot.define do
  factory :proposal do
    user

    title { Faker::Lorem.sentence }
    abstract { Faker::Lorem.paragraph }
    details { Faker::Lorem.paragraphs(number: 3).join("\n\n") }
    pitch { Faker::Lorem.paragraph }
    track { Proposal.tracks.values.sample }
    status { "submitted" }
    submitted_at { Time.current }

    trait :draft do
      status { "draft" }
      submitted_at { nil }
    end
  end
end
