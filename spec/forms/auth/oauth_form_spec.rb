require "rails_helper"

describe Auth::OAuthForm do
  let(:email) { "exAmplE@some-website.com " }
  let(:params) { {provider: "test-provider", uid: "test-uid", email:, name: "Alien"} }

  subject(:form) { described_class.new(params) }

  describe "#save" do
    context "when user doesn't exist" do
      it "creates a new user, account and oauth credentials" do
        new_user_scope = User.where(email: "example@some-website.com", name: "Alien")

        expect { form.save }.to change(new_user_scope, :count).by(1)
          .and change(User::OAuthProvider.where(uid: "test-uid", provider: "test-provider").joins(:user).merge(new_user_scope), :count).by(1)
      end
    end

    context "when user exists" do
      let_it_be(:user) { create(:user, email: "example@some-website.com", name: "Vasya") }

      it "doesn't create a new user" do
        expect { form.save }.not_to change(User, :count)

        expect(user.reload.name).to eq("Vasya")
      end
    end

    context "when user signed up with another provider using the same email" do
      let_it_be(:user) { create(:user, email: "example@some-website.com") }
      let(:params) { {provider: "google_oauth2", uid: "google-uid", email:, name: "Alien"} }

      before { user.oauth_providers.create!(provider: "github", uid: "github-uid") }

      it "links the new provider to the existing user" do
        result = nil
        expect { result = form.save }.to change(user.oauth_providers, :count).by(1)

        expect(result).to eq(user)
        expect(User.where(email: "example@some-website.com").count).to eq(1)
        expect(user.oauth_providers.pluck(:provider)).to contain_exactly("github", "google_oauth2")
      end
    end

    context "when the provider returns no email (e.g. unverified Google email)" do
      let(:email) { nil }

      it "fails without creating a user" do
        expect { form.save }.not_to change(User, :count)
        expect(form.errors[:email]).to be_present
      end
    end
  end
end
