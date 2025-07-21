module Mailers
  class ProposalPreview < ApplicationMailerPreview
    def proposal_submitted
      speaker = SpeakerProfile.new(email: "speaker@sfruby.test")
      proposal = Proposal.new(external_id: "test-proposa", title: "Why you don't need gems")

      render_email(ProposalMailer.with(proposal:, speaker:).proposal_submitted)
    end

    def proposal_accepted
      speaker = SpeakerProfile.new(email: "speaker@sfruby.test")
      proposal = Proposal.new(external_id: "sf-proposal", title: "SF is the future of Ruby", status: :accepted)

      render_email(ProposalMailer.with(proposal:, speaker:).proposal_accepted)
    end

    def proposal_waitlisted
      speaker = SpeakerProfile.new(email: "speaker@sfruby.test")
      proposal = Proposal.new(external_id: "sf-proposal", title: "You don't need Rails anymore", status: :waitlisted)

      render_email(ProposalMailer.with(proposal:, speaker:).proposal_waitlisted)
    end

    def proposal_rejected
      speaker = SpeakerProfile.new(email: "speaker@sfruby.test")
      proposal = Proposal.new(external_id: "sf-proposal", title: "Advanced prompt engineering for Rubyists", status: :rejected)

      render_email(ProposalMailer.with(proposal:, speaker:).proposal_rejected)
    end
  end
end
