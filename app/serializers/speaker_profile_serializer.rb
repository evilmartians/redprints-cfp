class SpeakerProfileSerializer < ApplicationSerializer
  typelize_from SpeakerProfile

  attributes :name, :email, :bio, :company, :socials
end
