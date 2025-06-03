class ApplicationDelivery < ActiveDelivery::Base
  self.abstract_class = true

  # TODO: register Slack line
end
