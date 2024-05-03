class Api::V1::ApplicationController < ActionController::API
  # before_action :authorized

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ArgumentError, with: :render_status_set_error

  private

  def render_status_set_error
    render json: { error: "Invalid status." }, status: :bad_request
  end

  def render_not_found()
    render json: { message: "Resource not found." }, status: :not_found
  end

  # def encode_token(payload)
  #   JWT.encode(payload, ENV["JWT_SECRET"])
  # end

  # def auth_header
  #   # { Authorization: 'Bearer <token>' }
  #   request.headers["Authorization"]
  # end

  # def decoded_token
  #   if auth_header
  #     token = auth_header.split(" ")[1]
  #     # header: { 'Authorization': 'Bearer <token>' }
  #     begin
  #       JWT.decode(token, ENV["JWT_SECRET"], true, algorithm: "HS256")
  #     rescue JWT::DecodeError
  #       nil
  #     end
  #   end
  # end

  # def logged_in_user
  #   if decoded_token
  #     supabase_id = decoded_token[0]["sub"]
  #     @user = Api::V1::User.find_by(supabase_id: supabase_id)
  #   end
  # end

  # def logged_in?
  #   !!logged_in_user
  # end

  # def authorized
  #   render json: { message: "Please log in" }, status: :unauthorized unless logged_in?
  # end
end
