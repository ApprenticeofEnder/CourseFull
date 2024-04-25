require "test_helper"

class SemestersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @semester = semesters(:one)
  end

  test "should get index" do
    get semesters_url, as: :json
    assert_response :success
  end

  test "should create semester" do
    assert_difference("Semester.count") do
      post semesters_url, params: { semester: { name: @semester.name } }, as: :json
    end

    assert_response :created
  end

  test "should show semester" do
    get semester_url(@semester), as: :json
    assert_response :success
  end

  test "should update semester" do
    patch semester_url(@semester), params: { semester: { name: @semester.name } }, as: :json
    assert_response :success
  end

  test "should destroy semester" do
    assert_difference("Semester.count", -1) do
      delete semester_url(@semester), as: :json
    end

    assert_response :no_content
  end
end
