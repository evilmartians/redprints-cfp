class Avo::Resources::Proposal < Avo::BaseResource
  self.includes = [:user]

  self.find_record_method = -> {
    if id.is_a?(Array)
      Integer(id.first, exception: false) ? query.where(id:) : query.where(external_id: id)
    else
      Integer(id, exception: false) ? query.find(id) : query.find_by!(external_id: id)
    end
  }

  class InvalidateScore < Avo::BaseAction
    self.name = "Invalidate Score"
    self.no_confirmation = true
    self.visible = -> { view.show? }

    def handle(query:, fields:, current_user:, resource:, **args)
      evaluation = resource.record
      evaluation.invalidate_scores!

      succeed "Done!"
    end
  end

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :track, as: :select, enum: ::Proposal.tracks
    field :status, as: :select, enum: ::Proposal.statuses
    field :title, as: :text

    field :score, as: :number, sortable: true
    field :reviews_count, as: :number, sortable: true

    field :abstract, as: :textarea, hide_on: :index
    field :details, as: :textarea, hide_on: :index
    field :pitch, as: :textarea, hide_on: :index

    field :submitted_at, as: :date
  end

  def actions
    action InvalidateScore
  end
end
