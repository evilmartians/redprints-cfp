class AppConfig < ApplicationConfig
  attr_config :host, :port, :asset_host,
    :slack_notifications_url, :cfp_deadline, :startup_deadline

  coerce_types cfp_deadline: :datetime, startup_deadline: :datetime

  def cfp_closed? = cfp_deadline.present? && Time.current > cfp_deadline

  def startup_cfp_closed? = startup_deadline.present? && Time.current > startup_deadline

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
