module AuthTestHelper
  class << self
    def signed_cookie(name, value)
      cookie_jar = ActionDispatch::Request.new(Rails.application.env_config.deep_dup).cookie_jar
      cookie_jar.signed[name] = value
      cookie_jar[name]
    end
  end

  module Integration
    def sign_in(user)
      raise ArgumentError, "User must have an auth token" unless user.auth_token

      cookies[:session_token] = AuthTestHelper.signed_cookie(:session_token, user.auth_token)
    end

    def sign_out = cookies.delete(:session_token)
  end

  module System
    def sign_in_as(user)
      raise ArgumentError, "User must have an auth token" unless user.auth_token

      page.driver.set_cookie "session_token", AuthTestHelper.signed_cookie(:session_token, user.auth_token)
    end

    def sign_out = page.driver.set_cookie "session_token", ""
  end
end
