# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_07_14_191058) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "api_v1_courses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "course_code"
    t.integer "status"
    t.float "goal"
    t.float "grade"
    t.float "deliverable_goal"
    t.uuid "api_v1_semester_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "api_v1_user_id", null: false
    t.index ["api_v1_semester_id"], name: "index_api_v1_courses_on_api_v1_semester_id"
    t.index ["api_v1_user_id"], name: "index_api_v1_courses_on_api_v1_user_id"
  end

  create_table "api_v1_deliverables", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.float "weight"
    t.float "mark"
    t.text "notes"
    t.uuid "api_v1_course_id", null: false
    t.integer "status"
    t.float "goal"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "api_v1_user_id", null: false
    t.index ["api_v1_course_id"], name: "index_api_v1_deliverables_on_api_v1_course_id"
    t.index ["api_v1_user_id"], name: "index_api_v1_deliverables_on_api_v1_user_id"
  end

  create_table "api_v1_products", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "stripe_price"
    t.string "name"
    t.string "stripe_id"
    t.string "description"
    t.integer "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stripe_id"], name: "index_api_v1_products_on_stripe_id", unique: true
  end

  create_table "api_v1_semesters", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "status"
    t.float "goal"
    t.uuid "api_v1_user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["api_v1_user_id"], name: "index_api_v1_semesters_on_api_v1_user_id"
  end

  create_table "api_v1_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.uuid "supabase_id"
    t.integer "courses_remaining"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "api_v1_courses", "api_v1_semesters"
  add_foreign_key "api_v1_courses", "api_v1_users"
  add_foreign_key "api_v1_deliverables", "api_v1_courses"
  add_foreign_key "api_v1_deliverables", "api_v1_users"
  add_foreign_key "api_v1_semesters", "api_v1_users"
end
