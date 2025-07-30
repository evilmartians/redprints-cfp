Rails.application.configure do
  litestream_config = LitestreamConfig.new
  next unless litestream_config.configured?

  config.litestream.replica_bucket = litestream_config.bucket
  config.litestream.replica_key_id = litestream_config.access_key_id
  config.litestream.replica_access_key = litestream_config.secret_access_key

  # Configure db paths via ENV
  ENV["LITESTREAM_SOURCE_DB_PATH"] ||= File.join(ENV.fetch("DATA_PATH", "storage"), "#{Rails.env}.sqlite3").to_s
  ENV["LITESTREAM_REPLICA_DB_PATH"] ||= File.join("sfruby-cfp-data", "#{Rails.env}.sqlite3.replica").to_s
end
