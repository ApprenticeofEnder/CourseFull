class AddGoalToDeliverables < ActiveRecord::Migration[7.1]
  def change
    add_column :deliverables, :goal, :float, null: false, default: 0
  end
end
