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

RSpec.describe "/api/v1/semesters", type: :request do
  # This should return the minimal set of attributes required to create a valid
  # Api::V1::Semester. As you add validations to Api::V1::Semester, be sure to
  # adjust the attributes here as well.

  def user
    create(:api_v1_user) do |user|
      create(:api_v1_semester, user: user)
    end
  end

  let(:valid_attributes) { attributes_for(:api_v1_semester, user: nil) }

  def invalid_attributes
    attributes = [:name, :status, :goal]
    @attribute_count = attributes.length
    attributes.each do |attribute|
      yield attributes_for(:api_v1_semester, attribute => nil)
    end
  end

  # This should return the minimal set of values that should be in the headers
  # in order to pass any filters (e.g. authentication) defined in
  # Api::V1::SemestersController, or in your router and rack
  # middleware. Be sure to keep this updated too.
  let(:valid_headers) {
    {}
  }

  def auth_headers(user)
    auth_token = JWT.encode({ sub: user[:supabase_id].to_s }, ENV["JWT_SECRET"])
    { authorization: "Bearer #{auth_token}" }
  end

  before :each do
    @user = user
    @user_2 = user
  end

  describe "GET /api/v1/semesters" do
    context "with valid auth token" do
      it "gets any currently available semesters" do
        get "/api/v1/semesters", headers: auth_headers(@user), as: :json
        expect(response).to be_successful
      end

      it "gets all currently available semesters" do
        create(:api_v1_semester, user: @user)
        create(:api_v1_semester, user: @user)
        get "/api/v1/semesters", headers: auth_headers(@user), as: :json
        expect(response).to be_successful
        expect(response.parsed_body.length).to eq(3)
      end

      it "gets different semesters for different users" do
        create(:api_v1_semester, user: @user)
        create(:api_v1_semester, user: @user_2)

        [@user, @user_2].each do |current_user|
          get "/api/v1/semesters", headers: auth_headers(current_user), as: :json
          expect(response).to be_successful
          expect(response.parsed_body.length).to eq(2)
        end
      end
    end

    context "with invalid auth token" do
      it "should render a 401 unauthorized response for a missing token" do
        get "/api/v1/semesters", headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/semesters/:id" do
    context "with valid auth token" do
      it "renders a successful response" do
        get "/api/v1/semesters/#{@user.semesters.first.id}", headers: auth_headers(@user), as: :json
        expect(response).to be_successful
      end

      it "gets the correct semester" do
        get "/api/v1/semesters/#{@user.semesters.first.id}", headers: auth_headers(@user), as: :json
        expect(response.parsed_body[:name]).to eq(@user.semesters.first[:name])
      end

      it "gets only semesters the user has access to" do
        get "/api/v1/semesters/#{@user_2.semesters.first.id}", headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end

      # NOTE: Maybe this should be a 404?
      it "renders a 403 forbidden response for a nonexistent ID" do
        get "/api/v1/semesters/#{SecureRandom.uuid}", headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "with invalid auth token" do
      it "should render a 401 unauthorized response for a missing token" do
        get "/api/v1/semesters/#{@user.semesters.first.id}", headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/semesters" do
    context "with valid auth token" do
      it "creates a new Api::V1::Semester with valid parameters" do
        expect {
          post "/api/v1/semesters",
               params: { api_v1_semester: valid_attributes }, headers: auth_headers(@user), as: :json
        }.to change(Api::V1::Semester, :count).by(1)
      end

      it "returns a JSON response with the new Api::V1::Semester" do
        post "/api/v1/semesters",
             params: { api_v1_semester: valid_attributes }, headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
      end

      it "attaches the new Api::V1::Semester to the user" do
        post "/api/v1/semesters",
             params: { api_v1_semester: valid_attributes }, headers: auth_headers(@user), as: :json
        expect(response.parsed_body[:api_v1_user_id]).to eq(@user[:id])
      end

      it "does not create a new Api::V1::Semester with invalid parameters" do
        invalid_attributes { |attribute_set|
          expect {
            post "/api/v1/semesters",
                 params: { api_v1_semester: attribute_set }, headers: auth_headers(@user), as: :json
          }.to change(Api::V1::Semester, :count).by(0)
        }
      end
    end

    context "with invalid auth token" do
      it "should render a 401 unauthorized response for a missing token" do
        post "/api/v1/semesters",
             params: { api_v1_semester: valid_attributes }, headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/semesters/:id" do
    let (:new_attributes) { attributes_for(:api_v1_semester, user: nil) }

    context "with valid auth token" do
      it "should render a successful JSON response with valid parameters" do
        patch "/api/v1/semesters/#{@user.semesters.first.id}",
              params: { api_v1_semester: new_attributes }, headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))
      end

      it "should update the Api::V1::Semester" do
        old_semester = @user.semesters.first.dup
        patch "/api/v1/semesters/#{@user.semesters.first.id}",
              params: { api_v1_semester: new_attributes }, headers: auth_headers(@user), as: :json
        @user.reload
        expect(old_semester[:name]).to_not eq(@user.semesters.first[:name])
      end

      it "should return an error response with invalid parameters" do
        invalid_attributes { |attribute_set|
          patch "/api/v1/semesters/#{@user.semesters.first.id}",
                params: { api_v1_semester: attribute_set }, headers: auth_headers(@user), as: :json
          expect(response).to have_http_status(:unprocessable_entity)
        }
      end

      it "renders a 403 forbidden response when trying to access someone else's semester" do
        patch "/api/v1/semesters/#{@user_2.semesters.first.id}",
              params: { api_v1_semester: new_attributes }, headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end

      it "renders a 403 forbidden response for a nonexistent ID" do
        patch "/api/v1/semesters/#{SecureRandom.uuid}",
              params: { api_v1_semester: new_attributes }, headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "with invalid auth token" do
      it "should render a 401 unauthorized response for a missing token" do
        patch "/api/v1/semesters/#{@user.semesters.first.id}",
              params: { api_v1_semester: new_attributes }, headers: valid_headers, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/semesters/:id" do
    context "with valid auth token" do
      it "renders a successful response" do
        delete "/api/v1/semesters/#{@user.semesters.first.id}", headers: auth_headers(@user), as: :json
        expect(response).to be_successful
      end

      it "deletes the semester from the database" do
        expect {
          delete "/api/v1/semesters/#{@user.semesters.first.id}", headers: auth_headers(@user), as: :json
        }.to change(Api::V1::Semester, :count).by(-1)
      end

      it "deletes only semesters the user has access to" do
        delete "/api/v1/semesters/#{@user_2.semesters.first.id}", headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end

      it "renders a 403 forbidden response for a nonexistent ID" do
        delete "/api/v1/semesters/#{SecureRandom.uuid}", headers: auth_headers(@user), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "with invalid auth token" do
      it "should render a 401 unauthorized response for a missing token" do
        delete "/api/v1/semesters/#{@user.semesters.first.id}", headers: valid_headers, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
