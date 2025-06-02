require "rails_helper"

describe "/proposals" do
  let_it_be(:user) { create(:user) }

  before { sign_in(user) }

  describe "POST /create" do
    let(:form_params) { {title: "That's a cool story"} }

    subject { post proposals_url, params: {proposal: form_params} }

    it "creates a new proposal"

    it "notifies the author"
  end
end
