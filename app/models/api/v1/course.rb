# frozen_string_literal: true

module Api
  module V1
    class Course < ApplicationRecord
      has_many :deliverables, -> { order('name ASC') }, foreign_key: 'api_v1_course_id', dependent: :destroy
      belongs_to :semester, foreign_key: 'api_v1_semester_id'
      belongs_to :user, foreign_key: 'api_v1_user_id'

      # Scopes
      scope :active, -> { where(status: :active) }
      scope :complete, -> { where(status: :complete) }

      # Enums
      enum :status, { active: 0, complete: 1 }, default: :active

      # Validation
      validates :title, presence: true, length: { minimum: 2, maximum: 150 }
      validates :course_code, presence: true, length: { minimum: 2, maximum: 16 }
      validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
      validates :deliverable_goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
      validates :grade, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
      validates :status, inclusion: { in: statuses.keys }
      validates :semester, presence: true
      validates :user, presence: true

      def update_goal
        set_goal(goal)
      end

      # TODO: Figure out if having grades and goals cap out at 100% would be better than having weighbt cap out at 100%

      def set_goal(goal)
        self.goal = goal
        goal_calculator = GoalCalculator.new(goal)
        deliverables.complete.each do |deliverable|
          goal_calculator.add_mark(deliverable.mark, deliverable.weight)
        end

        self.deliverable_goal = goal_calculator.deliverable_goal
        self.grade = goal_calculator.grade

        # if goal_calculator.complete?
        #   self.status = :complete
        # end

        save
        deliverables.active.update(goal: deliverable_goal)
      end

      def current_grade; end
    end
  end
end
