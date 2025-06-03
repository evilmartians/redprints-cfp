class ApplicationSlackNotifier < ApplicationNotifier
  self.driver = AbstractNotifier::SlackDriver

  default webhook_url: AppConfig.slack_notifications_url
end
