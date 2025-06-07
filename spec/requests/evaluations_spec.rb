require "rails_helper"

describe "/evaluations" do
  let_it_be(:reviewer) { create(:reviewer) }
  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer]) }

  before { sign_in(reviewer) }

  describe "GET /", :inertia do
    subject { get "/evaluations" }

    context "when reviewer has multiple evaluations" do
      let_it_be(:evaluation2) { create(:evaluation, reviewers: [reviewer]) }

      it "renders the index page with evaluations" do
        subject

        expect(response).to be_successful
        expect(inertia).to render_component "evaluations/Index"
        expect(inertia.props[:evaluations].as_json.size).to eq reviewer.evaluations.count
      end
    end

    context "when reviewer has only one evaluation" do
      it "redirects to the evaluation show page" do
        subject

        expect(response).to redirect_to(evaluation_reviews_path(evaluation))
      end
    end
  end
end
