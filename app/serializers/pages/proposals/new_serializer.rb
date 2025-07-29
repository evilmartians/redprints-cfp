class Pages::Proposals::NewSerializer < ApplicationSerializer
  has_one :proposal
  has_one :cfp
  has_one :speaker, serializer: SpeakerProfileSerializer
end
