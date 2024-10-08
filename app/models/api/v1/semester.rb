# frozen_string_literal: true

module Api
  module V1
    class Semester < ApplicationRecord
      # Relationships
      has_many :courses, -> { order('course_code ASC') }, foreign_key: 'api_v1_semester_id', dependent: :destroy
      belongs_to :user, foreign_key: 'api_v1_user_id'

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
      validates :user, presence: true

      def update_goal
        set_goal(goal)
      end

      def set_goal(goal)
        update(goal:)
        courses.active.find_each do |course|
          course.set_goal(goal)
        end
      end
    end
  end
end
