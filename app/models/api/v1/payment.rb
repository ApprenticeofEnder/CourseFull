class Api::V1::Payment
  include ActiveRecord::Validations

  belongs_to :user, foreign_key: "api_v1_user_id", dependent: :destroy

  validates :price, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :user, presence: true
end
