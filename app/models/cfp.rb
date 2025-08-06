class CFP < FrozenRecord::Base
  class << self
    def primary = find("primary")

    def startups = find("startups")
  end

  class DateTimeType
    def self.load(*) = ActiveModel::Type::DateTime.new.deserialize(*)
  end

  attribute :deadline, DateTimeType

  def closed? = deadline.present? && deadline.past?
end
