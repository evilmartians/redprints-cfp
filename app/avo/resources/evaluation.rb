class Avo::Resources::Evaluation < Avo::BaseResource
  self.index_query = -> { query.active }

  class Invalidate < Avo::BaseAction
    self.name = "Prepare review sheets"
    self.confirmation = false
    self.visible = -> { view.show? }

    def handle(query:, fields:, current_user:, resource:, **args)
      evaluation = resource.record
      evaluation.invalidate!

      succeed "Done!"
    end
  end

  class ShowInactiveFilter < Avo::Filters::BooleanFilter
    self.name = "Show inactive evaluations"

    def apply(request, query, values)
      return query unless values["show_inactive"]

      query.rewhere(cfp_id: [nil, *CFP.all.map(&:id)])
    end

    def options
      {
        show_inactive: "Show Inactive"
      }
    end

    def default
      {
        show_inactive: false
      }
    end
  end

  def fields
    field :id, as: :id
    field :name, as: :text

    field :tracks, as: :select, enum: ::Proposal.tracks, multiple: true
    field :criteria, as: :tags

    field :deadline, as: :date_time

    field :blind, as: :boolean
    field :personal, as: :boolean

    field :reviewers, as: :has_many, attach_scope: -> { query.reviewer }
    field :reviewed_proposals, as: :has_many
    field :reviews, as: :has_many

    field :cfp_id, as: :select, enum: ::CFP.all.map { [it.id, it.id] }, hide_on: :index
  end

  def actions
    action Invalidate
  end

  def filters
    filter ShowInactiveFilter
  end
end
