require "rails_helper"

RSpec.describe GoalCalculator do
  goal = 80.0

  context "the chaotic results" do
    results = [
      [75, 6],
      [50, 6],
      [90, 6],
      [80, 6],
      [78, 6],
      [82, 30],
    ]
    it "should have a goal of 82.55% for remaining coursework" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.deliverable_goal).to eq(82.55)
    end

    it "should have 40 points remaining" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.weight_remaining?).to eq(true)
      expect(calculator.weight_remaining).to eq(40.0)
    end

    it "should have 60 points completed" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.weight_completed).to eq(60.0)
    end
  end

  context "the tiger results" do
    results = [
      [90, 6],
      [90, 6],
      [90, 6],
      [90, 6],
      [90, 6],
      [90, 30],
    ]

    it "should have a goal of 65% for remaining coursework" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.deliverable_goal).to eq(65)
    end
  end

  context "the completed results" do
    results = [
      [75, 6],
      [50, 6],
      [90, 6],
      [80, 6],
      [78, 6],
      [82, 30],
      [85, 40],
    ]

    it "should have a goal of 0% for remaining coursework" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.deliverable_goal).to eq(0)
    end

    it "should be completed" do
      calculator = GoalCalculator.new(goal)

      results.each do |result|
        calculator.add_mark(result[0], result[1])
      end

      expect(calculator.complete?).to eq(true)
    end
  end
end
