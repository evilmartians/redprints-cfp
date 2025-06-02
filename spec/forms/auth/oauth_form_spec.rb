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
  end
end
