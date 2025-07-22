class Evaluation
  # Distribution class is responsible for assigning reviews for the current evaluation.
  # Primary responsibilities of this object are:
  #   - selecting proposals for review
  #   - creating pending reviews for reviews.
  #
  # The default implementation picks proposals based on the evaluation tracks
  # and create a pending review for each proposal-reviewer pair.
  class Distribution < ActiveRecord::AssociatedObject
    delegate :tracks, :reviewers, to: :evaluation

    def invalidate!
      Review.upsert_all(
        proposal_reviewer_pairs.map do |proposal_id, user_id|
          {
            evaluation_id: evaluation.id,
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

    private

    # Override this method to implement your custom distribution logic.
    # The method must return all the proposal_id-reviewer_id pairs that must
    # have the reviews.
    def proposal_reviewer_pairs
      proposal_ids = proposals.pluck(:id)
      reviewer_ids = reviewers.pluck(:id)

      proposal_ids.product(reviewer_ids)
    end

    def proposals
      @proposals ||= tracks.blank? ? Proposal.submitted : Proposal.submitted.where(track: tracks)
    end
  end
end
