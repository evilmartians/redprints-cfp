class Review < ApplicationRecord
  belongs_to :user
  belongs_to :evaluation
  belongs_to :proposal

  enum :status, %w[pending submitted].index_by(&:itself)

  scope :active, -> { joins(:proposal).merge(Proposal.active) }
end
