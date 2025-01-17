# frozen_string_literal: true

module Api
  module V1
    class SemestersController < Api::V1::ApplicationController
      before_action :authenticated
      before_action :set_api_v1_semester, only: %i[show update destroy]

      # GET /api/v1/semesters
      def index
        @api_v1_semesters = Api::V1::Semester.where(api_v1_user_id: @api_v1_user.id)
        render json: @api_v1_semesters
      end

      # GET /api/v1/semesters/1
      def show
        render json: @api_v1_semester
      end

      # POST /api/v1/semesters
      def create
        @api_v1_semester = Api::V1::Semester.new(api_v1_semester_params)

        @api_v1_semester.user = @api_v1_user

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

      # Use callbacks to share common setup or constraints between actions.
      def set_api_v1_semester
        @api_v1_semester = Api::V1::Semester.find_by!(id: params[:id], api_v1_user_id: @api_v1_user.id)
      rescue ActiveRecord::RecordNotFound
        forbidden
      end

      # Only allow a list of trusted parameters through.
      def api_v1_semester_params
        params.require(:api_v1_semester).permit(:name, :status, :goal)
      end
    end
  end
end
