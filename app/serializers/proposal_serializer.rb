class ProposalSerializer < ApplicationSerializer
  typelize_from Proposal

  attribute :id, &:external_id
  typelize id: "string"
  attributes :cfp_id, :title, :details, :abstract, :pitch, :track, :status, :submitted_at

  attribute :can_edit do
    it.accepted? || !it.cfp.closed?
  end
  typelize can_edit: :boolean
end
