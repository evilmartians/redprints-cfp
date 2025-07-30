class ApplicationSerializer
  include Rails.application.routes.url_helpers
  include Alba::Resource
  include Typelizer::DSL

  private

  def default_url_options = ActiveStorage::Current.url_options
end
