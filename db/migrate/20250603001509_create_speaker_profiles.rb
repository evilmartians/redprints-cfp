class CreateSpeakerProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :speaker_profiles do |t|
      t.belongs_to :user

      t.string :name, null: false
      t.string :email, null: false
      t.string :company

      t.text :bio, limit: 1000
      t.text :socials, limit: 400

      t.timestamps
    end
  end
end
