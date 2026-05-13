import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { JobInfoTable } from "./jobInfo"

export const questionDifficulties = ["easy", "medium", "hard"] as const
export type QuestionDifficulty = (typeof questionDifficulties)[number]
export const questionDifficultyEnum = pgEnum(
  "questions_question_difficulty",
  questionDifficulties
)

export const questionTypes = ["leetcode", "system-design", "engineering"] as const
export type QuestionType = (typeof questionTypes)[number]
export const questionTypeEnum = pgEnum(
  "questions_question_type",
  questionTypes
)

export const QuestionTable = pgTable("questions", {
  id,
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  text: varchar().notNull(),
  difficulty: questionDifficultyEnum().notNull(),
  type: questionTypeEnum(),
  createdAt,
  updatedAt,
})

export const questionsRelations = relations(QuestionTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [QuestionTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}))
