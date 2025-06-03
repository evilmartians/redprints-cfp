require "system_helper"

describe "Proposals" do
  let_it_be(:user) { create(:user, name: "Marco", email: "marco@evl.ms") }

  let(:home_page) { prism.home }
  let(:proposal_form_page) { prism.proposal_form }
  let(:proposals_page) { prism.proposals }

  before { sign_in_as(user) }

  specify "user can create a draft" do
    home_page.load

    home_page.nav.within do |nav|
      nav.click_on "Submit proposal"
    end

    expect(proposal_form_page).to be_displayed

    proposal_form_page.form.within do |f|
      f.fill_in "Title", with: "How to create a CFP app in 12 hours with Rails"

      f.fill_in "Abstract", with: "A brief overview of building a modern CFP app with Ruby on Rails"

      f.select "General", from: "Track"

      f.fill_in "Detailed Description", with: "This talk will go through the step-by-step process of building a complete Call for Papers application using Ruby on Rails. I'll cover database design, authentication, form handling, and deployment strategies."

      f.fill_in "Why this talk matters", with: "Many conferences struggle with their CFP process. This talk will help Ruby developers create better tools for our community."

      f.fill_in "Full Name", with: "Marco"

      # Do not fill it—it must be prefilled
      # fill_in "Email", with: "marco@evl.ms"

      f.fill_in "Company/Organization", with: "Evil Corp"

      f.fill_in "Speaker Bio", with: "Marco is a Ruby developer with 10 years of experience building web applications for various industries."

      f.fill_in "Social Links", with: "@marco_ruby"
    end

    click_on "Save Draft"

    expect(proposals_page).to be_displayed

    expect(proposals_page.proposals).to have_rows(count: 1)

    expect(proposals_page.proposals.first_row).to have_text "Draft"
  end

  context "with existing proposal draft" do
    let_it_be(:speaker_profile) { create(:speaker_profile, user:) }
    let_it_be(:proposal) { create(:proposal, :draft, user:, title: "My draft proposal", details: "") }

    let(:proposal_page) { prism.proposal }

    specify "user can submit previously created draft and receive an email" do
      proposals_page.load

      expect(proposals_page.proposals).to have_rows(count: 1)
      expect(proposals_page.proposals.first_row).to have_text "My draft proposal"

      proposals_page.proposals.first_row.click

      expect(proposal_page).to be_displayed(id: proposal.external_id)

      click_on "Edit Proposal"

      expect(proposal_form_page).to be_displayed

      proposal_form_page.form.within do |f|
        f.fill_in "Title", with: "Rails 10: what's new?"

        f.fill_in "Detailed Description", with: "Rails 10 introduces several new features and improvements. This talk will cover the most significant changes and how to leverage them in your applications."

        fill_in "Email", with: "not-marco@evl.ms"
      end

      click_on "Submit Proposal"

      expect(proposal_page).to be_displayed(id: proposal.external_id)

      click_on "Back to My proposals"

      expect(proposals_page).to be_displayed

      expect(proposals_page.proposals).to have_rows(count: 1)
      expect(proposals_page.proposals.first_row).to have_text "Submitted"

      # Check email
      perform_enqueued_jobs

      expect(all_emails).not_to be_empty
      open_email("not-marco@evl.ms")

      current_email.click_link "Go to proposal"

      expect(proposal_page).to be_displayed(id: proposal.external_id)
    end
  end
end
