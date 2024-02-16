class Room < ApplicationRecord
  STATUSES = %w(waiting playing finish)
  
  has_many :players, dependent: :destroy
  has_many :users, through: :players, dependent: :destroy
  has_many :games, dependent: :destroy
  has_one :game_active, -> { order("status asc") }, class_name: "Game" 

  belongs_to :user #created by
  validates_inclusion_of :status, in: STATUSES

  attribute :status, :string, default: "waiting"
  delegate :name, to: :user, prefix: true, allow_nil: true #user_name

  accepts_nested_attributes_for :players, reject_if: :all_blank, allow_destroy: true

  #broadcast to dashboard table rooms targeted to #room_list selector
  after_create_commit do broadcast_prepend_to "rooms",
    target: "room_list",
    partial: "dashboards/table/room",
    locals: { object: self }
  end

  def play_the_game
    games.update_all(status: "inactive")
    @games = games.create(play_at: Time.now)
    ActionCable.server.broadcast("room_channel-#{id}", {data: @games, type: "play_game"})
    return @games
  end
end
