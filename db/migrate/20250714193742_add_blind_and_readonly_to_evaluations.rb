class AddBlindAndReadonlyToEvaluations < ActiveRecord::Migration[8.0]
  def change
    add_column :evaluations, :blind, :boolean, null: false, default: true
    add_column :evaluations, :personal, :boolean, null: false, default: false
  end
end
