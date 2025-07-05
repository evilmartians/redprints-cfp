class Avo::Resources::SpeakerProfile < Avo::BaseResource
  self.includes = [:user]
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: params[:q], m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :name, as: :text, required: true
    field :email, as: :text, required: true
    field :company, as: :text
    field :role, as: :text
    field :photo, as: :file

    field :user, as: :belongs_to

    field :bio, as: :textarea, limit: 1000, hide_on: :index
    field :socials, as: :textarea, limit: 400
  end

  def actions
    action Avo::Actions::ExportSpeakerProfiles
  end
end
