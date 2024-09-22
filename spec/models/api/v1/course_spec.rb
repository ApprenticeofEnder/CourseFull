# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::Course, type: :model do
  let(:api_v1_semester) { build(:api_v1_semester) }
  let(:api_v1_course) { build(:api_v1_course) }

  context 'should validate' do
    it 'with all proper parameters' do
      expect(api_v1_course).to be_valid
    end

    it 'with a different semester' do
      api_v1_course.semester = api_v1_semester
      expect(api_v1_course).to be_valid
    end
  end

  context 'should not validate' do
    it 'without a semester attached' do
      api_v1_course.semester = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a title' do
      api_v1_course.title = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a course_code' do
      api_v1_course.course_code = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a goal' do
      api_v1_course.goal = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a grade' do
      api_v1_course.grade = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a status' do
      api_v1_course.status = nil
      expect(api_v1_course).not_to be_valid
    end

    it 'without a deliverable goal' do
      api_v1_course.deliverable_goal = nil
      expect(api_v1_course).not_to be_valid
    end
  end

  context 'status' do
    it 'validates for active' do
      api_v1_course.status = 'active'
      expect(api_v1_course).to be_valid
    end

    it 'validates for complete' do
      api_v1_course.status = 'complete'
      expect(api_v1_course).to be_valid
    end

    it 'does not validate for anything else' do
      expect do
        api_v1_course.status = 'not_started'
      end.to raise_error(ArgumentError)
    end
  end
end
