-- Add 'engineering' value to questions_question_type enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'questions_question_type' AND e.enumlabel = 'engineering'
  ) THEN
    ALTER TYPE "public"."questions_question_type" ADD VALUE 'engineering';
  END IF;
END
$$;
