# frozen_string_literal: true

class AddApiV1UserRefToApiV1Deliverables < ActiveRecord::Migration[7.1]
  def change
    add_reference :api_v1_deliverables, :api_v1_user, null: false, foreign_key: true, type: :uuid
  end
end
