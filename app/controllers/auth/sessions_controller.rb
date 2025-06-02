module Auth
  class SessionsController < ApplicationController
    layout "island"

    skip_authentication only: %i[new]

    def new
    end

    def destroy
      cookies.delete(:session_token)
      reset_session

      if inertia_request?
        inertia_location root_path
      else
        redirect_to root_path
      end
    end
  end
end
