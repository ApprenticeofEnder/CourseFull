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

  def add_courses(amount)
    Rails.logger.info("Adding %p course ticket(s) to account %p" % [line_item.quantity, metadata.user])
    self.courses_remaining += amount
    self.save
  end
end
