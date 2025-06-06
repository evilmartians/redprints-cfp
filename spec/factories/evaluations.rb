FactoryBot.define do
  factory :evaluation do
    name { Faker::Sports::Basketball.team }
    tracks { %w[general] }
    criteria { %w[Clarity Originality] }
  end
end
