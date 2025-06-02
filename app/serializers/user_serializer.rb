class UserSerializer < ApplicationSerializer
  typelize_from User

  attributes :id, :name, :email
end
