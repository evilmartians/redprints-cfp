class UserSerializer < ApplicationSerializer
  attributes :id, :name, :email

  typelize :boolean
  attribute :is_reviewer do |user|
    user.admin? || user.reviewer?
  end
end
