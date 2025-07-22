class Evaluation < ApplicationRecord
  has_many :reviews
  has_many :evaluation_reviewers, class_name: "Evaluation::Reviewer"
  has_many :reviewers, through: :evaluation_reviewers, source: :user

  has_many :reviewed_proposals, -> { distinct }, through: :reviews, source: :proposal

  has_object :distribution

  delegate :invalidate!, to: :distribution
end
