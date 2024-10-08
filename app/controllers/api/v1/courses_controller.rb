# frozen_string_literal: true

module Api
  module V1
    class CoursesController < Api::V1::ApplicationController
      before_action :authenticated
      before_action :get_api_v1_semester, only: %i[create]
      before_action :set_api_v1_course, only: %i[show update destroy]

      # GET /api/v1/courses
      def index
        @api_v1_courses = Api::V1::Course.where(api_v1_user_id: @api_v1_user.id)

        render json: @api_v1_courses.as_json(include: :deliverables)
      end

      # GET /api/v1/courses/1
      def show
        render json: @api_v1_course.as_json(include: :deliverables)
      end

      # POST /api/v1/courses
      def create
        unless @api_v1_user.courses_remaining.positive?
          return render json: { error: 'No course tickets remaining.' }, status: :forbidden
        end

        @api_v1_course = Api::V1::Course.new(api_v1_course_params)

        @api_v1_course.goal = @api_v1_semester.goal
        @api_v1_course.grade = 0.0
        @api_v1_course.deliverable_goal = @api_v1_semester.goal
        @api_v1_course.user = @api_v1_user

        if @api_v1_course.save
          @api_v1_user.new_course
          @api_v1_course.update_goal
          render json: @api_v1_course, status: :created, location: @api_v1_course
        else
          render json: @api_v1_course.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/courses/1
      def update
        if @api_v1_course.update(api_v1_course_update_params)
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

      def get_api_v1_semester
        @api_v1_semester = Api::V1::Semester.find_by!(id: params[:api_v1_course][:api_v1_semester_id],
                                                      api_v1_user_id: @api_v1_user.id)
      rescue ActiveRecord::RecordNotFound
        forbidden
      end

      def set_api_v1_course
        @api_v1_course = Api::V1::Course.find_by!(id: params[:id], api_v1_user_id: @api_v1_user.id)
      rescue ActiveRecord::RecordNotFound
        forbidden
      end

      # Only allow a list of trusted parameters through.
      def api_v1_course_params
        params.require(:api_v1_course).permit(:title, :course_code, :status, :api_v1_semester_id)
      end

      def api_v1_course_update_params
        params.require(:api_v1_course).permit(:title, :course_code, :status)
      end
    end
  end
end
