class PlayerMove < ApplicationRecord
  belongs_to :player
  belongs_to :game

  delegate :sign, to: :player, prefix: true, allow_nil: true #player_sign
end
