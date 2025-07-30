class HomeController < ApplicationController
  skip_authentication

  def index
    session[:redirect_on_auth] = root_path
    render inertia: {
      oauth_providers: OmniAuth.providers,
      startup_cfp: serialize(CFP.startups)
    }
  end

  def startups
    session[:redirect_on_auth] = startups_path
    render inertia: {
      oauth_providers: OmniAuth.providers,
      startup_cfp: serialize(CFP.startups)
    }
  end
end
