require "rails_helper"

RSpec.describe "Courses", type: :request do
  let(:semester) { create(:semester) }
  let(:course) { create(:course) }

  before :each do
    post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
    @semester_id = response.parsed_body[:id]
  end
  context "GET /api/v1/semesters/:id/courses" do
    it "should get 0 courses with a fresh semester" do
      get "/api/v1/semesters/#{@semester_id}/courses"
      expect(response.status).to eq(200)
      expect(response.parsed_body.length).to eq(0)
    end

    it "should get 1 added course" do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      get "/api/v1/semesters/#{@semester_id}/courses"
      expect(response.status).to eq(200)
      expect(response.parsed_body.length).to eq(1)
    end

    it "should get all added courses" do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      get "/api/v1/semesters/#{@semester_id}/courses"
      expect(response.status).to eq(200)
      expect(response.parsed_body.length).to eq(4)
    end
  end

  context "GET /api/v1/semesters/:semester_id/courses/:id" do
    before :each do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }

      @course_id = response.parsed_body[:id]
    end

    it "should get the specified course" do
      get "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}"
      expect(response.status).to eq(200)
    end

    it "should have the correct goal" do
      get "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}"
      @course = response.parsed_body
      expect(@course[:goal]).to eq(80.0)
    end

    it "should not get a specified course that doesn't exist" do
      @course_id = 400000

      get "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}"
      expect(response.status).to eq(404)
    end
  end

  context "POST /api/v1/semesters/:id/courses" do
    it "should create a course with valid parameters" do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }
      expect(response.status).to eq(201)
    end

    it "should not create a course with invalid parameters" do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course, title: nil) }
      expect(response.status).to eq(422)
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course, course_code: nil) }
      expect(response.status).to eq(422)
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course, status: nil) }
      expect(response.status).to eq(422)
    end

    it "should not have overridable goals" do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course, goal: 75.0) }

      expect(response.parsed_body[:goal]).to_not eq(75.0)
    end
  end

  context "PUT /api/v1/semesters/:semester_id/courses/:id" do
    before :each do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }

      @course_id = response.parsed_body[:id]
    end

    it "should update the status given a correct one" do
      put "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}", params: { course: attributes_for(:course, status: :complete) }

      expect(response.parsed_body[:status]).to eq("complete")
    end

    it "should not update the status given an invalid one, e.g. not_started" do
      put "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}", params: { course: attributes_for(:course, status: "not_started") }

      expect(response.status).to eq(400)
    end
  end

  context "DELETE /api/v1/semesters/:semester_id/courses/:id" do
    before :each do
      post "/api/v1/semesters/#{@semester_id}/courses", params: { course: attributes_for(:course) }

      @course_id = response.parsed_body[:id]
    end

    it "should delete an item that exists" do
      delete "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}"
      expect(response.status).to eq(204)
    end

    it "should not delete an item that does not exist" do
      @course_id = 400000

      delete "/api/v1/semesters/#{@semester_id}/courses/#{@course_id}"
      expect(response.status).to eq(404)
    end
  end

  # TODO: Add some better tests
end
