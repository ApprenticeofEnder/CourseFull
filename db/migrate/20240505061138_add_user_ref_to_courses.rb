class AddUserRefToCourses < ActiveRecord::Migration[7.1]
  def change
    add_reference :api_v1_courses, :api_v1_user, null: false, foreign_key: true, type: :uuid
  end
end
