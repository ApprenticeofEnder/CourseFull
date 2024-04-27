class AddSemesterRefToCourses < ActiveRecord::Migration[7.1]
  def change
    add_reference :courses, :semester, foreign_key: true
  end
end
