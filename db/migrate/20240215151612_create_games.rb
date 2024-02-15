class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.references :room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :play_at
      t.datetime :finish_at
      t.string :status
      t.timestamps
    end
  end
end
