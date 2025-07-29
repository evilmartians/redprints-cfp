class ApplicationSerializer
  include Rails.application.routes.url_helpers
  include Alba::Resource
  include Alba::Inertia
  include Typelizer::DSL

  class << self
    def one(name, serializer: nil, **options)
      options[:resource] ||= serializer || "#{name}Serializer".classify.constantize
      super(name, **options)
    end

    def many(name, serializer: nil, **options)
      options[:resource] ||= serializer || "#{name.to_s.singularize}Serializer".classify.constantize
      super(name, **options)
    end
  end

  private

  def default_url_options = ActiveStorage::Current.url_options
end
