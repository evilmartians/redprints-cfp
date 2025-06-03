class HomePage < BasePage
  set_url "/"

  section :nav, "header"
  section :actions, "div[test-id='home-actions']"

  load_validation { has_text?("Call for Proposals") }
end
