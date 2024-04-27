class CreateDeliverables < ActiveRecord::Migration[7.1]
  def change
    create_table :deliverables do |t|
      t.string :name, null: false
      t.float :weight, null: false
      t.float :mark, null: false
      t.text :notes, null: false

      t.timestamps
    end
  end
end
