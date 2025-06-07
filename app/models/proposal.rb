class Proposal < ApplicationRecord
  belongs_to :user

  has_one :speaker_profile, through: :user
  has_many :reviews, dependent: :destroy

  enum :track, %w[oss scale general startup].index_by(&:itself)

  enum :status, %w[draft submitted accepted rejected waitlisted].index_by(&:itself)

  before_create do
    self.external_id ||= Nanoid.generate(size: 8)
  end

  def to_param = external_id

  def invalidate_scores!
    Proposal.where(id:).update_all(<<~SQL
      reviews_count = (SELECT COUNT(*) FROM reviews WHERE reviews.proposal_id = proposals.id AND reviews.status = 'submitted'),
      score = (SELECT COALESCE(SUM(score), 0) FROM reviews WHERE reviews.proposal_id = proposals.id AND reviews.status = 'submitted')
    SQL
                                  )
  end
end
