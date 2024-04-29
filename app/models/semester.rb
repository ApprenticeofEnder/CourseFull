class Semester < ApplicationRecord
  scope :not_started, -> { where(status: :not_started) }
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }
  has_many :courses, dependent: :destroy
  validates :name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  enum :status, [:not_started, :active, :complete]

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
