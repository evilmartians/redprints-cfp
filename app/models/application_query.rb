class ApplicationQuery
  class << self
    attr_writer :query_model_name

    def query_model_name
      @query_model_name ||= name.sub(/::[^:]+$/, "")
    end

    def query_model
      query_model_name.safe_constantize
    end

    def [](model)
      Class.new(self).tap { _1.query_model_name = model.name }
    end

    def resolve(...) = new.resolve(...)

    alias_method :call, :resolve
  end

  private attr_reader :relation

  def initialize(relation = self.class.query_model.all)
    @relation = relation
  end

  def resolve(...) = relation
end
