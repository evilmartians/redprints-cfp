class AddUserAuthToken < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :auth_token, :string

    add_index :users, :auth_token, unique: true, where: "auth_token is not null"
  end
end
