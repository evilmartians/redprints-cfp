class OAuthDevPage < BasePage
  set_url "/auth/developer"

  section :form, Sections::Form

  load_validation { has_text?("User Info") }
end
