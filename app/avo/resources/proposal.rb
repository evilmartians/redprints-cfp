class Avo::Resources::Proposal < Avo::BaseResource
  self.includes = [:user]

  self.find_record_method = -> {
    if id.is_a?(Array)
      (id.first.to_i == 0) ? query.where(external_id: id) : query.where(id:)
    else
      (id.to_i == 0) ? query.find_by!(external_id: id) : query.find(id)
    end
  }

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :track, as: :select, enum: ::Proposal.tracks
    field :status, as: :select, enum: ::Proposal.statuses
    field :title, as: :text

    field :abstract, as: :textarea, hide_on: :index
    field :details, as: :textarea, hide_on: :index
    field :pitch, as: :textarea, hide_on: :index

    field :submitted_at, as: :date
  end
end
