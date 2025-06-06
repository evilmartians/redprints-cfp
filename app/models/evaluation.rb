class Evaluation < ApplicationRecord
  has_many :reviews
  has_many :evaluation_reviewers, class_name: "Evaluation::Reviewer"
  has_many :reviewers, through: :evaluation_reviewers, source: :user

  def proposals
    return Proposal.all if tracks.blank?

    Proposal.where(track: tracks)
  end

  def invalidate!
    proposal_ids = proposals.pluck(:id)
    reviewer_ids = reviewers.pluck(:id)

    Review.upsert_all(
      proposal_ids.product(reviewer_ids).map do |proposal_id, user_id|
        {
          evaluation_id: id,
          proposal_id:,
          user_id:,
          status: "pending",
          created_at: Time.current,
          updated_at: Time.current
        }
      end,
      unique_by: %i[evaluation_id proposal_id user_id],
      on_duplicate: :skip
    )
  end
end
