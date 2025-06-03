FactoryBot.define do
  factory :speaker_profile do
    user

    name { user.name.presence || Faker::Name.name }
    email { user.email }
    company { Faker::Company.name }

    bio { Faker::Lorem.paragraph_by_chars(number: 500) }
    socials { Faker::Lorem.paragraph_by_chars(number: 200) }
  end
end
