class AddDateTimesToApiV1Deliverables < ActiveRecord::Migration[7.1]
  def change
    add_column :api_v1_deliverables, :start_date, :datetime, default: -> { 'CURRENT_TIMESTAMP' }
    add_column :api_v1_deliverables, :deadline, :datetime, default: -> { 'CURRENT_TIMESTAMP' }
  end
end
