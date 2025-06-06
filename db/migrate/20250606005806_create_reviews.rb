class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.belongs_to :user
      t.belongs_to :evaluation
      t.belongs_to :proposal

      t.string :status, null: false, default: "pending", index: true

      t.json :scores
      t.text :comment

      t.timestamps
    end

    add_index :reviews, [:evaluation_id, :proposal_id, :user_id], unique: true
  end
end
