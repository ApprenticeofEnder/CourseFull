# frozen_string_literal: true

module Api
  module V1
    class DeliverablesController < Api::V1::ApplicationController
      before_action :authenticated
      before_action :get_api_v1_course, only: %i[create]
      before_action :set_api_v1_deliverable, only: %i[show update destroy]

      # GET /api/v1/deliverables
      def index
        @api_v1_deliverables = Api::V1::Deliverable.where(api_v1_user_id: @api_v1_user.id)

        render json: @api_v1_deliverables
      end

      # GET /api/v1/deliverables/1
      def show
        render json: @api_v1_deliverable
      end

      # POST /api/v1/deliverables
      def create
        @api_v1_deliverable = Api::V1::Deliverable.new(api_v1_deliverable_params)

        @api_v1_deliverable.goal = @api_v1_course.deliverable_goal
        @api_v1_deliverable.user = @api_v1_user

        if @api_v1_deliverable.save
          @api_v1_deliverable.course.update_goal
          render json: @api_v1_deliverable, status: :created, location: @api_v1_deliverable
        else
          render json: @api_v1_deliverable.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/deliverables/1
      def update
        if @api_v1_deliverable.update(api_v1_deliverable_update_params)
          @api_v1_deliverable.course.update_goal
          render json: @api_v1_deliverable
        else
          render json: @api_v1_deliverable.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/deliverables/1
      def destroy
        @api_v1_deliverable.destroy!
      end

      private

      # Use callbacks to share common setup or constraints between actions.

      def get_api_v1_course
        @api_v1_course = Api::V1::Course.find_by!(id: params[:api_v1_deliverable][:api_v1_course_id],
                                                  api_v1_user_id: @api_v1_user.id)
      rescue ActiveRecord::RecordNotFound
        forbidden
      end

      def set_api_v1_deliverable
        @api_v1_deliverable = Api::V1::Deliverable.find_by!(id: params[:id], api_v1_user_id: @api_v1_user.id)
      rescue ActiveRecord::RecordNotFound
        forbidden
      end

      # Only allow a list of trusted parameters through.
      def api_v1_deliverable_params
        params.require(:api_v1_deliverable).permit(:name, :weight, :mark, :notes, :api_v1_course_id, :status)
      end

      def api_v1_deliverable_update_params
        params.require(:api_v1_deliverable).permit(:name, :weight, :mark, :notes, :status)
      end
    end
  end
end
