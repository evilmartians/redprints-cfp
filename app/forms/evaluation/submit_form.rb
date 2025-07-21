class Evaluation
  class SubmitForm < ApplicationForm
    attribute :proposals, default: []

    # Statuses allowed by the form
    STATUSES = %w[accepted waitlisted rejected].freeze

    validates :proposals, presence: true

    validate :validate_proposals_format

    after_commit :notify_speakers

    attr_reader :updated_proposals

    def submit!
      @updated_proposals = []
      locked_proposals = Proposal.lock.where(external_id: proposals.map { it[:id] }).index_by(&:external_id) # rubocop:disable Rails/Pluck

      proposals.each do
        proposal = locked_proposals[it[:id]]
        next unless proposal

        next unless proposal.submitted?

        proposal.update!(status: it[:status])
        updated_proposals << proposal
      end

      true
    end

    private

    def permitted_attributes = [{proposals: [:id, :status]}]

    def validate_proposals_format
      return if proposals.blank?

      proposals.each.with_index do |proposal, index|
        if proposal[:id].blank?
          errors.add(:proposals, "proposal at index #{index} must have ID")
        end

        if proposal[:status].blank?
          errors.add(:proposals, "proposal at index #{index} must have a status")
        end

        if proposal[:status].present? && !proposal[:status].in?(STATUSES)
          errors.add(:proposals, "proposal at index #{index} must have a valid status")
        end
      end
    end

    def notify_speakers
      updated_proposals.each do |proposal|
        ProposalDelivery.with(proposal:, speaker: proposal.speaker_profile).public_send(:"proposal_#{proposal.status}").deliver_later
      end
    end
  end
end
