# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoalCalculator do
  let(:goal) { 80.0 }

  let(:course_with_chaotic_results) do
    build(:api_v1_course) do |course|
      assignments = build_list(:api_v1_completed_assignment, 5)
      midterm = build(:api_v1_completed_midterm)
      course.deliverables = [*assignments, midterm]
    end
  end

  let(:course_with_baseline_results) do
    build(:api_v1_course) do |course|
      assignment_marks = [75, 50, 90, 80, 78]
      assignments = build_list(:api_v1_completed_assignment, assignment_marks.length) do |assignment, i|
        assignment.mark = assignment_marks[i]
      end
      midterm = build(:api_v1_completed_midterm, mark: 82.0)
      course.deliverables = [*assignments, midterm]
    end
  end

  let(:course_with_tiger_results) do
    build(:api_v1_course) do |course|
      assignments = build_list(:api_v1_completed_assignment, 5, mark: 90)
      midterm = build(:api_v1_completed_midterm, mark: 90.0)
      course.deliverables = [*assignments, midterm]
    end
  end

  let(:completed_course) do
    build(:api_v1_course) do |course|
      assignments = build_list(:api_v1_completed_assignment, 5, mark: 85)
      midterm = build(:api_v1_completed_midterm, mark: 85)
      exam = build(:api_v1_completed_exam, mark: 85)
      course.deliverables = [*assignments, midterm, exam]
    end
  end

  def process_course(course, current_goal)
    calculator = GoalCalculator.new(current_goal)
    course.deliverables.each do |deliverable|
      calculator.add_mark(deliverable.mark, deliverable.weight)
    end
    calculator
  end

  context 'the baseline results' do
    before do
      course = course_with_baseline_results
      @calculator = process_course(course, goal)
    end

    it 'has a goal of 82.55% for remaining coursework' do
      expect(@calculator.deliverable_goal).to eq(82.5)
    end

    it 'has 40 points remaining' do
      expect(@calculator.weight_remaining?).to eq(true)
      expect(@calculator.weight_remaining).to eq(40.0)
    end

    it 'has 60 points completed' do
      expect(@calculator.weight_completed).to eq(60.0)
    end

    it 'has a grade of ~78' do
      expect(@calculator.grade).to eq(78.3)
    end
  end

  context 'the tiger results' do
    before do
      course = course_with_tiger_results
      @calculator = process_course(course, goal)
    end

    it 'has a goal of 65% for remaining coursework' do
      expect(@calculator.deliverable_goal).to eq(65.0)
    end

    it 'has a grade of 90' do
      expect(@calculator.grade).to eq(90.0)
    end
  end

  context 'the completed results' do
    before do
      course = completed_course
      @calculator = process_course(course, goal)
    end

    it 'has a goal of 0% for remaining coursework' do
      expect(@calculator.deliverable_goal).to eq(0)
    end

    it 'is completed' do
      expect(@calculator.complete?).to eq(true)
    end

    it 'has a grade of 85' do
      expect(@calculator.grade).to eq(85.0)
    end
  end
end
