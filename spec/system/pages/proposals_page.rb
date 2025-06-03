class ProposalsPage < BasePage
  set_url "/proposals"

  section :proposals, Sections::Table

  load_validation { has_text?("Track and manage your conference talk proposals") }
end
