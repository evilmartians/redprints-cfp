class LitestreamConfig < ApplicationConfig
  # Use a custom name to not interfere with Litestream itself
  config_name :litestream_rails

  attr_config :bucket, :access_key_id, :secret_access_key

  def configured? = access_key_id.present? && secret_access_key.present? && bucket.present?
end
