class ProposalsController < ApplicationController
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
end
