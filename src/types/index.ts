export type HumeChatEvent = {
  type?: "USER_MESSAGE" | "AGENT_MESSAGE" | string
  messageText?: string | null
  role?: string
  emotionFeatures?: Record<string, number> | undefined
}

export type JsonMessage = {
  type: "user_message" | "assistant_message"
  message: { content: string }
}

export type Message = JsonMessage | HumeChatEvent | unknown
