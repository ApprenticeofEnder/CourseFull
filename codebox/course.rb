class Course < ApplicationRecord
  # Relations
  has_many :deliverables, dependent: :destroy
  belongs_to :semester

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }

  # Enums
  enum :status, { active: 0, complete: 1 }, default: :active

  # Validation
  validates :title, presence: true, length: { minimum: 2, maximum: 150 }
  validates :course_code, presence: true, length: { minimum: 2, maximum: 16 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :grade, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :status, inclusion: { in: statuses.keys }

  def update_goal()
    self.set_goal(self.goal)
  end

  def set_goal(goal)
    if self.complete?
      return
    end

    self.goal = goal
    goal_calculator = GoalCalculator.new(goal)
    self.deliverables.complete.each do |deliverable|
      goal_calculator.add_mark(deliverable.mark, deliverable.weight)
    end

    self.deliverable_goal = goal_calculator.deliverable_goal
    self.grade = goal_calculator.grade

    if goal_calculator.complete?
      self.status = :complete
    end

    self.save
    self.deliverables.active.update_all(goal: self.deliverable_goal)
  end
end
