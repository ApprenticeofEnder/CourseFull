module Api
  module V1
    class ApplicationController < ActionController::API
      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
      rescue_from ArgumentError, with: :render_status_set_error

      private

      def render_status_set_error
        render json: { error: "Invalid status." }, status: :bad_request
      end

      def render_not_found()
        render json: { message: "Resource not found." }, status: :not_found
      end
    end
  end
end
