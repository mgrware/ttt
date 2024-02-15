class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "room_channel-#{params[:room]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def move
    
  end
end
