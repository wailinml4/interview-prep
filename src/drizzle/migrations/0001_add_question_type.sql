-- Add question type enum and nullable column
CREATE TYPE IF NOT EXISTS "public"."questions_question_type" AS ENUM('leetcode','system-design');

ALTER TABLE IF EXISTS "public"."questions" ADD COLUMN IF NOT EXISTS "type" "public"."questions_question_type";
