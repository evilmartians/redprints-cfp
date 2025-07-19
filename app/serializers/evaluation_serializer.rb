class EvaluationSerializer < ApplicationSerializer
  typelize_from Evaluation

  attributes :id, :name, :tracks, :criteria, :blind, :personal

  typelize tracks: "Array<#{Proposal.tracks.values.map { %('#{it}') }.join(" | ")}>"
  typelize criteria: "string[]"

  attributes :deadline
  typelize deadline: "string | null"

  attribute :submissions_allowed do |ev|
    ev.deadline.nil? || ev.deadline.future?
  end

  typelize submissions_allowed: "boolean"

  attribute :can_see_results do |ev|
    ev.deadline.nil? || ev.deadline.past? || (
      params[:current_user] && ev.reviews.pending.where(user: params[:current_user]).none?
    )
  end
  typelize can_see_results: "boolean"

  attribute :can_submit do
    !!params[:current_user]&.admin?
  end
  typelize can_submit: "boolean"
end
