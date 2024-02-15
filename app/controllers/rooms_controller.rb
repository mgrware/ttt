class RoomsController < ApplicationController
  protect_from_forgery

  before_action :prepare_room, only: [:play, :show]

  def create
    @room = Room.new(user: current_user, players_attributes: [ { user_id: current_user.id } ])
    if @room.save
      redirect_to room_path(@room)
    end
  end

  def show 
    @players = @room.players
    @game = @room.game_active
    if !@room.user_ids.include?(current_user.id) && @players.count < 2
      @room.players.create(user_id: current_user.id)
    else
      redirect_to dashboards_url unless @room.user_ids.include?(current_user.id)
    end
  end

  def play
    exist_games = @room.games.update_all(status: "inactive") 
    @games = @room.games.create(play_at: Time.now)
    render json: { data: @games.as_json }
  end

  private

  def prepare_room
    @room = Room.find(params[:id])
  end
end
