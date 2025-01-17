# frozen_string_literal: true

module Api
  module V1
    class Semester < ApplicationRecord
      # Attributes
      attribute :grade, :float, default: 0

      # Callbacks
      after_update :update_goal

      # Relationships
      has_many :courses, lambda {
        order(course_code: :asc)
      }, foreign_key: 'api_v1_semester_id', dependent: :destroy, inverse_of: :semester
      belongs_to :user, foreign_key: 'api_v1_user_id', inverse_of: :semesters

      # Scopes
      default_scope { order(status: :asc, name: :asc) }
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

      def as_json(options = {})
        super(options.merge(include: :courses, methods: :graded_courses))
      end

      def update_goal
        courses.active.update(goal:)
      end

      def graded_courses
        courses.with_graded_deliverables
      end
    end
  end
end
