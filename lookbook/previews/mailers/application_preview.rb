module Mailers
  class ApplicationPreview < ApplicationMailerPreview
    # @param email "User's email"
    def check(email: "test@sfruby.local")
      render_email(
        ApplicationMailer.check(
          email,
          "Testing email configuration on #{Date.current} from the Tropical on Rails 2026 CFP [#{Rails.env}]"
        )
      )
    end
  end
end
