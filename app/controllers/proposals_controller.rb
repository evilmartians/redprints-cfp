class ProposalsController < ApplicationController
  before_action :set_cfp, only: [:new, :create]
  before_action :set_proposal, only: [:show, :edit, :update, :destroy]

  def index
    proposals = serialize(current_user.proposals)

    render inertia: "proposals/Index", props: {proposals:}
  end

  def new
    form = ProposalForm.with(user: current_user).new(cfp_id: @cfp.id)

    render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), cfp: serialize(@cfp), speaker: serialize(form.speaker_profile)}
  end

  def create
    form = ProposalForm.with(user: current_user).from(params.require(:proposal))

    if form.save
      inertia_location proposals_path
    else
      render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), cfp: serialize(@cfp), speaker: serialize(form.speaker_profile), errors: form.errors}
    end
  end

  def show
    render inertia: "proposals/Show", props: {proposal: serialize(@proposal), cfp: serialize(@proposal.cfp), speaker: serialize(@proposal.speaker_profile)}
  end

  def edit
    # You can edit accepted proposal even after CFP closed
    return redirect_on_cfp_closed if !@proposal.accepted? && @proposal.cfp.closed?

    form = ProposalForm.with(user: current_user, proposal: @proposal).new

    render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), cfp: serialize(@proposal.cfp), speaker: serialize(form.speaker_profile)}
  end

  def update
    return redirect_on_cfp_closed if !@proposal.accepted? && @proposal.cfp.closed?

    form = ProposalForm.with(user: current_user, proposal: @proposal).from(params.require(:proposal))

    if form.save
      inertia_location proposal_path(@proposal)
    else
      render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), cfp: serialize(@proposal.cfp), speaker: serialize(form.speaker_profile), errors: form.errors}
    end
  end

  def destroy
    @proposal.destroy!
    inertia_location proposals_path
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
