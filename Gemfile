source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.0"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use sqlite3 as the database for Active Record
gem "sqlite3", ">= 2.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Use the database-backed adapters for Active Job
gem "solid_queue"

# Active Record extensions
gem "store_model"
gem "active_record-associated_object"
gem "frozen_record"

gem "nanoid"

# Notifications
gem "active_delivery"

# Authentication
gem "omniauth"
gem "omniauth-google-oauth2"
gem "omniauth-github"
# Provides a mitigation against CVE-2015-9284 [https://github.com/cookpad/omniauth-rails_csrf_protection]
gem "omniauth-rails_csrf_protection"

# The only viable asset pipeline for Rails [https://vite-ruby.netlify.app/guide/rails.html]
gem "vite_rails"
# https://inertia-rails.dev/
gem "inertia_rails"
gem "inertia_rails-contrib"

# https://github.com/yaroslav/bundlebun
gem "bundlebun"

# Storybook
gem "lookbook", require: false
gem "view_component-contrib"

# JSON serialization
gem "alba"
gem "typelizer"
gem "listen", group: :development

# Configuration management
gem "anyway_config"

gem "after_commit_everywhere"

# Admin panel [https://docs.avohq.io/]
gem "avo", ">= 3.2"

gem "mission_control-jobs"

# https://github.com/fractaledmind/litestream-ruby
gem "litestream", group: [:development, :production]

# Freeze string literals automatically
gem "freezolite"

gem "bootsnap", require: false

group :production do
  gem "sentry-ruby", "~> 5.15"
  gem "sentry-rails", "~> 5.15"
end

group :development do
  gem "overmind", require: false
  gem "lefthook", require: false

  gem "letter_opener_web"
end

group :development, :test do
  gem "debug"
end

group :development do
  eval_gemfile "gemfiles/rubocop.gemfile"
end

group :test do
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "faker"
  gem "fuubar"
  gem "test-prof"
  gem "capybara"
  gem "capybara-email"
  gem "cuprite"
  # See https://evilmartians.com/chronicles/system-of-a-test-2-robust-rails-browser-testing-with-siteprism
  gem "site_prism"
end
