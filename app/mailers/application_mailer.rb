class ApplicationMailer < ActionMailer::Base
  layout "mailer"

  append_view_path Rails.root.join("app/views/mailers")

  helper_method :user
  attr_reader :user

  before_action do
    next unless params

    @user = params[:user]
  end

  # Email action used to check that mailing configuration is correct.
  #
  # You can send it via the Rake task
  #
  #   dip rake "checks:send_email[some@mail.dev]"
  def check(email, body)
    @body = body
    mail(
      to: email,
      subject: "Test email from the CFP app [#{Rails.env}]"
    )
  end
end
