module Api
  module V1
    class CoursesController < ApplicationController
      before_action :get_semester
      before_action :set_course, only: %i[ show update destroy ]

      # GET /courses
      def index
        @courses = @semester.courses

        render json: @courses
      end

      # GET /courses/1
      def show
        render json: @course
      end

      # POST /courses
      def create
        @course = @semester.courses.build(course_params)
        @course.goal = @semester.goal
        if @course.save
          render json: @course, status: :created
        else
          render json: @course.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /courses/1
      def update
        if @course.update(course_params)
          render json: @course
        else
          render json: @course.errors, status: :unprocessable_entity
        end
      end

      # DELETE /courses/1
      def destroy
        @course.destroy!
      end

      private

      def get_semester
        @semester = Semester.find(params[:semester_id])
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_course
        @course = @semester.courses.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def course_params
        params.require(:course).permit(:title, :course_code, :status, :semester_id)
      end
    end
  end
end
