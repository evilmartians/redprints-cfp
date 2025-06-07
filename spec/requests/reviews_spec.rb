require "rails_helper"

describe "/evaluations/:id/reviews" do
  let_it_be(:reviewer) { create(:reviewer) }
  let_it_be(:evaluation) { create(:evaluation, reviewers: [reviewer]) }
  let_it_be(:review) { create(:review, user: reviewer, evaluation:) }

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
end
