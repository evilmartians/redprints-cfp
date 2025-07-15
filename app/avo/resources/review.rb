class Avo::Resources::Review < Avo::BaseResource
  self.includes = [:proposal, :user]
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: params[:q], m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :status, as: :select, enum: ::Review.statuses, sortable: true
    field :scores, as: :key_value
    field :score, sortable: true
    field :comment, as: :textarea
    field :user, as: :belongs_to, sortable: -> { query.joins(:user).order(users: {name: direction}) }
    field :proposal, as: :belongs_to, sortable: -> { query.joins(:proposal).order(proposals: {title: direction}) }
    field :evaluation, as: :belongs_to
  end
end
