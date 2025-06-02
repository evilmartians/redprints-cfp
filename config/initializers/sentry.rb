if ENV["SENTRY_DSN"] && defined?(Sentry)
  Sentry.init do |config|
    config.dsn = ENV["SENTRY_DSN"]
    config.breadcrumbs_logger = [:active_support_logger, :http_logger]

    config.traces_sample_rate = 0.1

    # Rails integration is disabled by default: https://github.com/rails/rails/pull/43625
    config.rails.register_error_subscriber = true

    config.logger = Rails.logger
  end
end
