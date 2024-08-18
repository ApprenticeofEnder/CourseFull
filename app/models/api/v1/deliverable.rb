class Api::V1::Deliverable < ApplicationRecord
  # Relationships
  belongs_to :course, foreign_key: "api_v1_course_id", dependent: :destroy
  belongs_to :user, foreign_key: "api_v1_user_id"

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }

  # Enums
  enum :status, { active: 0, complete: 1 }, default: :active

  # Validation
  validates :name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :weight, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  validates :mark, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :notes, presence: true, allow_blank: true, length: { maximum: 5000 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :status, inclusion: { in: statuses.keys }
  validates :course, presence: true
  validates :user, presence: true
end
