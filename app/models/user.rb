class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :rooms
  has_many :games
  has_many :players
  has_many :played_games, through: :players, class_name: "Game", source: :game


  def calculate_winrate
    wr =  (played_games.inactive.count / games.inactive.count) * 100
    return wr
  end

end
