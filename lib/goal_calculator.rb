class GoalCalculator
  attr_reader :weight_completed, :weight_remaining, :earned_points, :target_grade

  def initialize(target_grade)
    @full_weight = 100.0
    @weight_completed = 0.0
    @earned_points = 0.0
    @target_grade = target_grade.to_f

    self.calculate_remaining_stats
  end

  def add_mark(mark, weight)
    mark_dec = mark.to_f / 100.0
    self.add_mark_dec(weight.to_f, mark_dec)
  end

  def add_mark_dec(weight, mark_dec)
    @earned_points += mark_dec * weight
    @weight_completed += weight
    self.calculate_remaining_stats
  end

  def calculate_remaining_stats
    @weight_remaining = @full_weight - @weight_completed
    @points_remaining = @target_grade - @earned_points
  end

  def weight_remaining?
    return @weight_remaining > 0
  end

  def complete?
    return @weight_completed >= 100
  end

  def deliverable_goal
    if self.weight_remaining?
      raw_result = 100 * @points_remaining / @weight_remaining
      return raw_result.round(1)
    end
    return 0
  end

  def grade
    raw_result = 100 * @earned_points / @weight_completed
    return raw_result.round(1)
  end
end
