class CFPSerializer < ApplicationSerializer
  attributes :id, :tracks, :field_names
  typelize id: "string", tracks: "Record<string,string>", field_names: "Record<string,string> | undefined"

  attribute :is_closed do
    it.closed?
  end
  typelize is_closed: "boolean"
end
