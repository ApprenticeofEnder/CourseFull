class CreateApiV1Deliverables < ActiveRecord::Migration[7.1]
  def change
    create_table :api_v1_deliverables, id: :uuid do |t|
      t.string :name
      t.float :weight
      t.float :mark
      t.text :notes
      t.references :api_v1_course, null: false, foreign_key: true, type: :uuid
      t.integer :status
      t.float :goal

      t.timestamps
    end
  end
end
