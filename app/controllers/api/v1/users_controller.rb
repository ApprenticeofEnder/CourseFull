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
    @supabase_id = @api_v1_user.supabase_id

    url = URI(ENV['NEXT_PUBLIC_SUPABASE_URL'])

    headers = { Authorization: "Bearer #{ENV['SUPABASE_SERVICE_KEY']}" }

    Net::HTTP.start(url.hostname, url.port, use_ssl: ENV['RAILS_ENV'] == 'production') do |http|
      res = http.delete("/auth/v1/admin/users/#{@supabase_id}", headers)
      res.value
    rescue Net::HTTPClientException
      Rails.logger.error('Attempt to delete Supabase User with ID %s failed. Status code: %s', @supabase_id, res.code)
      Rails.logger.error('Deletion details: %s', res.body)
      return render json: { error: 'Failed to delete user.' }, status: res.code
    end

    @api_v1_user.destroy!
  end

  # GET /api/v1/users/me/progress
  def progress
    select_statements = [
      'api_v1_semesters.name AS semester',
      'api_v1_semesters.id AS semester_id',
      'ROUND(AVG(CASE WHEN api_v1_deliverables.status = 1 THEN CAST(api_v1_courses.grade AS numeric) ELSE NULL END), 2) AS average',
      'COUNT(DISTINCT api_v1_courses.id) AS num_courses',
      'COUNT(DISTINCT CASE WHEN api_v1_deliverables.status = 1 THEN api_v1_courses.id ELSE NULL END) AS num_graded_courses',
      'api_v1_semesters.goal AS goal',
      'api_v1_semesters.status AS status'
    ]

    joins = [
      'LEFT JOIN "api_v1_courses" ON "api_v1_courses"."api_v1_semester_id" = "api_v1_semesters"."id"',
      'LEFT JOIN "api_v1_deliverables" ON "api_v1_deliverables"."api_v1_course_id" = "api_v1_courses"."id"'
    ]

    group_by_clauses = [
      'api_v1_semesters.id', 'api_v1_semesters.name', 'api_v1_semesters.goal', 'api_v1_semesters.status'
    ]

    attempted_semester_progress = @api_v1_user.semesters
                                              .joins(joins)
                                              .select(
                                                *select_statements
                                              )
                                              .group(*group_by_clauses)
                                              .order('api_v1_semesters.id')

    semester_progress = attempted_semester_progress.map do |current_progress|
      current_progress_hash = current_progress.as_json
      current_progress_hash['average'] = current_progress_hash['average'].to_f
      current_progress_hash
    end

    render json: semester_progress
  end

  private

  # Only allow a list of trusted parameters through.
  def api_v1_user_params
    params.require(:api_v1_user).permit(:first_name, :last_name, :email, :supabase_id, :subscribed)
  end
end
