module Mailers
  class ApplicationPreview < ApplicationMailerPreview
    # @param email "User's email"
    def check(email: "test@sfruby.local")
      render_email(
        ApplicationMailer.check(
          email,
          "Testing email configuration on #{Date.current} from SF Ruby CFP app [#{Rails.env}]"
        )
      )
    end
  end
end
