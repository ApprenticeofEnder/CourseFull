# frozen_string_literal: true

class CreateApiV1Products < ActiveRecord::Migration[7.1]
  def change
    create_table :api_v1_products, id: :uuid do |t|
      t.string :stripe_price
      t.string :name
      t.string :stripe_id
      t.string :description
      t.integer :price

      t.timestamps
    end
    add_index :api_v1_products, :stripe_id, unique: true
  end
end
