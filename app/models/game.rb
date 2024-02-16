class Game < ApplicationRecord
  STATUSES = %w(active inactive)
  belongs_to :room
  belongs_to :winner, class_name: :user, foreign_key: :user_id, optional: true

  has_many :player_moves, dependent: :destroy

  scope :active, -> { where(status: 'active') }

  attribute :status, :string, default: "active"

  def game_states
    # player_moves.order(cell_number: :asc).map{|x| x.player_sign}
    arr = []
    9.times do |cell|
      cell_sign = player_moves.where(cell_number: cell).present? ? player_moves.find_by(cell_number: cell).try(:player_sign) : ""
      arr << cell_sign
    end
    
    return arr
  end
end
