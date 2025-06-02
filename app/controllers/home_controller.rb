class HomeController < ApplicationController
  skip_authentication

  def index
    render inertia: "home/Index"
  end
end
