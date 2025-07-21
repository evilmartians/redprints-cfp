require "rails_helper"

describe ProposalDelivery do
  let(:proposal) { build_stubbed(:proposal) }
  let(:profile) { build_stubbed(:speaker_profile) }

  subject(:delivery) { described_class.with(proposal:, speaker: profile) }

  describe "#proposal_submitted" do
    it "sends an email" do
      expect do
        delivery.proposal_submitted.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it "sends a notification" do
      expect do
        delivery.proposal_submitted.deliver_now
      end.to have_sent_notification(a_hash_including(title: "New Proposal Submitted")).once
    end
  end

  describe "#proposal_accepted" do
    it "sends an email" do
      expect do
        delivery.proposal_accepted.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
  end

  describe "#proposal_rejected" do
    it "sends an email" do
      expect do
        delivery.proposal_rejected.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
  end

  describe "#proposal_waitlisted" do
    it "sends an email" do
      expect do
        delivery.proposal_waitlisted.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
  end
end
