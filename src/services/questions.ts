import {
  JobInfoTable,
  QuestionDifficulty,
  QuestionTable,
} from "@/drizzle/schema"
import { streamText } from "ai"
import { google } from "@/services/google"
import {
  questionGeneratorPrompt,
  questionFeedbackPrompt,
  leetcodeQuestionPrompt,
  systemDesignQuestionPrompt,
  leetcodeFeedbackPrompt,
  systemDesignFeedbackPrompt,
  engineeringQuestionPrompt,
  engineeringFeedbackPrompt,
} from "@/lib/prompts/questionGenerator"

export function generateAiQuestion({
  jobInfo,
  previousQuestions,
  difficulty,
  type,
  onFinish,
}: {
  jobInfo: Pick<
    typeof JobInfoTable.$inferSelect,
    "title" | "description" | "experienceLevel"
  >
  previousQuestions: Pick<
    typeof QuestionTable.$inferSelect,
    "text" | "difficulty"
  >[]
  difficulty: QuestionDifficulty
  type: "leetcode" | "system-design" | "engineering"
  onFinish: (question: string) => void
}) {
  const previousMessages: { role: "user" | "assistant"; content: string }[] = previousQuestions.flatMap(
    q => [
      { role: "user", content: q.difficulty },
      { role: "assistant", content: q.text },
    ]
  )

  return streamText({
    model: google("gemini-2.5-flash"),
    onFinish: ({ text }: { text: string }) => onFinish(text),
    messages: [
      ...previousMessages,
      {
        role: "user",
        content: `QuestionType: ${type}`,
      },
      {
        role: "user",
        content: difficulty,
      },
    ],
    system:
      type === "system-design"
        ? systemDesignQuestionPrompt(jobInfo)
        : type === "engineering"
        ? engineeringQuestionPrompt(jobInfo)
        : leetcodeQuestionPrompt(jobInfo),
  })
}

export function generateAiQuestionFeedback({
  question,
  answer,
  type,
}: {
  question: string
  answer: string
  type?: "leetcode" | "system-design" | "engineering"
}) {
  return streamText({
    model: google("gemini-2.5-flash"),
    prompt: answer,
    system:
      type === "system-design"
        ? systemDesignFeedbackPrompt(question)
        : type === "leetcode"
        ? leetcodeFeedbackPrompt(question)
        : type === "engineering"
        ? engineeringFeedbackPrompt(question)
        : questionFeedbackPrompt(question),
  })
}
