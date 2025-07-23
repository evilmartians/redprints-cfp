module Auth
  class SessionsController < ApplicationController
    layout "island"

    skip_authentication only: %i[new]

    def new
    end

    def destroy
      cookies.delete(:session_token)
      reset_session

      redirect_to root_path
    end
  end
end
