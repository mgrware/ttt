class RoomsController < ApplicationController

  def create
    @room = Room.new(user: current_user)
    if @room.save
      redirect_to room_path(@room)
    end
  end

  def show
    @room = Room.find(params[:id])
  end
end
