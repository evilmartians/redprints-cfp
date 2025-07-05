class AddRoleToSpeakerProfiles < ActiveRecord::Migration[8.0]
  def change
    add_column :speaker_profiles, :role, :string
  end
end
