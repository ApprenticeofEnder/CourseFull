class AddUniquenessIndices < ActiveRecord::Migration[7.1]
  def change
    add_index :api_v1_users, :email, unique: true
    add_index :api_v1_users, :supabase_id, unique: true
  end
end
