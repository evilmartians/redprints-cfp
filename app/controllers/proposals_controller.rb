class ProposalsController < ApplicationController
  before_action :set_proposal, only: [:show, :edit, :update, :destroy]

  def index
    proposals = serialize(current_user.proposals)

    render inertia: "proposals/Index", props: {proposals:}
  end

  def new
    form = ProposalForm.with(user: current_user).new

    render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), speaker: serialize(form.speaker_profile)}
  end

  def create
    form = ProposalForm.with(user: current_user).from(params.require(:proposal))

    if form.save
      inertia_location proposals_path
    else
      render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), speaker: serialize(form.speaker_profile)}
    end
  end

  def show
    render inertia: "proposals/Show", props: {proposal: serialize(@proposal), speaker: serialize(@proposal.speaker_profile)}
  end

  def edit
    form = ProposalForm.with(user: current_user, proposal: @proposal).new

    render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), speaker: serialize(form.speaker_profile)}
  end

  def update
    form = ProposalForm.with(user: current_user, proposal: @proposal).from(params.require(:proposal))

    if form.save
      inertia_location proposal_path(@proposal)
    else
      render inertia: "proposals/Form", props: {proposal: serialize(form.proposal), speaker: serialize(form.speaker_profile)}
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
end
