class AppConfig < ApplicationConfig
  attr_config :host, :port, :asset_host,
    :slack_notifications_url

  def ssl?
    port == 443
  end

  def asset_host
    super || begin
      proto = ssl? ? "https://" : "http://"
      port_addr = ":#{port}" unless port == 443 || port == 80

      "#{proto}#{host}#{port_addr}"
    end
  end
end
