class EvaluationSerializer < ApplicationSerializer
  typelize_from Evaluation

  attributes :id, :name, :tracks, :criteria

  typelize tracks: "Array<#{Proposal.tracks.values.map { %('#{it}') }.join(" | ")}>"
  typelize criteria: "string[]"

  attributes :deadline
  typelize deadline: "string | null"

  attribute :submissions_allowed do |ev|
    ev.deadline.nil? || ev.deadline.future?
  end

  typelize submissions_allowed: "boolean"
end
