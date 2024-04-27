class AddCourseRefToDeliverables < ActiveRecord::Migration[7.1]
  def change
    add_reference :deliverables, :course, foreign_key: true
  end
end
