class SharedSerializer < ApplicationSerializer
  one :current_user, resource: UserSerializer, key: :user, if: ->(c) { c.current_user.present? }

  typelize flash: 'Record<"alert" | "notice", string>'
  attribute :flash do |c|
    c.flash.to_hash
  end

  typelize 'boolean'
  attribute :cfp_closed do
    CFP.primary.closed?
  end
end
