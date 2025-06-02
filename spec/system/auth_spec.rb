require "system_helper"

describe "Authentication" do
  let_it_be(:user) { create(:user, name: "Vova", email: "admin@evilmartians.com") }

  describe "login" do
    it "via OAuth (developer)" do
      visit root_url

      expect(page).to have_text "Welcome to SF Ruby CFP app!"

      click_on "Sign in with developer"

      # OmniAuth dev login page
      expect(page).to have_text "User Info"
      expect(page).to have_current_path "/auth/developer"

      fill_in "Name", with: "Vova"
      fill_in "Email", with: "admin@evilmartians.com"

      click_on "Sign In"

      expect(page).to have_link "Submit a proposal"

      expect(page).to have_current_path("/")

      within "header" do
        expect(page).to have_button "Sign out"
      end
    end
  end

  describe "logout" do
    before { sign_in_as(user) }

    it "redirects to the sign in page" do
      visit root_url

      expect(page).to have_text "Welcome to SF Ruby CFP app!"

      expect(page).to have_current_path("/")

      within "header" do
        expect(page).to have_button "Sign out"

        click_on "Sign out"
      end

      within "header" do
        expect(page).not_to have_button "Sign out"
      end

      expect(page).to have_link "Sign in with developer"
    end
  end
end
