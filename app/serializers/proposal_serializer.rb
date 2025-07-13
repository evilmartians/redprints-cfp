class ProposalSerializer < ApplicationSerializer
  typelize_from Proposal

  attribute :id, &:external_id
  attributes :title, :details, :abstract, :pitch, :track, :status, :submitted_at

  attribute :can_edit do
    it.accepted? || !(
      (it.track == "startup") ? AppConfig.startup_cfp_closed? : AppConfig.cfp_closed?
    )
  end
  typelize can_edit: :boolean
end
