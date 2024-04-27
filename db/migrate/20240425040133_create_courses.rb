class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses do |t|
      t.string :title, null: false
      t.string :course_code, null: false

      t.timestamps
    end
  end
end
