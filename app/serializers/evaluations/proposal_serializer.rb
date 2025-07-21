module Evaluations
  class ProposalSerializer < ApplicationSerializer
    typelize_from Proposal

    attribute :id, &:external_id
    typelize id: "string"
    attributes :title, :details, :abstract, :pitch, :track, :status, :submitted_at, :score, :reviews_count

    one :speaker_profile, serializer: SpeakerProfileSerializer
  end
end
