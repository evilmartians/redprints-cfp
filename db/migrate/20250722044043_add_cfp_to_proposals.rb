class AddCFPToProposals < ActiveRecord::Migration[8.0]
  def change
    add_column :proposals, :cfp_id, :string
  end
end
