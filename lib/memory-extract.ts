// 仅保留与拖延问题的“原因/卡点”和“最后待办”相关的精炼信息
// 纯前端规则，不做敏感信息存储。

export function extractReasonsFromText(text: string): string[] {
  if (!text) return []
  // 简单规则：包含原因类关键词的句子
  const lines = text
    .replace(/\n+/g, "\n")
    .split(/\n|。|；|;|！|!|？|\?/)
    .map((s) => s.trim())
    .filter(Boolean)

  const reasonKw = ["原因", "为什么", "卡住", "不想做", "没动力", "焦虑", "畏难", "拖延", "很难开始", "怕", "完美主义"]
  const denyKw = ["待办", "步骤", "今日", "明日", "今天", "明天", "完成", "添加", "加到待办"]

  return lines
    .filter((s) => reasonKw.some((k) => s.includes(k)))
    .filter((s) => !denyKw.some((k) => s.includes(k)))
    .map((s) => s.replace(/^[-•\d\.\[\]\s]+/, ""))
    .slice(0, 4)
}

export function extractCommitStepsFromAi(text: string): string[] {
  if (!text) return []
  // 复用列表样式：数字、项目符号、checkbox
  const patterns = [
    /^\s*\d+\.\s*(.+)$/gm,
    /^\s*[-•]\s*(.+)$/gm,
    /^\s*\[\s*\]\s*(.+)$/gm,
  ]
  const items: string[] = []
  patterns.forEach((p) => {
    let m: RegExpExecArray | null
    while ((m = p.exec(text)) !== null) {
      const t = (m[1] || "").trim()
      if (t.length >= 3 && t.length <= 80) items.push(t)
    }
  })
  // 去重
  return Array.from(new Set(items)).slice(0, 6)
}

