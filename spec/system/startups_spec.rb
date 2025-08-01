require "system_helper"

# This spec verifies the CFP form with a custom mapping behaviour (see spec/data/cfps.yml.erb)
describe "Startups" do
  let_it_be(:user) { create(:user, name: "Vova", email: "jack@sparrow.inc") }

  let(:proposals_page) { prism.proposals }
  let(:proposal_form_page) { prism.proposal_form }

  before { sign_in_as(user) }

  it "the form shows non-default field names" do
    visit "/proposals/new?cfp_id=startups"

    expect(proposal_form_page).to be_displayed

    expect(page).to have_text "Startup Name"
    expect(page).to have_text "How does Ruby power your product?"
  end

  context "when the default CFP deadline has passed" do
    before do
      travel_to CFP.primary.deadline + 1.day

      # Create a speaker profile so we don't need to fill it again
      user.create_speaker_profile(name: "Vova Dem", email: "palkan@mars.test", bio: "Meow-coder")
    end

    it "still can submit another CFP form" do
      visit "/proposals/new?cfp_id=startups"

      expect(proposal_form_page).to be_displayed

      proposal_form_page.form.within do |f|
        f.fill_in "Startup Name", with: "Meow Coder"

        f.fill_in "How far along are you?", with: "Kitten phase"

        f.fill_in "Demo Details", with: "We're going to translate meows into wows."

        f.fill_in "How does Ruby power your product?", with: "Ruby is the name of my cat"
      end

      click_on "Submit Proposal"

      expect(proposals_page).to be_displayed

      expect(proposals_page.proposals).to have_rows(count: 1)
      expect(proposals_page.proposals.first_row).to have_text "Meow Coder"
      expect(proposals_page.proposals.first_row).to have_text "Submitted"
    end
  end
end
