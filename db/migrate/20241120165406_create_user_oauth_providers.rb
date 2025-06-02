class CreateUserOAuthProviders < ActiveRecord::Migration[8.0]
  def change
    create_table :user_oauth_providers do |t|
      t.string :provider, null: false
      t.string :uid, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :user_oauth_providers, [:provider, :uid], unique: true
  end
end
