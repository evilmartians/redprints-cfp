require "spec_helper"

ENV["RAILS_ENV"] = "test"

begin
  require_relative "../config/environment"
rescue => e
  warn "Could not load Rails: #{e.message}\n#{e.backtrace.take(5).join("\n")}"
  exit(1)
end

require "rspec/rails"

Rails.root.glob("spec/support/**/*.rb").sort_by(&:to_s).each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

require "test_prof/recipes/logging"
require "test_prof/recipes/rspec/let_it_be"

TestProf::LetItBe.configure do |config|
  config.default_modifiers[:refind] = true
end

RSpec.configure do |config|
  config.use_transactional_fixtures = true

  config.filter_run_excluding type: :system unless ARGV.join.match?(/\bspec\/system/) || config.filter.rules[:type] == "system"

  config.include AuthTestHelper::Integration, type: :request
  config.prepend_before(:each, type: :request) do
    # To make sure cookies set in tests for the correct domain
    host! Rack::Test::DEFAULT_HOST
  end

  config.infer_spec_type_from_file_location!
  config.define_derived_metadata(file_path: %r{/spec/}) do |metadata|
    # do not overwrite type if it's already set
    next if metadata.key?(:type)

    match = metadata[:location].match(%r{/spec/([^/]+)/})
    metadata[:type] = match[1].singularize.to_sym
  end

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!

  unless ENV["FULLTRACE"]
    config.filter_rails_from_backtrace!

    # Request/Rack middlewares
    config.filter_gems_from_backtrace "railties", "rack", "rack-test"
  end

  # Add `travel_to`
  # See https://andycroll.com/ruby/replace-timecop-with-rails-time-helpers-in-rspec/
  config.include ActiveSupport::Testing::TimeHelpers
  config.include FactoryBot::Syntax::Methods

  config.after do
    # Clear ActiveJob jobs
    if ActiveJob::QueueAdapters::TestAdapter === ActiveJob::Base.queue_adapter
      ActiveJob::Base.queue_adapter.enqueued_jobs.clear
      ActiveJob::Base.queue_adapter.performed_jobs.clear
    end

    # Clear deliveries
    ActionMailer::Base.deliveries.clear
  end
end
