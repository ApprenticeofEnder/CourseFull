# frozen_string_literal: true

class CreateApiV1Users < ActiveRecord::Migration[7.1]
  def change
    create_table :api_v1_users, id: :uuid do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.uuid :supabase_id
      t.integer :courses_remaining

      t.timestamps
    end
  end
end
