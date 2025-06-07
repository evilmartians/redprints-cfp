class AddScoreAndReviewsCountToProposals < ActiveRecord::Migration[8.0]
  def change
    add_column :proposals, :score, :integer, null: false, default: 0
    add_column :proposals, :reviews_count, :integer, null: false, default: 0
    add_column :reviews, :score, :integer
  end
end
