FactoryBot.define do
  factory :review do
    user
    evaluation
    proposal

    status { :pending }

    trait :submitted do
      status { :submitted }

      comment { Faker::ChuckNorris.fact }
      scores { evaluation.criteria.map { rand(1..5) } }
    end
  end
end
