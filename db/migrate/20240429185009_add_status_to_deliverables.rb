class AddStatusToDeliverables < ActiveRecord::Migration[7.1]
  def change
    add_column :deliverables, :status, :integer, null: false, default: 0
  end
end
