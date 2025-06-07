class User < ApplicationRecord
  include Authentication

  has_many :proposals, dependent: :restrict_with_error
  has_one :speaker_profile, dependent: :restrict_with_error

  has_many :evaluation_reviewers, class_name: "Evaluation::Reviewer"
  has_many :evaluations, through: :evaluation_reviewers
  has_many :reviews, dependent: :restrict_with_error

  enum :role, %w[regular reviewer].index_by(&:itself)
end
