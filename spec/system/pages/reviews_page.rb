class ReviewsPage < BasePage
  set_url "/evaluations/{evaluation_id}/reviews"

  section :pending_reviews, Sections::Table, "[data-test-id='pending'] table"
  section :completed_reviews, Sections::Table, "[data-test-id='completed'] table"

  load_validation { has_text?("Review conference talk proposals") }
end
