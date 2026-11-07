class AddCFPIdToEvaluations < ActiveRecord::Migration[8.1]
  def change
    add_column :evaluations, :cfp_id, :string
  end
end
