class SpeakerProfile < ApplicationRecord
  belongs_to :user

  validates :name, :email, presence: true
end
