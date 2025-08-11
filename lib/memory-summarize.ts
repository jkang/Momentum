// 对超长会话做“要点压缩”成一条 system 摘要
// 采用规则生成提纲，交由模型在回复中自然体现，不额外调用外部接口。

import type { ChatMessage } from "@/hooks/use-ai-chat"

export interface Summary {
  content: string
}

export function shouldSummarize(messages: ChatMessage[], maxCount = 30, maxChars = 6000): boolean {
  const count = messages.length
  const total = messages.reduce((s, m) => s + (m.content?.length || 0), 0)
  return count > maxCount || total > maxChars
}

export function buildSummarySystem(messages: ChatMessage[]): Summary {
  // 仅总结用户的“拖延原因/卡点”和“已确认的行动方向/待办主题”
  const parts = messages.map((m) => ({ role: m.role, text: m.content.trim() }))

  const userReasons: string[] = []
  const assistantActions: string[] = []

  parts.forEach((p) => {
    if (p.role === "user") {
      if (/(原因|为什么|卡住|不想做|没动力|焦虑|畏难|怕|完美主义)/.test(p.text)) {
        userReasons.push(p.text)
      }
    } else {
      if (/(^\d+\.|^[-•]|^\[\s*\]|今日|明日|今天|明天)/m.test(p.text)) {
        assistantActions.push(p.text)
      }
    }
  })

  const topReasons = userReasons.slice(-3)
  const topActions = assistantActions.slice(-3)

  const lines: string[] = []
  if (topReasons.length) lines.push(`历史原因要点：${topReasons.map((s) => s.slice(0, 60)).join("；")}`)
  if (topActions.length) lines.push(`已达成的行动方向：${topActions.map((s) => s.slice(0, 60)).join("；")}`)

  const content = lines.length
    ? `以下为此前对话的压缩要点，请在理解上下文的前提下继续推进：\n- ${lines.join("\n- ")}`
    : `此前有较长对话，继续围绕“如何开始行动”推进。`

  return { content }
}

