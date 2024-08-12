class Api::V1::ApplicationController < ActionController::API
  # before_action :authorized

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ArgumentError, with: :render_invalid_object_error

  private

  def render_invalid_object_error
    render json: { error: "Invalid object passed in." }, status: :bad_request
  end

  def render_not_found()
    render json: { error: "Resource not found." }, status: :not_found
  end

  def encode_token(payload)
    JWT.encode(payload, ENV["JWT_SECRET"])
  end

  def auth_header
    # { Authorization: 'Bearer <token>' }
    request.headers["Authorization"]
  end

  def decoded_token
    if auth_header
      token = auth_header.split(" ")[1]
      # header: { 'Authorization': 'Bearer <token>' }
      begin
        JWT.decode(token, ENV["JWT_SECRET"], true, algorithm: "HS256")
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def logged_in_user
    if decoded_token
      supabase_id = decoded_token[0]["sub"]
      # confirmed = decoded_token[0]["user_metadata"]["email_confirmed"]
      # TODO: Confirm whether the dev email confirmed thing is a fluke
      Rails.logger.debug("Account with Supabase ID %p is attempting to log in." % [supabase_id])
      @api_v1_user = Api::V1::User.find_by(supabase_id: supabase_id)
    end
  end

  def logged_in?
    !!logged_in_user
  end

  def authenticated
    unless logged_in?
      Rails.logger.info("There was an issue finding the account.")
      render json: { message: "Please log in" }, status: :unauthorized
    else
      Rails.logger.info("Account %p has logged in successfully." % [@api_v1_user.id])
    end
  end

  def forbidden
    render json: { message: "You cannot access that resource" }, status: :forbidden
  end
end
