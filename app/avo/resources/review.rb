class Avo::Resources::Review < Avo::BaseResource
  self.includes = [:proposal, :user]
  self.index_query = -> { query.active }
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: params[:q], m: "or").result(distinct: false) }
  # }

  class StatusFilter < Avo::Filters::MultipleSelectFilter
    self.name = "Status"

    def apply(request, query, value)
      query.where(status: value)
    end

    def options = ::Review.statuses
  end

  class ReviewerFilter < Avo::Filters::MultipleSelectFilter
    self.name = "Reviewer"

    def apply(request, query, value)
      query.where(user_id: value)
    end

    def options = ::User.reviewer.collect { [it.id, it.name] }.to_h
  end

  class ShowInactiveFilter < Avo::Filters::BooleanFilter
    self.name = "Show inactive events"

    def apply(request, query, values)
      return query unless values["show_inactive"]

      query.rewhere(proposals: {cfp_id: [nil, *CFP.all.map(&:id)]})
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
    field :status, as: :select, enum: ::Review.statuses, sortable: true
    field :scores, as: :key_value
    field :score, sortable: true do
      "#{record.score} (#{record.scores.values.join(", ")})" if record.scores.present?
    end
    field :comment, as: :textarea
    field :user, as: :belongs_to, sortable: -> { query.joins(:user).order(users: {name: direction}) }
    field :proposal, as: :belongs_to, sortable: -> { query.joins(:proposal).order(proposals: {title: direction}) }
    field :evaluation, as: :belongs_to
  end

  def filters
    filter ReviewerFilter
    filter StatusFilter
    filter ShowInactiveFilter
  end
end
