class ApplicationForm
  include ActiveModel::API
  include ActiveModel::Attributes

  include AfterCommitEverywhere

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
      new(params.permit(attribute_names.map(&:to_sym)))
    end
  end

  def save
    return false unless valid?

    with_transaction do
      after_commit { run_callbacks(:commit) }
      run_callbacks(:save) { submit! }
    end
  end

  private

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
