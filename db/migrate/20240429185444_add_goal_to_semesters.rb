class AddGoalToSemesters < ActiveRecord::Migration[7.1]
  def change
    add_column :semesters, :goal, :float, null: false, default: 0
  end
end
