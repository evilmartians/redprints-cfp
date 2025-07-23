class ProposalsController < ApplicationController
  before_action :set_cfp, only: [:new, :create]
  before_action :set_proposal, only: [:show, :edit, :update, :destroy]

  def index
    render inertia: {proposals: serialize(current_user.proposals)}
  end

  def new
    form = ProposalForm.with(user: current_user).new(cfp_id: @cfp.id)

    render inertia: {proposal: serialize(form.proposal), cfp: serialize(@cfp), speaker: serialize(form.speaker_profile)}
  end

  def create
    form = ProposalForm.with(user: current_user).from(params.require(:proposal))

    if form.save
      redirect_to proposals_path
    else
      redirect_to new_proposal_path, inertia: {errors: form.errors}
    end
  end

  def show
    render inertia: {proposal: serialize(@proposal), cfp: serialize(@proposal.cfp), speaker: serialize(@proposal.speaker_profile)}
  end

  def edit
    # You can edit an accepted proposal even after CFP closed
    return redirect_on_cfp_closed if !@proposal.accepted? && @proposal.cfp.closed?

    form = ProposalForm.with(user: current_user, proposal: @proposal).new

    render inertia: {proposal: serialize(form.proposal), cfp: serialize(@proposal.cfp), speaker: serialize(form.speaker_profile)}
  end

  def update
    return redirect_on_cfp_closed if !@proposal.accepted? && @proposal.cfp.closed?

    form = ProposalForm.with(user: current_user, proposal: @proposal).from(params.require(:proposal))

    if form.save
      redirect_to proposal_path(@proposal)
    else
      redirect_to edit_proposal_path(@proposal), inertia: {errors: form.errors}
    end
  end

  def destroy
    @proposal.destroy!
    redirect_to proposals_path
  end

  private

  def set_proposal
    @proposal = current_user.proposals.find_by!(external_id: params[:id])
  end

  def set_cfp
    @cfp = CFP.find_by(id: params[:cfp_id].presence || params.dig(:proposal, :cfp_id)) || CFP.primary
    redirect_on_cfp_closed if @cfp.closed?
  end

  def redirect_on_cfp_closed
    redirect_back(fallback_location: root_path, alert: "CFP is now closed")
  end
end
