class Room < ApplicationRecord
  STATUSES = %w(waiting playing finish)
  belongs_to :user
  validates_inclusion_of :status, in: STATUSES
  attribute :status, :string, default: "waiting"

  delegate :name, to: :user, prefix: true, allow_nil: true #user_name

  #broadcast to dashboard table rooms targeted to #room_list selector
  after_create_commit do broadcast_prepend_to "rooms",
    target: "room_list",
    partial: "dashboards/table/room",
    locals: { object: self }
  end
end
