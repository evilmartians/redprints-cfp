class SpeakerProfileSerializer < ApplicationSerializer
  typelize_from SpeakerProfile

  attributes :name, :email, :bio, :company, :role, :socials

  attribute :photo_url do |profile|
    next unless profile.photo.attached? && profile.photo.persisted?

    rails_blob_url(profile.photo, only_path: true)
  end
  typelize photo_url: "string | null"
end
