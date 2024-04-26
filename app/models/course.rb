class Course < ApplicationRecord
    validates :title, presence: true
    validates :course_code, presence: true
end
