class Player < ApplicationRecord
  has_many :player_moves, dependent: :destroy
  belongs_to :user
  belongs_to :room

  delegate :name, to: :user, prefix: true, allow_nil: true #user_name


  #broadcast to dashboard table rooms targeted to #room_list selector
  after_create_commit do broadcast_prepend_to "players",
    target: "player_lists",
    partial: "rooms/shared/player_list",
    locals: { object: self, idx: self.room.players.count }
  end
end
