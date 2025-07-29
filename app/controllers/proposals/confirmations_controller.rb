module Proposals
  class ConfirmationsController < InertiaController
    before_action :set_proposal

    def create
      @proposal.confirmed!
      redirect_to proposal_path(@proposal), notice: "Proposal confirmed successfully."
    end

    def destroy
      @proposal.declined!
      redirect_to proposal_path(@proposal), notice: "Proposal declined successfully."
    end

    private

    def set_proposal
      @proposal = current_user.proposals.accepted.find_by!(external_id: params[:proposal_id])
    end
  end
end
