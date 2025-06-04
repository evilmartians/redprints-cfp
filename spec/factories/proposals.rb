FactoryBot.define do
  factory :proposal do
    user

    title { Faker::Lorem.sentence }
    abstract { Faker::Lorem.paragraph }
    details { Faker::Lorem.paragraphs(number: 3).join("\n\n") }
    pitch { Faker::Lorem.paragraph }
    track { (Proposal.tracks.values - ["startup"]).sample }
    status { "submitted" }
    submitted_at { Time.current }

    trait :draft do
      status { "draft" }
      submitted_at { nil }
    end

    after(:stub) do |proposal|
      proposal.external_id ||= Nanoid.generate(size: 3)
    end
  end
end
