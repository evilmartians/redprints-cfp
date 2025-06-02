# Extend OmniAuth to keep track of active providers
OmniAuth.class_eval do
  class << self
    attr_accessor :providers
    attr_accessor :primary_provider
  end

  self.providers = []
end

OmniAuth::Builder.prepend(Module.new do
  def provider(name, ...)
    OmniAuth.providers << name
    OmniAuth.primary_provider = name
    super
  end
end)

# We need to allow GET requests for Google OAuth
OmniAuth.config.allowed_request_methods << :get

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?

  if GoogleConfig.oauth_configured?
    provider :google_oauth2, GoogleConfig.client_id, GoogleConfig.client_secret,
      image_aspect_ratio: "square",
      image_size: 100
  end

  if GithubConfig.oauth_configured?
    provider :github, GithubConfig.oauth_key, GithubConfig.oauth_secret, scope: GithubConfig.oauth_scope
  end
end
