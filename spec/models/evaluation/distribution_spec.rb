require "rails_helper"

describe Evaluation::Distribution do
  let_it_be(:proposal_a) { create(:proposal, track: "general") }
  let_it_be(:proposal_b) { create(:proposal, track: "startup") }
  let_it_be(:proposal_c) { create(:proposal, track: "oss") }
  let_it_be(:proposal_draft) { create(:proposal, :draft, track: "general") }
  let_it_be(:proposal_accepted) { create(:proposal, track: "general", status: "accepted") }
  let_it_be(:proposal_rejected) { create(:proposal, track: "oss", status: "rejected") }

  let_it_be(:reviewer_a) { create(:reviewer) }
  let_it_be(:reviewer_b) { create(:reviewer) }

  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer_a], tracks: %w[general oss]) }

  subject(:distribution) { evaluation.distribution }

  describe "#invalidate!" do
    it "creates pending reviews for all missing proposal-reviewer pairs" do
      expect { evaluation.invalidate! }.to change(evaluation.reviews.pending.where(user: reviewer_a), :count).by(2)
      expect { evaluation.invalidate! }.not_to change(Review, :count)

      # add new proposal
      create(:proposal, track: "general", status: "submitted")
      expect { evaluation.invalidate! }.to change(evaluation.reviews.pending.where(user: reviewer_a), :count).by(1)

      # add new proposal with non-matching track
      create(:proposal, track: "startup", status: "submitted")
      expect { evaluation.invalidate! }.not_to change(evaluation.reviews, :count)

      # add new proposal with non-matching status
      create(:proposal, track: "general", status: "accepted")
      expect { evaluation.invalidate! }.not_to change(evaluation.reviews, :count)

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
