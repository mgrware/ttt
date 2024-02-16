class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel-#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def move(req)
    player_move = PlayerMove.new(player_id: req["player_id"].to_i, game_id: req["game_id"].to_i, cell_number: req["cell"])
    
    if player_move.save!
      game_states = Game.find(req["game_id"]).try(:game_states)
      ActionCable.server.broadcast("room_channel-#{params[:room]}", {data: player_move, type: "player_move", sign: req["sign"], game_states: game_states})
    end
  end
end
