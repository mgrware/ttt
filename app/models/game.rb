class Game < ApplicationRecord
  STATUSES = %w(active inactive)
  belongs_to :room
  belongs_to :winner, class_name: :user, foreign_key: :user_id, optional: true

  scope :active, -> { where(status: 'active') }

  attribute :status, :string, default: "active"
end
