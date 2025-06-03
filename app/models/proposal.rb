class Proposal < ApplicationRecord
  belongs_to :user

  enum :track, %w[oss scale general].index_by(&:itself)

  enum :status, %w[draft submitted accepted rejected waitlisted].index_by(&:itself)
end
