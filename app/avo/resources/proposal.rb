class Avo::Resources::Proposal < Avo::BaseResource
  self.includes = [:user]

  self.search = {
    query: -> {
      proposals_table = ::Proposal.arel_table
      users_table = ::User.arel_table

      query.joins(:user).where(
        proposals_table[:title].matches("%#{params[:q]}%")
          .or(users_table[:name].matches("%#{params[:q]}%"))
          .or(users_table[:email].matches("%#{params[:q]}%"))
      )
    },
    item: -> do
      {
        title: "#{record.title} (#{record.user.name} — #{record.user.email})"
      }
    end
  }

  self.find_record_method = -> {
    if id.is_a?(Array)
      Integer(id.first, exception: false) ? query.where(id:) : query.where(external_id: id)
    else
      Integer(id, exception: false) ? query.find(id) : query.find_by!(external_id: id)
    end
  }

  class TrackFilter < Avo::Filters::MultipleSelectFilter
    self.name = "Track"

    def apply(request, query, value)
      query.where(track: value)
    end

    def options = ::Proposal.tracks
  end

  class StatusFilter < Avo::Filters::MultipleSelectFilter
    self.name = "Status"

    def apply(request, query, value)
      query.where(status: value)
    end

    def options = ::Proposal.statuses
  end

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

  def filters
    filter TrackFilter
    filter StatusFilter
  end
end
