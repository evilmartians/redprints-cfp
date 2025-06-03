require "rails_helper"

describe "/proposals" do
  let_it_be(:user) { create(:user) }

  before { sign_in(user) }

  describe "GET /index", :inertia do
    before_all { create_pair(:proposal, user:) }

    subject { get "/proposals" }

    specify do
      subject

      expect(response).to be_successful

      expect(inertia).to render_component "proposals/Index"

      expect(inertia.props[:proposals].as_json.size).to eq 2
    end
  end

  describe "POST /create" do
    let(:form_params) do
      attributes_for(:proposal).slice(:title, :details, :abstract, :pitch, :track).merge(
        speaker_name: "Vova",
        speaker_email: "palkan@sf.test",
        speaker_bio: "A human"
      )
    end

    subject { post proposals_url, params: {proposal: form_params} }

    it "creates a new proposal" do
      expect { subject }.to change(Proposal.submitted.where(user:), :count).by(1)
        .and change(SpeakerProfile.where(email: "palkan@sf.test"), :count).by(1)
    end

    it "notifies the author"

    context "when saving draft" do
      it "does not notify the author"
    end
  end
end
