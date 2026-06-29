class CFPSerializer < ApplicationSerializer
  attributes :id, :primary, :tracks, :field_names
  typelize id: "string", primary: "boolean", tracks: 'Record<Exclude<Proposal["track"], null>,string>', field_names: "Record<string,string> | undefined"

  attribute :is_closed do
    it.closed?
  end
  typelize is_closed: "boolean"
end
