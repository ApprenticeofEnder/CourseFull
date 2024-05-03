class Api::V1::SemestersController < ApplicationController
  before_action :set_api_v1_semester, only: %i[ show update destroy ]

  # GET /api/v1/semesters
  def index
    @api_v1_semesters = Api::V1::Semester.all

    render json: @api_v1_semesters
  end

  # GET /api/v1/semesters/1
  def show
    render json: @api_v1_semester
  end

  # POST /api/v1/semesters
  def create
    @api_v1_semester = Api::V1::Semester.new(api_v1_semester_params)

    if @api_v1_semester.save
      render json: @api_v1_semester, status: :created, location: @api_v1_semester
    else
      render json: @api_v1_semester.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/semesters/1
  def update
    if @api_v1_semester.update(api_v1_semester_params)
      render json: @api_v1_semester
    else
      render json: @api_v1_semester.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/semesters/1
  def destroy
    @api_v1_semester.destroy!
  end

  private

  # TODO: Add authorization to all of this

  # Use callbacks to share common setup or constraints between actions.
  def set_api_v1_semester
    @api_v1_semester = Api::V1::Semester.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def api_v1_semester_params
    params.require(:api_v1_semester).permit(:name, :status, :goal, :user_id)
  end

  def goal_params
    params.require(:semester).permit(:goal)
  end
end
