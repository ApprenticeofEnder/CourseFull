class Api::V1::CoursesController < ApplicationController
  before_action :get_api_v1_semester, only: %i[ create ]
  before_action :set_api_v1_course, only: %i[ show update destroy ]

  # GET /api/v1/courses
  def index
    @api_v1_courses = Api::V1::Course.all

    render json: @api_v1_courses
  end

  # GET /api/v1/courses/1
  def show
    render json: @api_v1_course
  end

  # POST /api/v1/courses
  def create
    @api_v1_course = Api::V1::Course.new(api_v1_course_params)
    @course.goal = @api_v1_semester.goal
    @course.deliverable_goal = @api_v1_semester.goal
    if @api_v1_course.save
      render json: @api_v1_course, status: :created, location: @api_v1_course
    else
      render json: @api_v1_course.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/courses/1
  def update
    if @api_v1_course.update(api_v1_course_params)
      render json: @api_v1_course
    else
      render json: @api_v1_course.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/courses/1
  def destroy
    @api_v1_course.destroy!
  end

  private

  # Use callbacks to share common setup or constraints between actions.

  # TODO: Add authorization to all of this
  def get_api_v1_semester
    @api_v1_semester = Api::V1::Semester.find(params[:semester_id])
  end

  def set_api_v1_course
    @api_v1_course = Api::V1::Course.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def api_v1_course_params
    params.require(:api_v1_course).permit(:title, :course_code, :status, :semester_id)
  end
end
