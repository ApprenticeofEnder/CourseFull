class Api::V1::User < ApplicationRecord
  has_many :semesters, dependent: :destroy

  def self.starting_course_credits
    return 3
  end
end
