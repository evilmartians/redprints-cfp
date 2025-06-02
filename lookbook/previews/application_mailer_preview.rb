# This preview is used to render mailer previews.
#
# @hidden
class ApplicationMailerPreview < ApplicationViewComponentPreview
  layout "lookbook/mailer_preview"

  def render_email(email)
    render_with_template(
      locals: {email:},
      template: "layouts/lookbook/mailer_example_preview"
    )
  end
end
