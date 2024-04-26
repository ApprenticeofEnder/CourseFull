require "test_helper"

class CourseTest < ActiveSupport::TestCase
  test "Can't create course without course code" do
    course = Course.new
    assert_not course.save
  end
end
