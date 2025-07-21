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

    mail(to: @speaker.email, subject: "Your proposal has been accepted")
  end

  def proposal_rejected
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "Your proposal has NOT been accepted")
  end

  def proposal_waitlisted
    @proposal = params.fetch(:proposal)
    @speaker = params.fetch(:speaker)
    return unless @speaker

    mail(to: @speaker.email, subject: "Your proposal has been waitlisted")
  end
end
