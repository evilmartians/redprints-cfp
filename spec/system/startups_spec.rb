require "system_helper"

describe "Startups" do
  let_it_be(:user) { create(:user, name: "Vova", email: "jack@sparrow.inc") }

  let(:startups_page) { prism.startups }
  let(:oauth_page) { prism.oauth_dev }

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
    end
  end
end
