require "system_helper"

# This spec verifies the CFP form with a custom mapping behaviour (see spec/data/cfps.yml.erb)
describe "Startups" do
  let_it_be(:user) { create(:user, name: "Vova", email: "jack@sparrow.inc") }

  let(:proposal_form_page) { prism.proposal_form }

  before { sign_in_as(user) }

  it "the form shows non-default field names" do
    visit "/proposals/new?cfp_id=startups"

    expect(proposal_form_page).to be_displayed

    expect(page).to have_text "Startup Name"
    expect(page).to have_text "How does Ruby power your product?"
  end
end
