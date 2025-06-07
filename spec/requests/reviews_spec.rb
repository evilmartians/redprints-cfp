require "rails_helper"

describe "/evaluations/:id/reviews" do
  let_it_be(:reviewer) { create(:reviewer) }
  let_it_be(:proposal) { create(:proposal, :submitted, track: "general") }
  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer], tracks: ["general"], criteria: %w[Clarity Novelty]) }
  let_it_be(:review) { create(:review, user: reviewer, evaluation:, proposal:) }

  before { sign_in(reviewer) }

  describe "GET /", :inertia do
    subject { get "/evaluations/#{evaluation.id}/reviews" }

    it "renders the index page with the reviews" do
      subject

      expect(response).to be_successful
      expect(inertia).to render_component "reviews/Index"
      expect(inertia.props[:reviews].as_json.size).to eq 1
    end

    context "when evaluation does not belong to the reviewer" do
      let(:other_evaluation) { create(:evaluation) }

      subject { get "/evaluations/#{other_evaluation.id}/reviews" }

      it "raises an ActiveRecord::RecordNotFound error" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe "PATCH /:id" do
    let(:form_params) do
      {
        comment: "Good vibes",
        scores: {
          "Novelty" => 3,
          "Clarity" => 4
        }
      }
    end

    subject { patch "/reviews/#{review.id}", params: {review: form_params} }

    it "updates the review and the proposal's score" do
      expect { subject }.to change { review.reload.comment }.to("Good vibes")
        .and change { review.status }.to("submitted")
        .and change { proposal.reload.reviews_count }.by(1)
        .and change { proposal.score }.by(7)
    end

    context "when some scores are missing" do
      before { form_params[:scores].delete("Novelty") }

      it "doesn't update anything" do
        expect { subject }.not_to change { proposal.reload.reviews_count }
        expect(review.reload).to be_pending
      end
    end
  end
end
