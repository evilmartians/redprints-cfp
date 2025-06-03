class Avo::Resources::Proposal < Avo::BaseResource
  self.includes = [:user]

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :track, as: :select, enum: ::Proposal.tracks
    field :status, as: :select, enum: ::Proposal.statuses
    field :title, as: :text

    field :abstract, as: :textarea, hide_on: :index
    field :details, as: :textarea, hide_on: :index
    field :pitch, as: :textarea, hide_on: :index

    field :submitted_at
  end
end
