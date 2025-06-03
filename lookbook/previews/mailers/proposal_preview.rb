module Mailers
  class ProposalPreview < ApplicationMailerPreview
    def proposal_submitted
      speaker = SpeakerProfile.new(email: "speaker@sfruby.test")
      proposal = Proposal.new(external_id: "test-proposa", title: "Why you don't need gems")

      render_email(ProposalMailer.with(proposal:, speaker:).proposal_submitted)
    end
  end
end
