require "rails_helper"

RSpec.describe "Deliverables", type: :request do
  let(:semester) { create(:semester) }
  let(:course) { create(:course) }
  let(:assignment) { create(:assignment) }
  let(:midterm) { create(:midterm) }
  let(:exam) { create(:exam) }
  let(:completed_assignment) { create(:completed_assignment) }
  let(:completed_midterm) { create(:completed_midterm) }
  let(:completed_exam) { create(:completed_exam) }

  before :each do
    post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
    @semester_id = response.parsed_body[:id]

    post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }

    @course_id = response.parsed_body[:id]
  end

  context "POST /api/v1/semesters/:semester_id/courses/:course_id/deliverables" do
    it "should create a deliverable with valid parameters" do
      post "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables", params: { deliverable: attributes_for(:assignment) }
      expect(response.status).to eq(201)
      expect(response.parsed_body[:goal]).to eq(80.0)
    end
  end

  context "PUT /api/v1/semesters/:semester_id/courses/:course_id/deliverables/:id" do
    before :each do
      post "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables", params: { deliverable: attributes_for(:assignment) }

      @assignment_id = response.parsed_body[:id]

      post "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables", params: { deliverable: attributes_for(:midterm) }

      @midterm_id = response.parsed_body[:id]

      post "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables", params: { deliverable: attributes_for(:exam) }

      @exam_id = response.parsed_body[:id]
    end

    it "should update a deliverable properly" do
      put "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables/#{@assignment_id}", params: { deliverable: attributes_for(:completed_assignment) }
      expect(response.status).to eq(200)
      expect(response.parsed_body[:mark]).to eq(75.0)
      expect(response.parsed_body[:status]).to eq("complete")
    end

    it "should not update with invalid parameters" do
      put "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables/#{@assignment_id}", params: { deliverable: attributes_for(:assignment, status: "not_started") }

      expect(response.status).to eq(400)
    end

    it "should have one updated mark update all subsequent goals" do
      put "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables/#{@assignment_id}", params: { deliverable: attributes_for(:completed_assignment) }

      get "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables/#{@midterm_id}"

      expect(response.parsed_body[:goal]).to_not eq(80.0)

      get "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}/deliverables/#{@exam_id}"

      expect(response.parsed_body[:goal]).to_not eq(80.0)
    end
  end
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end
end
