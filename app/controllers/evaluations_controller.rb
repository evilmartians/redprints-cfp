class EvaluationsController < ApplicationController
  before_action :authenticate_reviewer!

  def index
    evaluations = current_user.evaluations

    if evaluations.size == 1
      redirect_to evaluation_reviews_path(evaluations.first)
    else
      render inertia: "evaluations/Index", props: {evaluations: serialize(evaluations)}
    end
  end
end
