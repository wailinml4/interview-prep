import { env } from "@/config/env.server"
import { HumeClient } from "hume"
import type { HumeChatEvent } from "@/types"

export async function fetchChatMessages(humeChatId: string) {
  "use cache"

  const client = new HumeClient({ apiKey: env.HUME_API_KEY })
  const allChatEvents: HumeChatEvent[] = []
  const chatEventsIterator = await client.empathicVoice.chats.listChatEvents(
    humeChatId,
    { pageNumber: 0, pageSize: 100 }
  )

  for await (const chatEvent of chatEventsIterator) {
    allChatEvents.push(chatEvent as HumeChatEvent)
  }

  return allChatEvents
}
