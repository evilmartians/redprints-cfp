class ResultsPage < BasePage
  set_url "/evaluations/{evaluation_id}/results"

  section :pending_proposals, Sections::Table, "[data-test-id='pending-proposals'] table"
  section :accepted_proposals, Sections::Table, "[data-test-id='accepted-proposals'] table"
  section :waitlisted_proposals, Sections::Table, "[data-test-id='waitlisted-proposals'] table"
  section :rejected_proposals, Sections::Table, "[data-test-id='rejected-proposals'] table"

  load_validation { has_text?("Evaluation Results") }
end
