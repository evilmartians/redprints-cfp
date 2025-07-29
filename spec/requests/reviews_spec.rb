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
      expect(inertia).to render_component "reviews/index"
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

    context "when evaluation is personal" do
      before { evaluation.update!(personal: true) }

      it "updates only the review score" do
        expect { subject }.to change { review.reload.comment }.to("Good vibes")
          .and change { review.status }.to("submitted")
          .and change { proposal.reload.reviews_count }.by(0)
          .and change { proposal.score }.by(0)
      end
    end

    context "when some scores are missing" do
      before { form_params[:scores].delete("Novelty") }

      it "doesn't update anything" do
        expect { subject }.not_to change { proposal.reload.reviews_count }
        expect(review.reload).to be_pending
      end
    end

    context "when evaluation deadline has passed" do
      let!(:past_evaluation) { create(:evaluation, reviewers: [reviewer], tracks: ["general"], criteria: %w[Clarity Novelty], deadline: 1.day.ago) }
      let!(:past_review) { create(:review, user: reviewer, evaluation: past_evaluation, proposal: proposal) }

      subject { patch "/reviews/#{past_review.id}", params: {review: form_params} }

      it "redirects back with an alert message" do
        subject
        expect(response).to have_http_status(:redirect)
        expect(response).to redirect_to(review_path(past_review))
        expect(flash[:alert]).to eq("The evaluation deadline has passed. You can no longer submit or edit reviews.")
      end

      it "doesn't update the review" do
        expect { subject }.not_to change { past_review.reload.comment }
        expect(past_review.reload).to be_pending
      end
    end

    context "when evaluation has no deadline" do
      let!(:no_deadline_evaluation) { create(:evaluation, reviewers: [reviewer], tracks: ["general"], criteria: %w[Clarity Novelty], deadline: nil) }
      let!(:no_deadline_review) { create(:review, user: reviewer, evaluation: no_deadline_evaluation, proposal: proposal) }

      subject { patch "/reviews/#{no_deadline_review.id}", params: {review: form_params} }

      it "updates the review normally" do
        expect { subject }.to change { no_deadline_review.reload.comment }.to("Good vibes")
          .and change { no_deadline_review.status }.to("submitted")
      end
    end
  end
end
