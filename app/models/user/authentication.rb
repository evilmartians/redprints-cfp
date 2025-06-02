module User::Authentication
  extend ActiveSupport::Concern

  included do
    has_secure_token :auth_token

    has_many :oauth_providers, dependent: :delete_all
  end
end
