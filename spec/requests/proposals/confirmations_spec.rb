require "rails_helper"

describe "/proposals/:proposal_id/confirmations" do
  let_it_be(:user) { create(:user) }
  let_it_be(:proposal) { create(:proposal, user:, status: :accepted) }

  before { sign_in(user) }

  describe "POST /" do
    subject { post "/proposals/#{proposal.external_id}/confirmation" }

    it "changes status to confirmed" do
      expect { subject }.to change { proposal.reload.status }.from("accepted").to("confirmed")
    end

    context "when proposal is not accepted" do
      before { proposal.waitlisted! }

      it "does not change the status" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        expect(proposal.reload).to be_waitlisted
      end
    end

    context "when accessing another user's proposal" do
      let(:proposal) { create(:proposal, status: :accepted) }

      it "does not change the status" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        expect(proposal.reload).to be_accepted
      end
    end
  end

  describe "DELETE /" do
    subject { delete "/proposals/#{proposal.external_id}/confirmation" }

    it "changes status to declined" do
      expect { subject }.to change { proposal.reload.status }.from("accepted").to("declined")
    end

    context "when proposal is not accepted" do
      before { proposal.waitlisted! }

      it "does not change the status" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        expect(proposal.reload).to be_waitlisted
      end
    end

    context "when accessing another user's proposal" do
      let(:proposal) { create(:proposal, status: :accepted) }

      it "does not change the status" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        expect(proposal.reload).to be_accepted
      end
    end
  end
end
