# frozen_string_literal: true

class LookbookController < Lookbook::PreviewController
  class Current < ActiveSupport::CurrentAttributes
    attribute :user
  end

  # Override this method to also prepend our custom lookbook view path,
  # so we can customize the UI of the Lookbook itself
  def prepend_application_view_paths
    super
    prepend_view_path(Rails.root.join("lookbook/app/views"))
  end

  # Make it possible to use the `current_user` helper in the Lookbook previews
  def current_user
    Current.user || User.first
  end
end
