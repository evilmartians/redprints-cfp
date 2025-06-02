require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
# require "action_text/engine"
require "action_view/railtie"
# require "action_cable/engine"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
require "freezolite/auto"

# Setup inflections as early as possible to correclty load configs
# See https://github.com/palkan/anyway_config/issues/81
require_relative "initializers/inflections"

module SFRubyCFP
  class Application < Rails::Application
    # Configure the path for configuration classes that should be used before initialization
    # NOTE: path should be relative to the project root (Rails.root)
    # config.anyway_config.autoload_static_config_path = "config/configs"
    #
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks templates generators])

    config.time_zone = "UTC"
    # config.eager_load_paths << Rails.root.join("extras")

    # Rails generators configuration.
    config.generators do |g|
      g.helper = false
      g.test_framework :rspec, view_specs: false, routing_specs: false
      g.fixture_replacement :factory_bot, dir: "spec/factories"
    end

    config.solid_queue.connects_to = {database: {writing: :queue, reading: :queue}}

    config.mission_control.jobs.base_controller_class = "AdminController"

    # General application configuration
    config.app = AppConfig
    # Mailers configuration
    config.mailer = MailerConfig
    # SMTP-specific configuration
    config.smtp = SMTPConfig

    if config.app.host
      config.action_controller.default_url_options = config.action_mailer.default_url_options = {
        host: config.app.host,
        port: config.app.port,
        protocol: config.app.ssl? ? "https" : "http"
      }

      config.action_controller.asset_host = config.app.asset_host
      config.action_mailer.asset_host = config.app.asset_host
    end

    config.action_mailer.default_options = config.mailer.to_default_options
    if config.smtp.configured?
      config.action_mailer.delivery_method = :smtp
      config.action_mailer.smtp_settings = config.smtp.to_settings
    end

    config.lookbook_enabled = Rails.env.development? || ENV["LOOKBOOK_ENABLED"] == "true"
    if config.lookbook_enabled
      require "lookbook"

      config.autoload_paths << Rails.root.join("lookbook/previews")
      config.paths["app/views"] << Rails.root.join("lookbook/app/views")
      config.paths["app/controllers"] << Rails.root.join("lookbook/app/controllers")
      config.view_component.preview_paths << Rails.root.join("lookbook/previews")
      config.lookbook.preview_controller = "LookbookController"
    end
  end
end
