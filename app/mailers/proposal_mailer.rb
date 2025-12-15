class ProposalMailer < ApplicationMailer
  def proposal_submitted
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "Thank you for your proposal")
  end

  def proposal_accepted
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "You’re In! Please Confirm Your Tropical on Rails Talk")
  end

  def proposal_rejected
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "Thanks for Submitting to Tropical on Rails")
  end

  def proposal_waitlisted
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "Your Tropical on Rails Proposal—Waitlisted")
  end
end
