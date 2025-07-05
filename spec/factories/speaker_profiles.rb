FactoryBot.define do
  factory :speaker_profile do
    user

    name { user.name.presence || Faker::Name.name }
    email { user.email }
    company { Faker::Company.name }
    role { Faker::Job.title }

    bio { Faker::Lorem.paragraph_by_chars(number: 100) }
    socials { Faker::Lorem.paragraph_by_chars(number: 20) }
  end
end
