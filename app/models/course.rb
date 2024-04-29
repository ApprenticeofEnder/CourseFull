class Course < ApplicationRecord
    has_many :deliverables, dependent: :destroy
    belongs_to :semester

    validates :title, presence: true, length: { minimum: 2, maximum: 150 }
    validates :course_code, presence: true, length: { minimum: 2, maximum: 16 }
end
