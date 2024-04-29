class AddStatusToSemesters < ActiveRecord::Migration[7.1]
  def change
    add_column :semesters, :status, :integer, null: false, default: 0
  end
end
