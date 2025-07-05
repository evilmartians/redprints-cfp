require "system_helper"

describe "Proposal Acceptance" do
  let_it_be(:user) { create(:user, name: "Jane Speaker", email: "jane@example.com") }
  let_it_be(:accepted_proposal) do
    create(:proposal,
      user:,
      status: "accepted",
      title: "Building Scalable Ruby Applications",
      abstract: "Learn how to scale Ruby apps effectively",
      details: "This talk covers various strategies for scaling Ruby applications...",
      pitch: "This talk is important because many developers struggle with scaling...")
  end

  let(:proposal_page) { prism.proposal }

  before { sign_in_as(user) }

  specify "user can confirm their accepted proposal" do
    proposal_page.load(id: accepted_proposal.external_id)

    expect(proposal_page).to be_displayed
    expect(proposal_page).to have_text "Building Scalable Ruby Applications"
    expect(proposal_page).to have_text "Accepted"

    expect(proposal_page).to have_button "Confirm Participation"

    accept_confirm do
      click_on "Confirm Participation"
    end

    expect(proposal_page).to be_displayed

    expect(proposal_page).to have_text "Confirmed"

    expect(proposal_page).not_to have_button "Confirm Participation"
  end
end
