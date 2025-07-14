class ReviewSerializer < ApplicationSerializer
  typelize_from Review

  attributes :id, :comment, :status, :scores, :score

  typelize scores: "Record<string,number>"

  one :proposal
  one :user
  one :evaluation

  attribute :speaker do |review|
    review.evaluation.blind? ? nil : SpeakerProfileSerializer.new(review.proposal.speaker_profile)
  end
  typelize speaker: "SpeakerProfile"
end
