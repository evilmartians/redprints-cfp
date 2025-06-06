class Review < ApplicationRecord
  belongs_to :user
  belongs_to :evaluation
  belongs_to :proposal

  enum :status, %w[pending submitted].index_by(&:itself)
end
