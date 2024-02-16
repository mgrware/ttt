class Game < ApplicationRecord
  STATUSES = %w(active inactive)
  belongs_to :room
  belongs_to :winner, class_name: "User", foreign_key: :user_id, optional: true

  has_many :player_moves, dependent: :destroy

  scope :active, -> { where(status: 'active') }
  scope :inactive, -> { where(status: 'inactive') }

  attribute :status, :string, default: "active"

  def game_states
    (0..8).map { |cell| player_moves.find_by(cell_number: cell)&.player_sign || "" }
  end

  def win_the_game(player_id)
    room.update(status: "waiting")
    player = Player.find(player_id)
    user = player.user
  
    update(
      finish_at: Time.now,
      winner: user,
      status: "inactive"
    )
  
    user.update(
      score: user.score + calculate_score,
      win_rate: user.calculate_winrate
    )
  
    broadcast_game_over_notification
  end

  def calculate_score
    (finish_at - play_at) / 60
  end


  private
  
  def broadcast_game_over_notification
    ActionCable.server.broadcast(
      "room_channel-#{room.id}",
      {
        data: self,
        type: "game_over",
        player_name: winner.name
      }
    )
  end
end
