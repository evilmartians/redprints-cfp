class ProposalFormPage < BasePage
  set_url_matcher %r{/(proposals|startups)/(new|[^\/]+/edit)}

  section :form, Sections::Form

  load_validation { has_text?("Submit Your Proposal") }
end
