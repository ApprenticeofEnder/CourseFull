# frozen_string_literal: true

class CreateApiV1Semesters < ActiveRecord::Migration[7.1]
  def change
    create_table :api_v1_semesters, id: :uuid do |t|
      t.string :name
      t.integer :status
      t.float :goal
      t.references :api_v1_user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
