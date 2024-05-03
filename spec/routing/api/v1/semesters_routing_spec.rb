require "rails_helper"

RSpec.describe Api::V1::SemestersController, type: :routing do
  describe "routing" do
    it "routes to #index" do
      expect(get: "/api/v1/semesters").to route_to("api/v1/semesters#index")
    end

    it "routes to #show" do
      expect(get: "/api/v1/semesters/1").to route_to("api/v1/semesters#show", id: "1")
    end


    it "routes to #create" do
      expect(post: "/api/v1/semesters").to route_to("api/v1/semesters#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/api/v1/semesters/1").to route_to("api/v1/semesters#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/api/v1/semesters/1").to route_to("api/v1/semesters#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/api/v1/semesters/1").to route_to("api/v1/semesters#destroy", id: "1")
    end
  end
end
