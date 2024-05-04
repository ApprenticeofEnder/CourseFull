class Api::V1::UsersController < Api::V1::ApplicationController
  # before_action :set_api_v1_user, only: %i[ show update destroy ]
  before_action :authorized, only: %i[show update destroy]

  # GET /api/v1/users/me
  def show
    render json: @api_v1_user
  end

  # POST /api/v1/users
  def create
    @api_v1_user = Api::V1::User.new(api_v1_user_params)

    @api_v1_user.courses_remaining = Api::V1::User.starting_course_credits

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

  # TODO: Add authorization to all of this

  # Use callbacks to share common setup or constraints between actions.
  # def set_api_v1_user
  #   @api_v1_user = Api::V1::User.find(params[:id])
  # end

  # Only allow a list of trusted parameters through.
  def api_v1_user_params
    params.require(:api_v1_user).permit(:first_name, :last_name, :email, :supabase_id)
  end
end
