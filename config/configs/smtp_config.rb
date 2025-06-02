# frozen_string_literal: true

class SMTPConfig < ApplicationConfig
  attr_config :address, :domain, :username, :password,
    port: 587,
    authentication: :plain

  def configured?
    [address, port].all?(&:present?)
  end

  # See https://guides.rubyonrails.org/action_mailer_basics.html#action-mailer-configuration
  def to_settings
    {
      address:,
      authentication:,
      domain:,
      password:,
      port:,
      user_name: username
    }
  end
end
