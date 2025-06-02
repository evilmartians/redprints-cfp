module Authenticated
  extend ActiveSupport::Concern

  included do
    before_action :authenticate!
    helper_method :current_user
  end

  class_methods do
    # Encapsulate authentication callbacks management
    def skip_authentication(**)
      skip_before_action :authenticate!, **
    end
  end

  def authenticate!
    return if current_user

    if inertia_request?
      inertia_location root_path
    else
      redirect_to root_path
    end
  end

  def after_authentication_path
    session.delete(:redirect_on_auth) || root_path
  end

  def current_user
    return @current_user if instance_variable_defined?(:@current_user)

    @current_user =
      if (auth_token = cookies.signed[:session_token])
        User.find_by(auth_token:)
      end
  end

  def login_user!(user)
    raise ArgumentError, "User must have auth token" unless user&.auth_token

    was_auth_path = session.delete(:redirect_on_auth)
    # Prevent session fixation attacks
    reset_session

    session[:redirect_on_auth] = was_auth_path if was_auth_path

    cookies.signed.permanent[:session_token] = {value: user.auth_token, httponly: true}
  end
end
