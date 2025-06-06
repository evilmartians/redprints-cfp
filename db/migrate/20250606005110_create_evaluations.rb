class CreateEvaluations < ActiveRecord::Migration[8.0]
  def change
    create_table :evaluations do |t|
      t.string :name, null: false

      t.json :tracks
      t.json :criteria

      t.timestamps
    end
  end
end
