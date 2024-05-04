class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :authenticated, only: %i[show update destroy]

  # GET /api/v1/users/me
  def show
    render json: @api_v1_user
  end

  # POST /api/v1/users
  def create
    @api_v1_user = Api::V1::User.new(api_v1_user_params)

    if @api_v1_user.save
      render json: @api_v1_user, status: :created
    else
      render json: @api_v1_user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/users/1
  def update
    if @api_v1_user.update(api_v1_user_params)
      render json: @api_v1_user
    else
      render json: @api_v1_user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/1
  def destroy
    @api_v1_user.destroy!
  end

  private

  # Only allow a list of trusted parameters through.
  def api_v1_user_params
    params.require(:api_v1_user).permit(:first_name, :last_name, :email, :supabase_id)
  end
end
