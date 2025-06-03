require "system_helper"

describe "Authentication" do
  let_it_be(:user) { create(:user, name: "Vova", email: "admin@evilmartians.com") }

  let(:home_page) { prism.home }
  let(:oauth_page) { prism.oauth_dev }

  describe "login" do
    it "via OAuth (developer)" do
      home_page.load

      home_page.actions.within do |actions|
        actions.click_on "Sign in as developer"
      end

      expect(oauth_page).to be_displayed

      oauth_page.form do |f|
        f.fill_in "Name", with: "Vova"
        f.fill_in "Email", with: "admin@evilmartians.com"
      end

      click_on "Sign In"

      expect(home_page).to be_displayed

      home_page.actions.within do |actions|
        expect(actions).to have_link "Submit a Proposal"
      end

      home_page.nav.within do |nav|
        expect(nav).to have_button "Sign out"
      end
    end
  end

  describe "logout" do
    before { sign_in_as(user) }

    it "redirects to the sign in page" do
      home_page.load

      expect(home_page).to be_displayed

      home_page.nav.within do |nav|
        expect(nav).to have_button "Sign out"
        nav.click_on "Sign out"
      end

      home_page.nav.within do |nav|
        expect(nav).not_to have_button "Sign out"
      end

      home_page.actions.within do |actions|
        expect(actions).to have_link "Sign in as developer"
      end
    end
  end
end
