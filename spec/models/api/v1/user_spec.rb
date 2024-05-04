require "rails_helper"

RSpec.describe Api::V1::User, type: :model do
  let(:api_v1_user) { build(:api_v1_user) }

  context "Should validate" do
    it "with first name, last name, email and supabase ID present" do
      expect(api_v1_user).to be_valid
    end
  end

  context "Should not validate" do
    it "when first name is not present" do
      api_v1_user.first_name = nil
      expect(api_v1_user).to_not be_valid
    end

    it "when last name is not present" do
      api_v1_user.last_name = nil
      expect(api_v1_user).to_not be_valid
    end
    it "when email is not present" do
      api_v1_user.email = nil
      expect(api_v1_user).to_not be_valid
    end
    it "when Supabase ID is not present" do
      api_v1_user.supabase_id = nil
      expect(api_v1_user).to_not be_valid
    end
    it "when courses remaining is not present" do
      api_v1_user.courses_remaining = nil
      expect(api_v1_user).to_not be_valid
    end
  end

  context "courses_remaining" do
    it "should not be valid if equal to 0" do
      api_v1_user.courses_remaining = 0
      expect(api_v1_user).to be_valid
    end

    it "should not be valid if greater than 0" do
      api_v1_user.courses_remaining = 4
      expect(api_v1_user).to be_valid
    end

    it "should not be valid if less than 0" do
      api_v1_user.courses_remaining = -1
      expect(api_v1_user).to_not be_valid
    end

    it "should default to 3" do
      expect(api_v1_user.courses_remaining).to eq(3)
    end
  end
end
