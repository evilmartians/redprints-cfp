class ApplicationController < ActionController::Base
  include Authenticated
  # We use Current.host in serializers
  include ActiveStorage::SetCurrent

  inertia_share do
    {
      user: -> { serialize(current_user) if current_user },
      flash: -> { flash.to_hash },
      cfp_closed: -> { AppConfig.cfp_closed? },
      startup_cfp_closed: -> { AppConfig.startup_cfp_closed? }
    }
  end

  private

  def authenticate_reviewer!
    return if current_user&.admin? || current_user&.reviewer?

    if inertia_request?
      inertia_location root_path
    else
      redirect_to root_path
    end
  end

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
