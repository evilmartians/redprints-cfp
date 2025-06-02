module Auth
  class OmniauthController < ApplicationController
    skip_before_action :verify_authenticity_token
    skip_authentication

    def create
      form = OAuthForm.new(omniauth_params.merge(user_params))

      if (user = form.save)
        login_user!(user)
        redirect_to after_authentication_path, notice: "Signed in successfully"
      else
        redirect_to auth_sign_in_path, alert: "Authentication failed: #{form.errors.full_messages.to_sentence}"
      end
    end

    def failure
      redirect_to auth_sign_in_path, alert: params[:message]
    end

    private

    def user_params
      {email: omniauth.info.email, name: omniauth.info.name}
    end

    def omniauth_params
      {provider: omniauth.provider, uid: omniauth.uid}
    end

    def omniauth
      request.env["omniauth.auth"]
    end
  end
end
