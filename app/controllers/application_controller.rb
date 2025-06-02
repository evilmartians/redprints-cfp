class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  include Authenticated
  # We use Current.host in serializers
  include ActiveStorage::SetCurrent

  inertia_share do
    {
      user: -> { serialize(current_user) if current_user },
      oauth_providers: -> { OmniAuth.providers }
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
