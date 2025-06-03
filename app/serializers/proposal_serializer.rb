class ProposalSerializer < ApplicationSerializer
  typelize_from Proposal

  attributes :id, :title, :details, :abstract, :pitch, :track, :status
end
