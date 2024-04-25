class CreateDeliverables < ActiveRecord::Migration[7.1]
  def change
    create_table :deliverables do |t|
      t.string :name
      t.float :weight
      t.float :mark
      t.text :notes

      t.timestamps
    end
  end
end
