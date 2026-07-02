class ApplicationController < ActionController::Base
  include Authenticated
  # We use Current.host in serializers
  include ActiveStorage::SetCurrent

  inertia_share do
    {
      user: -> { serialize(current_user) if current_user },
      flash: -> { flash.to_hash },
      primary_cfp: -> { serialize(CFP.primary) }
    }
  end

  private

  def authenticate_reviewer!
    return if current_user&.admin? || current_user&.reviewer?

    redirect_to root_path
  end

  def serialize(obj, with: nil, **params)
    return {} unless obj

    serializer = with || begin
      model = obj.try(:model) || obj.class
      "#{model.name}Serializer".constantize
    end

    serializer.new(obj, params:)
  end
end
