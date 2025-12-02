class LitestreamConfig < ApplicationConfig
  # Use a custom name to not interfere with Litestream itself
  config_name :litestream_rails

  attr_config bucket: ENV["BUCKET_NAME"], access_key_id: ENV["AWS_ACCESS_KEY_ID"], secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"]

  def configured? = access_key_id.present? && secret_access_key.present? && bucket.present?
end
