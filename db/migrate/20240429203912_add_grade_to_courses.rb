class AddGradeToCourses < ActiveRecord::Migration[7.1]
  def change
    add_column :courses, :grade, :float, null: false, default: 0
    add_column :courses, :deliverable_goal, :float, null: false, default: 0
  end
end
