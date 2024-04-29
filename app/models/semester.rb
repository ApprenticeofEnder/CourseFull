class Semester < ApplicationRecord
    has_many :courses, dependent: :destroy
    validates :name, presence: true, length: { minimum: 2, maximum: 150 }
end
