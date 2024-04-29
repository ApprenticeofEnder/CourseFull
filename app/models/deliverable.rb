class Deliverable < ApplicationRecord
  belongs_to :course
  scope :active, -> { where(status: :active) }
  scope :complete, -> { where(status: :complete) }
  validates :name, presence: true, length: { minimum: 2, maximum: 150 }
  validates :weight, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  validates :mark, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :notes, presence: true, allow_blank: true, length: { maximum: 5000 }
  validates :goal, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  enum :status, [:not_started, :active, :complete]

  # The mark as a decimal from 0 to 1
  def mark_dec
    return self.mark / 100.0
  end
end
