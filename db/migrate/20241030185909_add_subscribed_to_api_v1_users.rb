class AddSubscribedToApiV1Users < ActiveRecord::Migration[7.1]
  def change
    add_column :api_v1_users, :subscribed, :boolean
  end
end
