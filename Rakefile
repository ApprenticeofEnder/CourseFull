# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

# require 'rubocop/rake_task'
require File.expand_path('config/application', __dir__)

Rails.application.load_tasks
Rake::Task['test'].clear

task test: :environment do
  Rake::Task['spec'].invoke
end

# RuboCop::RakeTask.new
