require "rails_helper"

RSpec.describe Api::V1::Course, type: :model do
  let(:api_v1_semester) { build(:api_v1_semester) }
  let(:api_v1_course) { build(:api_v1_course) }
  context "status" do
    it "should validate for active" do
      api_v1_course.status = "active"
      expect(api_v1_course).to be_valid
    end

    it "should validate for complete" do
      api_v1_course.status = "complete"
      expect(api_v1_course).to be_valid
    end

    it "should not validate for anything else" do
      expect {
        api_v1_course.status = "completed"
      }.to raise_error(ArgumentError)
    end
  end
end
