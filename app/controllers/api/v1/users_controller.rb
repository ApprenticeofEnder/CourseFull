class Api::V1::UsersController < Api::V1::ApplicationController
  before_action :authenticated, only: %i[show update destroy progress]

  # GET /api/v1/users/me
  def show
    render json: @api_v1_user
  end

  # POST /api/v1/users
  def create
    @api_v1_user = Api::V1::User.new(api_v1_user_params)

    if @api_v1_user.save
      render json: @api_v1_user, status: :created
    else
      render json: @api_v1_user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/users/me
  def update
    if @api_v1_user.update(api_v1_user_params)
      render json: @api_v1_user
    else
      render json: @api_v1_user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/me
  def destroy
    @api_v1_user.destroy!
  end

  # GET /api/v1/users/me/progress
  def progress
    semester_progress = []

    @api_v1_user.semesters.active.find_each do |semester|
      num_courses = 0
      grade_sum = 0.0

      semester.courses.find_each do |course|
        num_courses += 1
        grade_sum += course.grade
      end

      semester_progress_item = {
        :semester => semester.name,
        :semester_id => semester.id,
        :average => (grade_sum / num_courses).round(2),
        :num_courses => num_courses,
        :goal => semester.goal,
      }

      semester_progress.push(semester_progress_item)
    end

    render json: semester_progress
  end

  private

  # Only allow a list of trusted parameters through.
  def api_v1_user_params
    params.require(:api_v1_user).permit(:first_name, :last_name, :email, :supabase_id)
  end
end
