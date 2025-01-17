# frozen_string_literal: true

module Api
  module V1
    class Course < ApplicationRecord
      # Attributes
      attribute :grade, :float, default: 0

      # Callbacks
      before_update :update_goals

      # Relationships
      has_many :deliverables, lambda {
        order(status: :asc, deadline: :asc)
      }, foreign_key: 'api_v1_course_id', dependent: :destroy, inverse_of: :course
      belongs_to :semester, foreign_key: 'api_v1_semester_id', inverse_of: :courses
      belongs_to :user, foreign_key: 'api_v1_user_id'

      # Scopes
      scope :active, -> { where(status: :active) }
      scope :complete, -> { where(status: :complete) }
      scope :with_graded_deliverables, lambda {
        includes(:deliverables)
          .select('api_v1_courses.*, COUNT(DISTINCT api_v1_deliverables.id) as graded_deliverables')
          .joins(:deliverables)
          .where('api_v1_deliverables.status=1')
          .group('api_v1_courses.id, api_v1_deliverables.id')
      }

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

      # TODO: Figure out if having grades and goals cap out at 100% would be better than having weight cap out at 100%

      def update_goals
        goal_calculator = GoalCalculator.new(goal)
        # TODO: Rethink this algorithm, see if I can make it tolerate changing the course goal itself
        deliverables.complete.each do |deliverable|
          goal_calculator.add_mark(deliverable.mark, deliverable.weight)
        end

        self.deliverable_goal = goal_calculator.deliverable_goal
        self.grade = goal_calculator.grade

        # if goal_calculator.complete?
        #   self.status = :complete
        # end
        deliverables.active.update(goal: deliverable_goal)
      end
    end
  end
end
