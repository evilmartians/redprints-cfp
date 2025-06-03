class ApplicationDelivery < ActiveDelivery::Base
  self.abstract_class = true

  register_line :slack, notifier: true, resolver_pattern: "%{delivery_class}::SlackNotifier"
end
