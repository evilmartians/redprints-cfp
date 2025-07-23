module Evaluations
  class ResultsController < ApplicationController
    before_action :set_evaluation

    def index
      proposals = @evaluation.reviewed_proposals.order(score: :desc)
      reviews = @evaluation.reviews
      render inertia: {
        reviews: serialize(reviews),
        evaluation: serialize(@evaluation, current_user:),
        proposals: serialize(proposals, with: ProposalSerializer)
      }
    end

    def create
      raise ActionController::RoutingError.new("Not Found") unless current_user&.admin?

      form = Evaluation::SubmitForm.from(params)

      if form.save
        redirect_to evaluation_results_path(@evaluation), notice: "Successfully updated proposal statuses"
      else
        redirect_to evaluation_results_path(@evaluation), alert: "Failed to update proposal statuses: #{form.errors.full_messages.to_sentence}"
      end
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
