class GoogleConfig < ApplicationConfig
  attr_config :client_id, :client_secret # OAuth credentials

  def oauth_configured? = client_id.present? && client_secret.present?
end
