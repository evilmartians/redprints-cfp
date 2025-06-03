class ProposalPage < BasePage
  set_url "/proposals/{id}"

  load_validation { has_text?("Back to My proposals") }
end
