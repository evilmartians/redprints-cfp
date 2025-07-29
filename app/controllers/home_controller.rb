class HomeController < InertiaController
  skip_authentication

  def index
    session[:redirect_on_auth] = root_path
    render inertia: {
      oauth_providers: OmniAuth.providers
    }
  end
end
