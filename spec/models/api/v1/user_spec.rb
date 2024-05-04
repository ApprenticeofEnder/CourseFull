require "rails_helper"

RSpec.describe Api::V1::User, type: :model do
  let(:api_v1_user) { build(:api_v1_user) }

  context "should validate" do
    it "with first name, last name, email and supabase ID present" do
      expect(api_v1_user).to be_valid
    end
  end

  context "should not validate" do
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

  context "first name" do
    it "should not be less than 2 characters" do
      api_v1_user.first_name = "A"
      expect(api_v1_user).to_not be_valid
    end

    it "should not be more than 150 characters" do
      api_v1_user.first_name = Faker::Alphanumeric.alpha(number: 151)
      expect(api_v1_user).to_not be_valid
    end

    it "should validate for all lengths between 2 and 150, inclusive" do
      [2..151].each do |length|
        api_v1_user.first_name = Faker::Alphanumeric.alpha(number: length)
        expect(api_v1_user).to be_valid
      end
    end
  end

  context "last name" do
    it "should not be less than 2 characters" do
      api_v1_user.last_name = "A"
      expect(api_v1_user).to_not be_valid
    end

    it "should not be more than 150 characters" do
      api_v1_user.last_name = Faker::Alphanumeric.alpha(number: 151)
      expect(api_v1_user).to_not be_valid
    end

    it "should validate for all lengths between 2 and 150, inclusive" do
      [2..151].each do |length|
        api_v1_user.last_name = Faker::Alphanumeric.alpha(number: length)
        expect(api_v1_user).to be_valid
      end
    end
  end

  context "email" do
    it "should validate a standard email" do
      api_v1_user.email = Faker::Internet.email
      expect(api_v1_user).to be_valid
    end

    it "should validate a custom domain" do
      api_v1_user.email = "something@something.com"
      expect(api_v1_user).to be_valid
    end

    it "should not validate something that isn't an email" do
      api_v1_user.email = "Me"
      expect(api_v1_user).to_not be_valid
    end

    it "should not validate email strings without domains" do
      api_v1_user.email = "Me@"
      expect(api_v1_user).to_not be_valid
    end

    it "should not validate email strings with one-word domains" do
      skip("Figure out whether this should be acceptable or not")
      api_v1_user.email = "me@me"
      expect(api_v1_user).to_not be_valid
    end
  end

  context "courses_remaining" do
    it "should be valid if equal to 0" do
      api_v1_user.courses_remaining = 0
      expect(api_v1_user).to be_valid
    end

    it "should be valid if greater than 0" do
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
