class UserSerializer < ApplicationSerializer
  typelize_from User

  attributes :id, :name, :email

  attribute :is_reviewer do |user|
    user.admin? || user.reviewer?
  end
  typelize is_reviewer: :boolean
end
