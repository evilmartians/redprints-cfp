class GithubConfig < ApplicationConfig
  attr_config :oauth_key, :oauth_secret, oauth_scope: "read:user,user:email"

  coerce_types oauth_scope: :string

  def oauth_configured?
    oauth_key.present? && oauth_secret.present?
  end
end
