require "rails_helper"

describe Evaluation::SubmitForm do
  let_it_be(:proposal1) { create(:proposal) }
  let_it_be(:proposal2) { create(:proposal) }
  let_it_be(:proposal3) { create(:proposal, status: :accepted) }

  let(:params) do
    {
      proposals: [
        {id: proposal1.external_id, status: "accepted"},
        {id: proposal2.external_id, status: "rejected"},
        {id: proposal3.external_id, status: "waitlisted"}
      ]
    }
  end

  subject(:form) { described_class.new(params) }

  describe "validations" do
    context "with missing ids or statuses" do
      before do
        params[:proposals] << {external_id: "test", status: "accepted"}
        params[:proposals] << {id: "test"}
      end

      it "is invalid" do
        expect(form).not_to be_valid
        expect(form.errors[:proposals]).to include("proposal at index 4 must have a status")
      end
    end

    context "with blank proposals" do
      before do
        params[:proposals] = {}
      end

      it "is invalid" do
        expect(form).not_to be_valid
        expect(form.errors[:proposals]).to include("can't be blank")
      end
    end

    context "with invalid statuses" do
      before do
        params[:proposals] << {id: proposal1.external_id, status: "invalid"}
      end

      it "is invalid" do
        expect(form).not_to be_valid
        expect(form.errors[:proposals]).to include("proposal at index 3 must have a valid status")
      end
    end
  end

  describe "#save" do
    it "updates proposal statuses for submitted proposals only" do
      expect { form.save }.to change { proposal1.reload.status }.from("submitted").to("accepted")
        .and change { proposal2.reload.status }.from("submitted").to("rejected")
      expect(proposal3.reload).to be_accepted
    end

    it "delivers notifications only to newly updated proposals" do
      expect { form.save }
        .to have_delivered_to(ProposalDelivery).exactly(2).times
        .and have_delivered_to(ProposalDelivery, :proposal_accepted).with(a_hash_including(proposal: proposal1))
        .and have_delivered_to(ProposalDelivery, :proposal_rejected).with(a_hash_including(proposal: proposal2))
    end
  end
end
