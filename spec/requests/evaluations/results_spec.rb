require "rails_helper"

describe "/evaluations/:id/results" do
  let_it_be(:reviewer) { create(:reviewer) }
  let_it_be(:proposal) { create(:proposal, :submitted, track: "general") }
  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer], tracks: ["general"], criteria: %w[Clarity Novelty]) }
  let_it_be(:review) { create(:review, user: reviewer, evaluation:, proposal:, status: :submitted, score: 8, scores: {"Clarity" => 4, "Novelty" => 4}) }

  before { sign_in(reviewer) }

  describe "GET /", :inertia do
    subject { get "/evaluations/#{evaluation.id}/results" }

    it "renders results index page" do
      subject
      expect(inertia).to render_component("results/Index")
    end
  end

  describe "POST /" do
    let(:form_params) do
      [{id: proposal.external_id, status: "accepted"}]
    end

    let(:params) { {proposals: form_params} }

    subject { post "/evaluations/#{evaluation.id}/results", params: }

    context "when user is admin" do
      before { reviewer.update!(admin: true) }

      it "updates the proposal status and delivers a notification" do
        expect { subject }.to change { proposal.reload.status }.from("submitted").to("accepted")
          .and have_delivered_to(ProposalDelivery, :proposal_accepted).with(a_hash_including(proposal: proposal))
        expect(response).to redirect_to(evaluation_results_path(evaluation))
      end
    end

    context "when user is not admin" do
      it "raises routing error" do
        expect { subject }.to raise_error(ActionController::RoutingError, "Not Found")
      end
    end
  end
end
