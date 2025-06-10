class Avo::Resources::Evaluation < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: params[:q], m: "or").result(distinct: false) }
  # }
  class Invalidate < Avo::BaseAction
    self.name = "Invalidate"
    self.no_confirmation = true
    self.visible = -> { view.show? }

    def handle(query:, fields:, current_user:, resource:, **args)
      evaluation = resource.record
      evaluation.invalidate!

      succeed "Done!"
    end
  end

  def fields
    field :id, as: :id
    field :name, as: :text

    field :tracks, as: :select, enum: ::Proposal.tracks, multiple: true
    field :criteria, as: :tags

    field :deadline, as: :date_time

    field :reviewers, as: :has_many, attach_scope: -> { query.reviewer }
    field :reviewed_proposals, as: :has_many
    field :reviews, as: :has_many
  end

  def actions
    action Invalidate
  end
end
