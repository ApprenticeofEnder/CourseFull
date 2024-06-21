class Api::V1::User < ApplicationRecord
  has_many :semesters, foreign_key: "api_v1_user_id"
  after_initialize :init

  supabase_id_error = "Invalid Supabase ID. It may be missing or a duplicate. Please try again."

  validates :first_name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :email, presence: { message: "An email address is required." }, uniqueness: { message: "That email address already exists. Please reset your password through the web app." }, email: true
  validates :supabase_id, presence: { message: supabase_id_error }, uniqueness: { message: supabase_id_error }
  validates :courses_remaining, numericality: { greater_than_or_equal_to: 0 }

  def init
    self.courses_remaining ||= 3
  end

  def add_course_tickets(amount)
    unless amount > 0
      Rails.logger.fatal("Account %p attempted to add %p tickets, which is a non-positive number." % [self.id, amount])
      return
    end
    Rails.logger.info("Adding %p course ticket(s) to account %p" % [amount, self.id])
    self.courses_remaining += amount
    self.save
  end

  def new_course()
    unless self.courses_remaining > 0
      Rails.logger.error("Account %p attempted to add a course while out of tickets." % [self.id])
      return
    end
    self.courses_remaining -= 1
    self.save
    Rails.logger.info("Course added to account %p, 1 ticket spent, %p ticket(s) remaining" % [self.id, self.courses_remaining])
  end
end
