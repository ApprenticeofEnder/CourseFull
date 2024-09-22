# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::Semester, type: :model do
  let(:api_v1_semester) { build(:api_v1_semester) }
  let(:api_v1_user) { build(:api_v1_user) }

  before do
    api_v1_semester
    api_v1_user
  end

  context 'should validate' do
    it 'when name, status, goal, and user are present' do
      expect(api_v1_semester).to be_valid
    end

    it 'when a user is explicitly defined' do
      api_v1_semester.user = api_v1_user
      expect(api_v1_semester).to be_valid
    end
  end

  context 'should not validate' do
    it 'when user is not present' do
      api_v1_semester.user = nil
      expect(api_v1_semester).not_to be_valid
    end

    it 'when user does not exist' do
      skip('How do you even test for this in ActiveRecord?')
    end

    it 'when name is not present' do
      api_v1_semester.name = nil
      expect(api_v1_semester).not_to be_valid
    end

    it 'when goal is not present' do
      api_v1_semester.goal = nil
      expect(api_v1_semester).not_to be_valid
    end

    it 'when status is not present' do
      api_v1_semester.status = nil
      expect(api_v1_semester).not_to be_valid
    end
  end

  context 'name' do
    it 'is not less than 2 characters' do
      api_v1_semester.name = 'A'
      expect(api_v1_semester).not_to be_valid
    end

    it 'is not greater than 150 characters' do
      api_v1_semester.name = Faker::Alphanumeric.alpha(number: 151)
      expect(api_v1_semester).not_to be_valid
    end

    it 'validates for all lengths between 2 and 150, inclusive' do
      [2..151].each do |length|
        api_v1_semester.name = Faker::Alphanumeric.alpha(number: length)
        expect(api_v1_semester).to be_valid
      end
    end
  end

  context 'goal' do
    it 'is not less than 0' do
      api_v1_semester.goal = -0.1
      expect(api_v1_semester).not_to be_valid
    end

    it 'is not greater than 100' do
      api_v1_semester.goal = -100.1
      expect(api_v1_semester).not_to be_valid
    end
  end

  context 'status' do
    it 'validates for not_started' do
      api_v1_semester.status = 'not_started'
      expect(api_v1_semester).to be_valid
    end

    it 'validates for active' do
      api_v1_semester.status = 'active'
      expect(api_v1_semester).to be_valid
    end

    it 'validates for complete' do
      api_v1_semester.status = 'complete'
      expect(api_v1_semester).to be_valid
    end

    it 'does not validate for anything else' do
      expect do
        api_v1_semester.status = 'completed'
      end.to raise_error(ArgumentError)
    end
  end
end
