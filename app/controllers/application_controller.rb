class ApplicationController < ActionController::Base
  include Authenticated
  # We use Current.host in serializers
  include ActiveStorage::SetCurrent

  inertia_share do
    {
      user: -> { serialize(current_user) if current_user }
    }
  end

  private

  def inertia_request? = request.headers["HTTP_X_INERTIA"] == "true"

  def serialize(obj, with: nil, **params)
    return {} unless obj

    serializer = with || begin
      model = obj.try(:model) || obj.class
      "#{model.name}Serializer".constantize
    end

    serializer.new(obj, params:)
  end
end
