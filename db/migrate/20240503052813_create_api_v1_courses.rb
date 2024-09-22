# frozen_string_literal: true

class CreateApiV1Courses < ActiveRecord::Migration[7.1]
  def change
    create_table :api_v1_courses, id: :uuid do |t|
      t.string :title
      t.string :course_code
      t.integer :status
      t.float :goal
      t.float :grade
      t.float :deliverable_goal
      t.references :api_v1_semester, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
