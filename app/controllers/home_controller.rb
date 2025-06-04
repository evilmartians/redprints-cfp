class HomeController < ApplicationController
  skip_authentication

  def index
    session[:redirect_on_auth] = root_path
    render inertia: "home/Index", props: {oauth_providers: OmniAuth.providers}
  end

  def startups
    session[:redirect_on_auth] = startups_path
    render inertia: "home/Startups", props: {oauth_providers: OmniAuth.providers}
  end
end
