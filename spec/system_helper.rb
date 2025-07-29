# frozen_string_literal: true

require "rails_helper"

require "capybara/cuprite"
require "capybara/email"

# Don't wait too long in `have_xyz` matchers
Capybara.default_max_wait_time = 2
# Specify the port to use (for easier debugging)
Capybara.server_port = 3002
# Use Puma with multiple threads to speed up assets serving
Capybara.server = :puma, {Silent: true, Threads: "5:5"}
# Use data-test-id as a test-specific selector
Capybara.test_id = "data-test-id"
Capybara.add_selector(:test_id) do
  xpath do |locator|
    XPath.descendant[XPath.attr(Capybara.test_id) == locator]
  end
end

RSpec.configure do |config|
  config.include Capybara::Email::DSL, type: :system
  config.include AuthTestHelper::System, type: :system
  # Adds #peform_enqueued_jobs and other helpers
  config.include ActiveJob::TestHelper, type: :system

  config.prepend_before(:each, type: :system) do
    driven_by :cuprite,
      screen_size: [1400, 1400],
      options: {
        headless: ENV["HEADY"].blank?,
        slowmo: ENV["SLOWMO"].presence&.to_f
      }
  end

  # Make urls in mailers contain the correct server host
  config.around(:each, type: :system) do |ex|
    # Make sure host and port are set correctly in the app
    was_host = Rails.application.default_url_options[:host]
    was_port = Rails.application.default_url_options[:port]
    was_asset_host = ActionController::Base.asset_host

    Rails.application.default_url_options[:host] = ActionMailer::Base.default_url_options[:host] = Capybara.server_host
    Rails.application.default_url_options[:port] = ActionMailer::Base.default_url_options[:port] = Capybara.server_port
    ActionController::Base.asset_host = ActionMailer::Base.asset_host = "http://#{Capybara.server_host}:#{Capybara.server_port}"

    ex.run
    if was_host
      Rails.application.default_url_options[:host] = ActionMailer::Base.default_url_options[:host] = was_host
    else
      Rails.application.default_url_options.delete(:host)
      ActionMailer::Base.default_url_options.delete(:host)
    end

    if was_port
      Rails.application.default_url_options[:port] = ActionMailer::Base.default_url_options[:port] = was_port
    else
      Rails.application.default_url_options.delete(:port)
      ActionMailer::Base.default_url_options.delete(:port)
    end

    ActionController::Base.asset_host = ActionMailer::Base.asset_host = was_asset_host
  end

  config.after(:suite) do
    ActionDispatch::SystemTesting.rotate_screenshots
  end
end
