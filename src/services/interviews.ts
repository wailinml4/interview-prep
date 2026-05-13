import { JobInfoTable } from "@/drizzle/schema"
import { fetchChatMessages } from "@/lib/fetchChatMessages"
import { generateText } from "ai"
import { google } from "@/services/google"
import { interviewFeedbackPrompt } from "@/lib/prompts/interviewFeedback"

export async function generateAiInterviewFeedback({
  humeChatId,
  jobInfo,
  userName,
}: {
  humeChatId: string
  jobInfo: Pick<
    typeof JobInfoTable.$inferSelect,
    "title" | "description" | "experienceLevel"
  >
  userName: string
}) {
  const messages = await fetchChatMessages(humeChatId)

  const formattedMessages = messages
    .map(message => {
      if (message.type !== "USER_MESSAGE" && message.type !== "AGENT_MESSAGE") {
        return null
      }
      if (message.messageText == null) return null

      return {
        speaker:
          message.type === "USER_MESSAGE" ? "interviewee" : "interviewer",
        text: message.messageText,
        emotionFeatures:
          message.role === "USER" ? message.emotionFeatures : undefined,
      }
    })
    .filter(f => f != null)

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: JSON.stringify(formattedMessages),
     system: interviewFeedbackPrompt(userName, jobInfo),
  })

  return text
}
