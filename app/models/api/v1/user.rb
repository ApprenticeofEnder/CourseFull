# frozen_string_literal: true

module Api
  module V1
    class User < ApplicationRecord
      has_many :semesters, lambda {
        order(status: :asc, name: :asc)
      }, foreign_key: 'api_v1_user_id', dependent: :destroy, inverse_of: :user
      after_initialize :init

      supabase_id_error = 'Invalid Supabase ID. It may be missing or a duplicate. Please try again.'

      validates :first_name, presence: true, length: { minimum: 2, maximum: 150 }
      validates :last_name, presence: true, length: { minimum: 2, maximum: 150 }
      validates :email, presence: { message: 'An email address is required.' },
                        uniqueness: { message: 'That email address already exists. Please reset your password through the web app.' }, email: true
      validates :supabase_id, presence: { message: supabase_id_error }, uniqueness: { message: supabase_id_error }
      validates :courses_remaining, numericality: { greater_than_or_equal_to: 0 }
      validates :subscribed, inclusion: [true, false]

      def init
        self.courses_remaining ||= 3
      end

      def add_course_tickets(amount)
        unless amount.positive?
          Rails.logger.error(format('Account %p attempted to add %p tickets, which is a non-positive number.', id,
                                    amount))
          return
        end
        Rails.logger.info(format('Adding %p course ticket(s) to account %p', amount, id))
        self.courses_remaining += amount
        save
      end

      def new_course
        unless self.courses_remaining.positive?
          Rails.logger.error(format('Account %p attempted to add a course while out of tickets.', id))
          return
        end
        self.courses_remaining -= 1
        save
        Rails.logger.info(format('Course added to account %p, 1 ticket spent, %p ticket(s) remaining', id,
                                 self.courses_remaining))
      end
    end
  end
end
