class AdminController < ApplicationController
  before_action do
    raise ActionController::RoutingError.new("Not Found") unless current_user&.admin?
  end
end
