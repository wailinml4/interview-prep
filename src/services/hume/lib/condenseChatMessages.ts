export function condenseChatMessages(messages: any[]) {
  // Convert raw messages into condensed display format expected by CondensedMessages component.
  // Each item: { isUser: boolean, content: string[] }
  return messages.map(m => ({
    isUser: (m?.role ?? m?.sender) === "user",
    content: Array.isArray(m?.text) ? m.text : [String(m?.text ?? "")],
  }))
}
