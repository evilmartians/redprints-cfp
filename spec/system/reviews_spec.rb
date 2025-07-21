require "system_helper"

describe "Reviews" do
  let_it_be(:user) { create(:reviewer) }

  let_it_be(:proposal1) { create(:proposal, :submitted, title: "The Future of Ruby", track: "general", created_at: 1.hour.ago) }
  let_it_be(:proposal2) { create(:proposal, :submitted, title: "Rails Performance Tips", track: "general", created_at: 2.hours.ago) }

  let_it_be(:evaluation) do
    create(:evaluation, name: "Just Talks", criteria: ["Novelty", "Relevance"], reviewers: [user], tracks: ["general"], deadline: 1.week.since).tap(&:invalidate!)
  end

  let(:review1) { evaluation.reviews.find_by(user:, proposal: proposal1) }
  let(:review2) { evaluation.reviews.find_by(user:, proposal: proposal2) }

  let(:home_page) { prism.home }
  let(:reviews_page) { prism.reviews }
  let(:review_page) { prism.review }
  let(:results_page) { prism.results }

  before { sign_in_as(user) }

  specify "reviewer can see and submit a review" do
    home_page.load

    home_page.nav.within do |nav|
      nav.click_on "Review"
    end

    expect(reviews_page).to be_displayed(evaluation_id: evaluation.id)

    expect(reviews_page.pending_reviews).to have_rows(count: 2)
    expect(reviews_page.pending_reviews.first_row).to have_text "The Future of Ruby"
    expect(reviews_page.pending_reviews.first_row).to have_text "Pending"
    expect(reviews_page.pending_reviews.second_row).to have_text "Rails Performance Tips"
    expect(reviews_page.pending_reviews.second_row).to have_text "Pending"

    expect(page).not_to have_link("Results")

    reviews_page.pending_reviews.first_row.click

    expect(review_page).to be_displayed(id: review1.id)

    expect(page).to have_text "The Future of Ruby"

    review_page.form.within do |f|
      f.select_star("Novelty", 3)
      f.select_star("Relevance", 4)

      f.fill_in "Comment", with: "Excellent proposal!"

      f.click_on "Submit Review"
    end

    expect(page).to have_text "Proposals Evaluation"

    expect(reviews_page).to be_displayed(evaluation_id: evaluation.id)

    expect(reviews_page.pending_reviews).to have_rows(count: 1)
    expect(reviews_page.completed_reviews).to have_rows(count: 1)
    expect(reviews_page.completed_reviews.first_row).to have_text "The Future of Ruby"
  end

  context "Results" do
    before do
      # Make user an admin so she can submit review results
      user.update!(admin: true)

      review1.update!(scores: {"Novelty" => 3, "Relevance" => 4}, score: 7, status: :submitted, comment: "Not bad")
      review2.update!(scores: {"Novelty" => 5, "Relevance" => 5}, score: 10, status: :submitted)

      reviews_page.load(evaluation_id: evaluation.id)
      expect(reviews_page).to be_displayed(evaluation_id: evaluation.id)
      expect(reviews_page.completed_reviews).to have_rows(count: 2)
    end

    specify do
      expect(page).to have_link("Results")

      click_on "Results"

      expect(results_page).to be_displayed(evaluation_id: evaluation.id)

      expect(results_page.pending_proposals).to have_rows(count: 2)

      results_page.pending_proposals.first_row.click_on "Accept"

      expect(results_page.accepted_proposals).to have_rows(count: 1)
      expect(results_page.pending_proposals).to have_rows(count: 1)

      results_page.pending_proposals.first_row.click_on "Reject"
      expect(results_page.rejected_proposals).to have_rows(count: 1)
      expect(results_page).not_to have_pending_proposals

      accept_confirm do
        click_on "Submit Review Results"
      end

      expect(page).to have_text "Successfully updated proposal statuses"

      expect(results_page).to be_displayed(evaluation_id: evaluation.id)

      expect(results_page.accepted_proposals).to have_rows(count: 1)
      expect(results_page.rejected_proposals).to have_rows(count: 1)

      expect(results_page.accepted_proposals.first_row).to have_text "Accepted"
      expect(results_page.accepted_proposals.first_row).not_to have_button "Accept"
      expect(results_page.rejected_proposals.first_row).to have_text "Not Accepted"
      expect(results_page.rejected_proposals.first_row).not_to have_button "Accept"
    end
  end
end
