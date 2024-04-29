class Deliverable < ApplicationRecord
    belongs_to :course

    validates :name, presence: true, length: { minimum: 2, maximum: 150 }
    validates :weight, presence: true, numericality: {greater_than: 0, less_than: 100}
    validates :mark, presence: true, numericality: {greater_than_or_equal_to: 0, less_than: 100}
    validates :notes, presence: true, allow_blank: true, length: { maximum: 5000 }
end
