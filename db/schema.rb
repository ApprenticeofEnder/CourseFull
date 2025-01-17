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

ActiveRecord::Schema[7.1].define(version: 2025_01_16_202109) do
  create_schema "_analytics"
  create_schema "_realtime"
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "net"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "supabase_functions"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_net"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "pgjwt"
  enable_extension "pgsodium"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

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
    t.datetime "start_date", default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "deadline", default: -> { "CURRENT_TIMESTAMP" }
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
    t.boolean "subscribed"
    t.index ["email"], name: "index_api_v1_users_on_email", unique: true
    t.index ["supabase_id"], name: "index_api_v1_users_on_supabase_id", unique: true
  end

  add_foreign_key "api_v1_courses", "api_v1_semesters"
  add_foreign_key "api_v1_courses", "api_v1_users"
  add_foreign_key "api_v1_deliverables", "api_v1_courses"
  add_foreign_key "api_v1_deliverables", "api_v1_users"
  add_foreign_key "api_v1_semesters", "api_v1_users"
end
