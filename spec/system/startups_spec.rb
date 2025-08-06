require "system_helper"

describe "Startups" do
  let_it_be(:user) { create(:user, name: "Vova", email: "jack@sparrow.inc") }

  let(:proposals_page) { prism.proposals }
  let(:startups_page) { prism.startups }
  let(:oauth_page) { prism.oauth_dev }
  let(:proposal_form_page) { prism.proposal_form }

  it "user goes back to the startups page after login" do
    startups_page.load

    startups_page.actions.within do |actions|
      actions.click_on "Sign in as developer"
    end

    expect(oauth_page).to be_displayed

    oauth_page.form do |f|
      f.fill_in "Name", with: "Vova"
      f.fill_in "Email", with: "jack@sparrow.inc"
    end

    click_on "Sign In"

    expect(startups_page).to be_displayed

    startups_page.actions.within do |actions|
      expect(actions).to have_link "Submit a Demo Proposal"
      click_on "Submit a Demo Proposal"
    end

    expect(proposal_form_page).to be_displayed

    expect(page).to have_text "Startup Name"
    expect(page).to have_text "How does Ruby power your product?"
  end

  context "when the default CFP deadline has passed" do
    before do
      travel_to CFP.primary.deadline + 1.day

      # Create a speaker profile so we don't need to fill it again
      user.create_speaker_profile(name: "Vova Dem", email: "palkan@mars.test", bio: "Meow-coder")

      sign_in_as(user)
    end

    it "still can submit another CFP form" do
      visit "/startups/new"

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
