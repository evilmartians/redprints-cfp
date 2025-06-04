class StartupsPage < BasePage
  set_url "/startups"

  section :nav, "header"
  section :actions, "div[test-id='home-actions']"

  load_validation { has_text?("Call for Startups") }
end
