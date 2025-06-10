class EvaluationSerializer < ApplicationSerializer
  typelize_from Evaluation

  attributes :id, :name, :tracks, :criteria

  typelize tracks: "Array<#{Proposal.tracks.values.map { %('#{_1}') }.join(" | ")}>"
  typelize criteria: "string[]"

  attributes :deadline
  typelize deadline: "string | null"
end
