class SpeakerProfileSerializer < ApplicationSerializer
  typelize_from SpeakerProfile

  attributes :name, :email, :bio, :company, :socials

  attribute :photo_url do |profile|
    next unless profile.photo.attached?

    rails_blob_url(profile.photo, only_path: true)
  end
  typelize photo_url: "string | null"
end
