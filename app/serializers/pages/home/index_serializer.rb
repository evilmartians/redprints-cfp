class Pages::Home::IndexSerializer < ApplicationSerializer
  typelize oauth_providers: 'string[]'
  attributes :oauth_providers
end
