class ProposalSerializer < ApplicationSerializer
  typelize_from Proposal

  attribute :id, &:external_id
  attributes :title, :details, :abstract, :pitch, :track, :status, :submitted_at
end
