# frozen_string_literal: true

class MailerConfig < ApplicationConfig
  attr_config :reply_to, :from

  def to_default_options = {reply_to:, from:}.compact
end
