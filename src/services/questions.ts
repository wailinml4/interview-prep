import {
  JobInfoTable,
  QuestionDifficulty,
  QuestionTable,
} from "@/drizzle/schema"
import { streamText } from "ai"
import { google } from "@/services/google"
import { questionGeneratorPrompt, questionFeedbackPrompt } from "@/lib/prompts/questionGenerator"

export function generateAiQuestion({
  jobInfo,
  previousQuestions,
  difficulty,
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
        content: difficulty,
      },
    ],
    system: questionGeneratorPrompt(jobInfo),
  })
}

export function generateAiQuestionFeedback({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return streamText({
    model: google("gemini-2.5-flash"),
    prompt: answer,
    system: questionFeedbackPrompt(question),
  })
}
