require "rails_helper"

describe Evaluation do
  let_it_be(:proposal_a) { create(:proposal, track: "general") }
  let_it_be(:proposal_b) { create(:proposal, track: "startup") }
  let_it_be(:proposal_c) { create(:proposal, track: "oss") }

  let_it_be(:reviewer_a) { create(:reviewer) }
  let_it_be(:reviewer_b) { create(:reviewer) }

  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer_a], tracks: %w[general oss]) }

  describe "#proposals" do
    subject(:proposals) { evaluation.proposals.to_a }

    it "returns matching proposals" do
      expect(proposals).to include(proposal_a, proposal_c)
      expect(proposals).not_to include(proposal_b)
    end

    context "when tracks are blank" do
      before { evaluation.update!(tracks: nil) }

      it "returns all proposals" do
        expect(proposals).to include(proposal_a, proposal_b, proposal_c)
      end
    end
  end

  describe "#invalidate!" do
    it "creates pending reviews for all missing proposal-reviewer pairs" do
      expect { evaluation.invalidate! }.to change(evaluation.reviews.pending.where(user: reviewer_a), :count).by(2)
      expect { evaluation.invalidate! }.not_to change(Review, :count)

      # add new proposal
      create(:proposal, track: "general")
      expect { evaluation.invalidate! }.to change(evaluation.reviews.pending.where(user: reviewer_a), :count).by(1)

      # add new reviewer
      evaluation.reviewers << reviewer_b
      expect { evaluation.invalidate! }.to change(evaluation.reviews.pending.where(user: reviewer_b), :count).by(3)
    end

    context "when submitted reviews exist" do
      let_it_be(:review) { create(:review, :submitted, user: reviewer_a, evaluation:, proposal: proposal_a) }

      it "doesn't affect existing reviews" do
        expect { evaluation.invalidate! }.to change(evaluation.reviews.where(user: reviewer_a), :count).by(1)

        expect(review.reload).to be_submitted
      end
    end
  end
end
