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

ActiveRecord::Schema[8.0].define(version: 2025_06_07_003036) do
  create_table "evaluation_reviewers", force: :cascade do |t|
    t.integer "evaluation_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["evaluation_id"], name: "index_evaluation_reviewers_on_evaluation_id"
    t.index ["user_id"], name: "index_evaluation_reviewers_on_user_id"
  end

  create_table "evaluations", force: :cascade do |t|
    t.string "name", null: false
    t.json "tracks"
    t.json "criteria"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "proposals", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.text "abstract"
    t.text "details"
    t.text "pitch"
    t.string "track"
    t.string "status", default: "draft", null: false
    t.datetime "submitted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "external_id", null: false
    t.integer "score", default: 0, null: false
    t.integer "reviews_count", default: 0, null: false
    t.index ["external_id"], name: "index_proposals_on_external_id", unique: true
    t.index ["status"], name: "index_proposals_on_status"
    t.index ["user_id"], name: "index_proposals_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "user_id"
    t.integer "evaluation_id"
    t.integer "proposal_id"
    t.string "status", default: "pending", null: false
    t.json "scores"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "score"
    t.index ["evaluation_id", "proposal_id", "user_id"], name: "index_reviews_on_evaluation_id_and_proposal_id_and_user_id", unique: true
    t.index ["evaluation_id"], name: "index_reviews_on_evaluation_id"
    t.index ["proposal_id"], name: "index_reviews_on_proposal_id"
    t.index ["status"], name: "index_reviews_on_status"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "speaker_profiles", force: :cascade do |t|
    t.integer "user_id"
    t.string "name", null: false
    t.string "email", null: false
    t.string "company"
    t.text "bio", limit: 1000
    t.text "socials", limit: 400
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_speaker_profiles_on_user_id"
  end

  create_table "user_oauth_providers", force: :cascade do |t|
    t.string "provider", null: false
    t.string "uid", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_user_oauth_providers_on_provider_and_uid", unique: true
    t.index ["user_id"], name: "index_user_oauth_providers_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "auth_token"
    t.string "role", default: "regular", null: false
    t.index ["auth_token"], name: "index_users_on_auth_token", unique: true, where: "auth_token is not null"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "user_oauth_providers", "users"
end
