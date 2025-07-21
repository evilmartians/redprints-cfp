class ProposalDelivery < ApplicationDelivery
  delivers :proposal_submitted,
    :proposal_accepted, :proposal_rejected, :proposal_waitlisted
end
