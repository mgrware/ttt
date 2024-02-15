class DashboardsController < ApplicationController

  def index
    @rooms = Room.all
    @users = User.all
  end
end
