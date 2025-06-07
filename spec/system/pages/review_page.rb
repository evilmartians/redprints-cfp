class ReviewPage < BasePage
  set_url "/reviews/{id}"

  section :form, Sections::Form

  load_validation { has_text?("Proposal Information") }
end
