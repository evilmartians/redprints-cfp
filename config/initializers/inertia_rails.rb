InertiaRails.configure do |config|
  config.ssr_enabled = ViteRuby.config.ssr_build_enabled
  config.version = ViteRuby.digest

  config.encrypt_history = true if Rails.env.production?
end
