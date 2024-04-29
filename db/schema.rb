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

ActiveRecord::Schema[7.1].define(version: 2024_04_27_235359) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "pgjwt"
  enable_extension "pgsodium"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  create_table "courses", force: :cascade do |t|
    t.string "title", null: false
    t.string "course_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "semester_id"
    t.index ["semester_id"], name: "index_courses_on_semester_id"
  end

  create_table "deliverables", force: :cascade do |t|
    t.string "name", null: false
    t.float "weight", null: false
    t.float "mark", null: false
    t.text "notes", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "course_id"
    t.index ["course_id"], name: "index_deliverables_on_course_id"
  end

  create_table "semesters", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "courses", "semesters"
  add_foreign_key "deliverables", "courses"
end
