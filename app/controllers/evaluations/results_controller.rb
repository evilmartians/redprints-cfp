module Evaluations
  class ResultsController < ApplicationController
    before_action :set_evaluation

    def index
      proposals = @evaluation.proposals.order(score: :desc)
      reviews = @evaluation.reviews
      render inertia: "results/Index", props: {
        reviews: serialize(reviews),
        evaluation: serialize(@evaluation, current_user:),
        proposals: serialize(proposals, with: ProposalSerializer)
      }
    end

    def create
      raise ActionController::RoutingError.new("Not Found") unless current_user&.admin?

      # TODO: Implement it
      # TEMP
      notice = params[:proposals].each_with_object({}) do |data, acc|
        acc[data[:id]] = data[:status]
        acc
      end.then do |proposal_statuses|
        proposals = @evaluation.proposals.where(external_id: proposal_statuses.keys).includes(:speaker_profile).index_by(&:external_id)

        proposal_statuses.map do |id, status|
          proposal = proposals[id]
          if proposal
            "#{proposal.title} by #{proposal.speaker_profile.name} is #{status}"
          else
            "WARNING: proposal not found: #{id}"
          end
        end
      end.join("\n")

      redirect_to evaluation_results_path(@evaluation), notice:
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
