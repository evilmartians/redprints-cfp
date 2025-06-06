class Avo::Resources::User < Avo::BaseResource
  def fields
    field :id, as: :id
    field :email, as: :text, link_to_record: true
    field :name, as: :text
    field :admin, as: :boolean
    field :role, as: :select, enum: ::User.roles

    field :proposals, as: :has_many
    field :speaker_profile, as: :has_one
  end
end
