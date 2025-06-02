require "open-uri"

module Auth
  class OAuthForm < ApplicationForm
    attribute :provider
    attribute :uid
    attribute :email
    attribute :name, default: proc { "" }

    before_validation do
      self.email = email&.downcase&.strip
    end

    validates :provider, :uid, :email, presence: true

    def submit!
      # First, check if we already have a user with these credentials
      creds = User::OAuthProvider.find_by(provider:, uid:)
      return creds.user if creds

      # Find or create a user with this email
      @user = User.create_with(name:).create_or_find_by!(email:)
      user.regenerate_auth_token if user.auth_token.blank?
      user.oauth_providers.create_or_find_by!(provider:, uid:)
      user
    end

    private

    attr_reader :user
  end
end
