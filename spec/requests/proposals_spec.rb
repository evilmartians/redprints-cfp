require "rails_helper"

describe "/proposals" do
  let_it_be(:user) { create(:user) }
  let_it_be(:proposal) { create(:proposal, user:) }

  before { sign_in(user) }

  describe "GET /", :inertia do
    before_all { create_pair(:proposal, user:) }

    subject { get "/proposals" }

    specify do
      subject

      expect(response).to be_successful

      expect(inertia).to render_component "proposals/Index"

      expect(inertia.props[:proposals].as_json.size).to eq user.proposals.count
    end
  end

  describe "POST /" do
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

    it "notifies the author" do
      expect { subject }
        .to have_delivered_to(ProposalDelivery, :proposal_submitted)
    end

    context "when saving draft" do
      let(:form_params) { {drafting: "1", title: "My draft", speaker_email: "palkan@sf.test"} }

      it "creates a draft" do
        expect { subject }.to change(Proposal.draft.where(user:), :count).by(1)
          .and change(SpeakerProfile.where(email: "palkan@sf.test"), :count).by(1)
      end

      it "does not notify the author" do
        expect { subject }
          .to have_not_delivered_to(ProposalDelivery, :proposal_submitted)
      end
    end
  end

  describe "GET /:id", :inertia do
    subject { get "/proposals/#{proposal.external_id}" }

    specify do
      subject

      expect(response).to be_successful

      expect(inertia).to render_component "proposals/Show"

      proposal_prop = inertia.props[:proposal].as_json

      expect(proposal_prop["id"]).to eq proposal.external_id
      expect(proposal_prop["title"]).to eq proposal.title
    end
  end

  describe "GET /new", :inertia do
    subject { get "/proposals/new" }

    specify do
      subject

      expect(response).to be_successful

      expect(inertia).to render_component "proposals/Form"

      expect(inertia.props[:proposal]).to be_present
      expect(inertia.props[:speaker]).to be_present
    end
  end

  describe "GET /:id/edit", :inertia do
    let_it_be(:proposal) { create(:proposal, user:) }

    subject { get "/proposals/#{proposal.external_id}/edit" }

    specify do
      subject

      expect(response).to be_successful

      expect(inertia).to render_component "proposals/Form"

      proposal_prop = inertia.props[:proposal].as_json

      expect(proposal_prop["id"]).to eq proposal.external_id
      expect(proposal_prop["title"]).to eq proposal.title
      expect(inertia.props[:speaker]).to be_present
    end
  end

  describe "PATCH /:id", :inertia do
    let(:form_params) do
      {
        title: "Updated Title",
        details: "Updated details",
        abstract: "Updated abstract",
        speaker_name: "Updated Name",
        speaker_email: "updated@sf.test"
      }
    end

    before { create(:speaker_profile, email: "test@sf.test", user:) }

    subject { patch "/proposals/#{proposal.external_id}", params: {proposal: form_params} }

    it "updates the proposal" do
      expect { subject }.to change { proposal.reload.title }.to("Updated Title")
      expect(user.reload.speaker_profile.email).to eq("updated@sf.test")
    end

    context "when validation fails", :inertia do
      let(:form_params) { {title: ""} }

      it "renders the form with errors" do
        subject

        expect(response).to be_successful
        expect(inertia).to render_component "proposals/Form"
      end
    end
  end

  describe "DELETE /:id" do
    subject { delete "/proposals/#{proposal.external_id}" }

    it "deletes the proposal" do
      expect { subject }.to change(Proposal, :count).by(-1)
    end
  end
end
