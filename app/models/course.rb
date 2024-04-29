class Course < ApplicationRecord
  has_many :deliverables, dependent: :destroy
  belongs_to :semester
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }
  validates :title, presence: true, length: { minimum: 2, maximum: 150 }
  validates :course_code, presence: true, length: { minimum: 2, maximum: 16 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :grade, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  enum :status, [:not_started, :active, :complete], default: :not_started

  def update_goal()
    self.set_goal(self.goal)
  end

  def set_goal(goal)
    if self.complete?
      return
    end
    self.goal = goal
    earned_points = 0.0
    completed_weight = 0.0
    full_weight = 100.0
    self.deliverables.complete.all do |deliverable|
      earned_points += (deliverable.mark_dec * deliverable.weight)
      completed_weight += deliverable.weight
    end
    weight_remaining = full_weight - completed_weight
    points_remaining = goal - earned_points

    self.deliverable_goal = 0
    if weight_remaining > 0
      self.deliverable_goal = points_remaining / weight_remaining
    else
      self.status = :complete
    end

    self.grade = 0
    if completed_weight > 0
      self.grade = 100 * earned_points / completed_weight
    end
    self.save
    self.deliverables.active.update_all(goal: self.deliverable_goal)
  end
end
