class ChangeGamesColumn < ActiveRecord::Migration[7.1]
  def change
    change_column :games, :user_id, :integer, null: true
  end
end
