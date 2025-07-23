# frozen_string_literal: true

namespace :checks do
  desc "Send test email notification to the provided email address"
  task :send_email, [:email] => [:environment] do |_t, args|
    email = args.fetch(:email)
    body = "Testing email configuration on #{Date.current} from the CFP app [#{Rails.env}]"

    $stdout.puts "### Sending email notification to #{email}:\n\n#{body}"

    ApplicationMailer.check(
      email,
      body
    ).deliver_now

    # Make sure background job has been processed in case of
    # async adapter
    ActiveJob::Base.queue_adapter.shutdown if ActiveJob::Base.queue_adapter_name == "async"
  end
end
