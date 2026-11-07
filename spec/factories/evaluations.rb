FactoryBot.define do
  factory :evaluation do
    name { Faker::Sports::Basketball.team }
    tracks { %w[general] }
    criteria { %w[Clarity Originality] }
    cfp_id { CFP.primary.id }
  end
end
