class Proposal < ApplicationRecord
  belongs_to :user

  has_one :speaker_profile, through: :user

  enum :track, %w[oss scale startup].index_by(&:itself)

  enum :status, %w[draft submitted accepted rejected waitlisted].index_by(&:itself)

  before_create do
    self.external_id ||= Nanoid.generate(size: 8)
  end

  def to_param = external_id
end
