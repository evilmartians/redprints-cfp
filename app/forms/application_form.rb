# frozen_string_literal: true

# Base form object class that provides an ActiveRecord-compatible interface for complex
# forms.
# Based on https://github.com/PacktPublishing/Layered-Design-for-Ruby-on-Rails-Applications/blob/main/Chapter07/03-invitation-active-model-form.rb
class ApplicationForm
  include ActiveModel::API
  include ActiveModel::Attributes

  include AfterCommitEverywhere

  class ContextProxy
    def initialize(cls, ctx)
      @class, @context = cls, ctx
    end

    def new(...) = form_with_context.tap { it.send(:initialize, ...) }

    def from(...) = form_with_context.tap { it.send(:initialize_from_params, ...) }

    private

    def form_with_context
      @class.allocate.tap { it.assign_context(**@context) }
    end
  end

  define_callbacks :save, only: :after
  define_callbacks :commit, only: :after

  class << self
    def after_save(...)
      set_callback(:save, :after, ...)
    end

    def after_commit(...)
      set_callback(:commit, :after, ...)
    end

    def before_validation(...)
      set_callback(:validate, :before, ...)
    end

    def model_name
      @model_name ||= ActiveModel::Name.new(nil, nil, self.class.name.sub(/Form$/, ""))
    end

    def model_name=(name)
      @model_name = ActiveModel::Name.new(nil, nil, name)
    end

    def from(params)
      allocate.tap { it.initialize_from_params(params) }
    end

    def with(**context) = ContextProxy.new(self, context)
  end

  def save
    return false unless valid?

    with_transaction do
      after_commit { run_callbacks(:commit) }
      run_callbacks(:save) { submit! }
    end
  end

  def initialize_from_params(params)
    initialize(params.permit(permitted_attributes))
  end

  def assign_context(**context)
    @context = context.freeze
  end

  def assign_attributes(attrs)
    super(attrs.reverse_merge(attributes_from_context))
  end

  def attributes_from_context
    {}
  end

  private

  def permitted_attributes = self.class.attribute_names.map(&:to_sym)

  def context = @context ||= {}.freeze

  def with_transaction(&) = ApplicationRecord.transaction(&)

  def submit!
    raise NotImplementedError
  end

  def merge_errors!(other)
    other.errors.each do |e|
      errors.add(e.attribute, e.type, message: e.message)
    end
  end
end
