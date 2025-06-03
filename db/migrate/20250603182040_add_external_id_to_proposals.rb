class AddExternalIdToProposals < ActiveRecord::Migration[8.0]
  def change
    add_column :proposals, :external_id, :string
    add_index :proposals, :external_id, unique: true

    reversible do |dir|
      dir.up do
        execute <<~SQL
          update proposals
          set external_id = lower(hex(randomblob(8)))
          where external_id is null
        SQL
      end
    end

    change_column_null :proposals, :external_id, false
  end
end
