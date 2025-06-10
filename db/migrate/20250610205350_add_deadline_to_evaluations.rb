class AddDeadlineToEvaluations < ActiveRecord::Migration[8.0]
  def change
    add_column :evaluations, :deadline, :datetime
  end
end
