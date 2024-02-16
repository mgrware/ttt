class Game < ApplicationRecord
  STATUSES = %w(active inactive)
  belongs_to :room
  belongs_to :winner, class_name: "User", foreign_key: :user_id, optional: true

  has_many :player_moves, dependent: :destroy

  scope :active, -> { where(status: 'active') }
  scope :inactive, -> { where(status: 'inactive') }

  attribute :status, :string, default: "active"

  def game_states
    arr = []
    9.times do |cell|
      cell_sign = player_moves.where(cell_number: cell).present? ? player_moves.find_by(cell_number: cell).try(:player_sign) : ""
      arr << cell_sign
    end
    
    return arr
  end

  def win_the_game(player_id)
    room.update(status: "waiting")
    user = Player.find(player_id).user
    update(finish_at: Time.now, winner: user, status: "inactive")
    user.update(score: user.score + calculate_score, win_rate: user.calculate_winrate)

    ActionCable.server.broadcast("room_channel-#{room.id}", {data: self, type: "game_over", player_name: winner.name})
  end

  def calculate_score
    (finish_at - play_at) / 60
  end
end
