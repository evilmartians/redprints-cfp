class ApplicationController < ActionController::Base
  include Authenticated
  # We use Current.host in serializers
  include ActiveStorage::SetCurrent

  private

  def authenticate_reviewer!
    return if current_user&.admin? || current_user&.reviewer?

    redirect_to root_path
  end
end
