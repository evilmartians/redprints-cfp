class Evaluation
  class Reviewer < ApplicationRecord
    self.table_name = "evaluation_reviewers"

    belongs_to :evaluation
    belongs_to :user
  end
end
