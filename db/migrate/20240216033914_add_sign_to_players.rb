class AddSignToPlayers < ActiveRecord::Migration[7.1]
  def change
    add_column :players, :sign, :string
  end
end
