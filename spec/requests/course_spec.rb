require "rails_helper"

RSpec.describe "Courses", type: :request do
  let(:semester) { create(:semester) }
  let(:course) { create(:course) }
  context "GET /api/v1/semesters/:id/courses" do
    it "should get 0 courses with a fresh semester" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      @id = response.parsed_body[:id]
      get "/api/v1/semesters/#{@id}/courses"
      expect(response.parsed_body.length).to eq(0)
    end
  end
end
