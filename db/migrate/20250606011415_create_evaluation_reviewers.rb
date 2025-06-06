class CreateEvaluationReviewers < ActiveRecord::Migration[8.0]
  def change
    create_table :evaluation_reviewers do |t|
      t.belongs_to :evaluation
      t.belongs_to :user

      t.timestamps
    end
  end
end
