class RoomsController < ApplicationController
  protect_from_forgery

  before_action :prepare_room, only: [:play, :show]
  before_action :prepare_players, :prepare_game, :prepare_player_moves, only: [:show]

  def create
    @room = Room.new(user: current_user, players_attributes: [ { user_id: current_user.id, sign: "X" } ])
    if @room.save
      redirect_to room_path(@room)
    end
  end

  def show 
    if game_master_exists? && room_has_players?
      @room.players.create(user_id: current_user.id, sign: "O")
    else
      redirect_to dashboards_url unless @room.user_ids.include?(current_user.id)
    end
  end

  def play
    @games = @room.play_the_game
    render json: { data: @games.as_json }
  end

  def winning

  end

  private

  def prepare_room
    @room = Room.find(params[:id])
  end

  def prepare_players
    @players = @room.players
  end

  def prepare_game
    @game = @room.game_active
  end

  def prepare_player_moves
    @player_moves = @game.player_moves if @game.present?
  end

  def game_master_exists?
    !@room.user_ids.include?(current_user.id)
  end

  def room_has_players?
    @players.count < 2
  end

end
