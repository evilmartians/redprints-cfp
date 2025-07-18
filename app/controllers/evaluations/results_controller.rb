module Evaluations
  class ResultsController < ApplicationController
    before_action :set_evaluation

    def index
      proposals = @evaluation.proposals.order(score: :desc)
      reviews = @evaluation.reviews
      render inertia: "results/Index", props: {
        reviews: serialize(reviews),
        evaluation: serialize(@evaluation),
        proposals: serialize(proposals, with: ProposalSerializer)
      }
    end

    private

    def set_evaluation
      @evaluation =
        if current_user.admin?
          Evaluation.find(params[:evaluation_id])
        else
          current_user.evaluations.find(params[:evaluation_id])
        end
    end
  end
end
