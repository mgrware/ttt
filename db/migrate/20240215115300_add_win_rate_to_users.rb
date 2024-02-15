class AddWinRateToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :win_rate, :float, default: 0
  end
end
