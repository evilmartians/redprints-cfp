class User < ApplicationRecord
  include Authentication

  has_many :proposals, dependent: :destroy
  has_one :speaker_profile
end
