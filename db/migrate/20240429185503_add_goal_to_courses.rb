class AddGoalToCourses < ActiveRecord::Migration[7.1]
  def change
    add_column :courses, :goal, :float, null: false, default: 0
  end
end
