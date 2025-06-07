class ReviewSerializer < ApplicationSerializer
  typelize_from Review

  attributes :id, :comment, :status, :scores, :score

  typelize scores: "Record<string,number>"

  one :proposal
  one :user
  one :evaluation
end
