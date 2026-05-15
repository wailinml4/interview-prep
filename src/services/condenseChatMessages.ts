import { ConnectionMessage } from "@humeai/voice-react"
import type { JsonMessage, HumeChatEvent, Message as HumeMessage } from "@/types"

type Message = JsonMessage | ConnectionMessage | HumeChatEvent | HumeMessage

export function condenseChatMessages(messages: Message[]) {
  return messages.reduce((acc, message) => {
    const data = getChatEventData(message) ?? getJsonMessageData(message)
    if (data == null || data.content == null) {
      return acc
    }

    const lastMessage = acc.at(-1)
    if (lastMessage == null) {
      acc.push({ isUser: data.isUser, content: [data.content] })
      return acc
    }

    if (lastMessage.isUser === data.isUser) {
      lastMessage.content.push(data.content)
    } else {
      acc.push({ isUser: data.isUser, content: [data.content] })
    }

    return acc
  }, [] as { isUser: boolean; content: string[] }[])
}

function getJsonMessageData(message: Message) {
  if (!('message' in message)) return null

  if (message.type !== "user_message" && message.type !== "assistant_message") {
    return null
  }

  const m = message as JsonMessage
  return {
    isUser: m.type === "user_message",
    content: m.message.content,
  }
}

function getChatEventData(message: Message) {
  if (message.type !== "USER_MESSAGE" && message.type !== "AGENT_MESSAGE") {
    return null
  }

  return {
    isUser: message.type === "USER_MESSAGE",
    content: message.messageText,
  }
}
