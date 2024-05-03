class Api::V1::Semester < ApplicationRecord
  # Relationships
  has_many :courses, dependent: :destroy
  belongs_to :user

  # Scopes
  scope :not_started, -> { where(status: :not_started) }
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }

  # Enums
  enum :status, { not_started: 0, active: 1, complete: 2 }, default: :not_started

  # Validation
  validates :name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :status, inclusion: { in: statuses.keys }

  def update_goal()
    self.set_goal(self.goal)
  end

  def set_goal(goal)
    self.update(goal: goal)
    self.courses.active.all do |course|
      course.set_goal(goal)
    end
  end
end
