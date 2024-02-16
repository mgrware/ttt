module RoomsHelper

  def current_player
    @players.find_by(user_id: current_user.id)
  end

  def player_sign(cell)
    @player_moves.find_by(cell_number: cell).try(:player).try(:sign) if @player_moves.present?
  end

  def game_states
    @game.try(:game_states).present? ? @game.try(:game_states) : Array.new(9).map(&:to_s)
  end
end
