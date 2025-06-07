require "rails_helper"

describe Proposal do
  describe "#invalidate_score!" do
    let_it_be(:proposal) { create(:proposal, track: "general") }
    let_it_be(:evaluation) { create_default(:evaluation) }

    it "updates score and reviews_count and take into account only submitted reviews" do
      # pending should not affect scores
      create(:review, proposal:)
      old_review = create(:review, :submitted, proposal:, score: 9)

      expect(proposal).to have_attributes(
        reviews_count: 0,
        score: 0
      )

      proposal.invalidate_scores!

      expect(proposal.reload).to have_attributes(
        reviews_count: 1,
        score: 9
      )

      create(:review, :submitted, proposal:, score: 4)

      proposal.invalidate_scores!

      expect(proposal.reload).to have_attributes(
        reviews_count: 2,
        score: 13
      )

      old_review.update!(score: 10)

      proposal.invalidate_scores!

      expect(proposal.reload).to have_attributes(
        reviews_count: 2,
        score: 14
      )
    end
  end
end
