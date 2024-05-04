require "rails_helper"

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/api/v1/users", type: :request do
  # This should return the minimal set of attributes required to create a valid
  # Api::V1::User. As you add validations to Api::V1::User, be sure to
  # adjust the attributes here as well.
  let(:api_v1_user) { create(:api_v1_user) }

  let(:valid_attributes) {
    attributes_for(:api_v1_user)
  }

  let(:invalid_attributes) {
    attributes_for(:api_v1_user, email: nil)
  }

  # This should return the minimal set of values that should be in the headers
  # in order to pass any filters (e.g. authentication) defined in
  # Api::V1::UsersController, or in your router and rack
  # middleware. Be sure to keep this updated too.
  let(:valid_headers) {
    {}
  }

  let(:auth_headers) {
    auth_token = JWT.encode({ sub: "c7689623-6852-4664-928d-43f778264337" }, ENV["JWT_SECRET"])
    { authorization: "Bearer #{auth_token}" }
  }

  # TODO
  # Need to implement JWT Auth
  # Need to adjust it to the following API:
  # POST   /api/v1/users    => sign up
  # GET    /api/v1/users/me => get user data
  # PUT    /api/v1/users/me => update information
  # DELETE /api/v1/users/me => delete account

  # Remaining resource APIs should have constraints on what users can mess with to their own stuff

  describe "GET /api/v1/users/me" do
    context "with valid token" do
      before :each do
        post "/api/v1/users",
             params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
      end

      it "returns a successful status code" do
        get "/api/v1/users/me", headers: auth_headers, as: :json
        expect(response).to have_http_status(:ok)
      end

      it "gets user data" do
        get "/api/v1/users/me", headers: auth_headers, as: :json
        expect(response.parsed_body[:email]).to eq(valid_attributes[:email])
      end
    end

    context "with invalid token" do
      before :each do
        post "/api/v1/users",
             params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
      end

      it "returns a failing status code" do
        get "/api/v1/users/me", headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/users" do
    context "with valid parameters" do
      it "creates a new Api::V1::User" do
        expect {
          post "/api/v1/users",
               params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
        }.to change(Api::V1::User, :count).by(1)
      end

      it "renders a JSON response with the new api_v1_user" do
        post "/api/v1/users",
             params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Api::V1::User" do
        expect {
          post "/api/v1/users",
               params: { api_v1_user: invalid_attributes }, as: :json
        }.to change(Api::V1::User, :count).by(0)
      end

      it "renders a JSON response with errors for the new api_v1_user" do
        post "/api/v1/users",
             params: { api_v1_user: invalid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /api/v1/users/me" do
    it "destroys the requested api_v1_user" do
      Api::V1::User.create! attributes_for(:api_v1_user)
      expect {
        delete "/api/v1/users/me", headers: auth_headers, as: :json
      }.to change(Api::V1::User, :count).by(-1)
    end
  end

  # TODO:

  # describe "GET /show" do
  #   it "renders a successful response" do
  #     user = Api::V1::User.create! valid_attributes
  #     get api_v1_user_url(user), as: :json
  #     expect(response).to be_successful
  #   end
  # end

  # describe "POST /create" do
  #   context "with valid parameters" do
  #     it "creates a new Api::V1::User" do
  #       expect {
  #         post api_v1_users_url,
  #              params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
  #       }.to change(Api::V1::User, :count).by(1)
  #     end

  #     it "renders a JSON response with the new api_v1_user" do
  #       post api_v1_users_url,
  #            params: { api_v1_user: valid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:created)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "does not create a new Api::V1::User" do
  #       expect {
  #         post api_v1_users_url,
  #              params: { api_v1_user: invalid_attributes }, as: :json
  #       }.to change(Api::V1::User, :count).by(0)
  #     end

  #     it "renders a JSON response with errors for the new api_v1_user" do
  #       post api_v1_users_url,
  #            params: { api_v1_user: invalid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:unprocessable_entity)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end
  # end

  # describe "PATCH /update" do
  #   context "with valid parameters" do
  #     let(:new_attributes) {
  #       skip("Add a hash of attributes valid for your model")
  #     }

  #     it "updates the requested api_v1_user" do
  #       user = Api::V1::User.create! valid_attributes
  #       patch api_v1_user_url(user),
  #             params: { api_v1_user: new_attributes }, headers: valid_headers, as: :json
  #       user.reload
  #       skip("Add assertions for updated state")
  #     end

  #     it "renders a JSON response with the api_v1_user" do
  #       user = Api::V1::User.create! valid_attributes
  #       patch api_v1_user_url(user),
  #             params: { api_v1_user: new_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:ok)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "renders a JSON response with errors for the api_v1_user" do
  #       user = Api::V1::User.create! valid_attributes
  #       patch api_v1_user_url(user),
  #             params: { api_v1_user: invalid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:unprocessable_entity)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end
  # end

  # describe "DELETE /destroy" do
  #   it "destroys the requested api_v1_user" do
  #     user = Api::V1::User.create! valid_attributes
  #     expect {
  #       delete api_v1_user_url(user), headers: valid_headers, as: :json
  #     }.to change(Api::V1::User, :count).by(-1)
  #   end
  # end
end
