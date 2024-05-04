require "rails_helper"

RSpec.describe Api::V1::UsersController, type: :routing do

  # TODO
  # Need to implement JWT Auth
  # Need to adjust it to the following API:
  # POST   /api/v1/users    => sign up
  # GET    /api/v1/users/me => get user data
  # PUT    /api/v1/users/me => update information
  # DELETE /api/v1/users/me => delete account

  # Remaining resource APIs should have constraints on what users can mess with to their own stuff

  describe "routing" do
    it "routes to #show" do
      expect(get: "/api/v1/users/me").to route_to("api/v1/users#show")
    end

    it "routes to #create" do
      expect(post: "/api/v1/users").to route_to("api/v1/users#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/api/v1/users/me").to route_to("api/v1/users#update")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/api/v1/users/me").to route_to("api/v1/users#update")
    end

    it "routes to #destroy" do
      expect(delete: "/api/v1/users/me").to route_to("api/v1/users#destroy")
    end
  end
end
