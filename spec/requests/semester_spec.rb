require "rails_helper"
require "factory_bot"

RSpec.describe "Semesters", type: :request do
  let(:semester) { create(:semester) }
  context "GET /api/v1/semesters" do
    it "should get the semesters without error" do
      get "/api/v1/semesters"
      expect(response.status).to eq(200)
    end

    it "should get all created semesters" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      get "/api/v1/semesters"

      expect(response.status).to eq(200)
      expect(response.parsed_body.length).to eq(2)
    end
  end

  context "GET /api/v1/semesters/:id" do
    it "should get a created semester" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      @id = response.parsed_body[:id]
      get "/api/v1/semesters/#{@id}"
      expect(response.status).to eq(200)
    end

    it "should not be able to access an uncreated semester" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      @id = 150000
      get "/api/v1/semesters/#{@id}"
      expect(response.status).to eq(404)
    end
  end

  context "POST /api/v1/semesters" do
    it "should create a semester with valid parameters" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester) }
      expect(response.status).to eq(201)
    end

    it "should not create a semester with invalid parameters" do
      post "/api/v1/semesters", params: { semester: attributes_for(:semester, name: nil) }
      expect(response.status).to eq(422)
    end
  end

  # TODO: Add some better tests
end
