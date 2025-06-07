class ProposalDelivery
  class SlackNotifier < ApplicationSlackNotifier
    def proposal_submitted
      proposal = params.fetch(:proposal)
      speaker = params.fetch(:speaker)

      notification(
        color: "good",
        title: "New Proposal Submitted",
        body: "Proposal <#{resources_proposal_url(id: proposal.id)}|#{proposal.title}> (#{proposal.track}) has been submitted by #{speaker.name}"
      )
    end
  end
end
