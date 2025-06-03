class CreateProposals < ActiveRecord::Migration[8.0]
  def change
    create_table :proposals do |t|
      t.belongs_to :user

      t.string :title

      t.text :abstract
      t.text :details
      t.text :pitch

      t.string :track

      t.string :status, index: true, null: false, default: "draft"

      t.datetime :submitted_at

      t.timestamps
    end
  end
end
