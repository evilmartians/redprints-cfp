class User
  class OAuthProvider < ApplicationRecord
    belongs_to :user
  end
end
