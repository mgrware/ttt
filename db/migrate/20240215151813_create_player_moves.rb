class CreatePlayerMoves < ActiveRecord::Migration[7.1]
  def change
    create_table :player_moves do |t|
      t.references :player, null: false, foreign_key: true
      t.references :game, null: false, foreign_key: true
      t.integer :cell_number
      t.timestamps
    end
  end
end
