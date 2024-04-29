module Api
  module V1
    class DeliverablesController < ApplicationController
      before_action :get_course
      before_action :set_deliverable, only: %i[ show update destroy ]

      # GET /deliverables
      def index
        @deliverables = @course.deliverables

        render json: @deliverables
      end

      # GET /deliverables/1
      def show
        render json: @deliverable
      end

      # POST /deliverables
      def create
        @deliverable = @course.deliverables.build(deliverable_params)
        if @deliverable.save
          @course.update_goal()
          render json: @deliverable, status: :created
        else
          render json: @deliverable.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /deliverables/1
      def update
        if @deliverable.update(deliverable_params)
          @course.update_goal()
          render json: @deliverable
        else
          render json: @deliverable.errors, status: :unprocessable_entity
        end
      end

      # DELETE /deliverables/1
      def destroy
        @deliverable.destroy!
      end

      private

      def get_course
        @course = Course.find(params[:course_id])
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_deliverable
        @deliverable = @course.deliverables.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def deliverable_params
        params.require(:deliverable).permit(:name, :weight, :mark, :notes, :course_id)
      end
    end
  end
end
