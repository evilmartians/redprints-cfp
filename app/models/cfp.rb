class CFP < FrozenRecord::Base
  class << self
    def primary = find_by!(primary: true)
  end

  class DateTimeType
    def self.load(*) = ActiveModel::Type::DateTime.new.deserialize(*)
  end

  scope :active, -> { where.not(inactive: true) }

  attribute :deadline, DateTimeType
  attribute :open_at, DateTimeType

  def closed? = (deadline.present? && deadline.past?) || future?

  def future? = open_at.present? && open_at.future?
end
