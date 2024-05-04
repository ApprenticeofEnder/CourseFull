class Api::V1::User < ApplicationRecord
  has_many :semesters, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true
  validates :supabase_id, presence: true

  def self.starting_course_credits
    return 3
  end
end
