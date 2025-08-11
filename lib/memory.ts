export type MemoryKind = "reason" | "commitment"

export interface MemoryRecord {
  id: string
  kind: MemoryKind
  text: string
  createdAt: number
  updatedAt: number
  tags?: string[]
}

const STORAGE_KEY = "momentum-memory-v1"
const MAX_RECORDS = 100

function now() {
  return Date.now()
}

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

function isClient() {
  return typeof window !== "undefined"
}

function loadAll(): MemoryRecord[] {
  if (!isClient()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: MemoryRecord[] = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function saveAll(list: MemoryRecord[]) {
  if (!isClient()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

function dedupePush(list: MemoryRecord[], record: MemoryRecord): MemoryRecord[] {
  const exists = list.find((r) => r.kind === record.kind && r.text === record.text)
  if (exists) {
    exists.updatedAt = now()
    return [...list]
  }
  const next = [...list, record]
  if (next.length > MAX_RECORDS) {
    // 简单按更新时间升序丢弃最旧
    next.sort((a, b) => a.updatedAt - b.updatedAt)
    return next.slice(next.length - MAX_RECORDS)
  }
  return next
}

function clampText(t: string, max = 120) {
  const s = t.replace(/\s+/g, " ").trim()
  return s.length > max ? `${s.slice(0, max)}…` : s
}

function pickByQuery(query: string, list: MemoryRecord[]): MemoryRecord[] {
  const q = (query || "").toLowerCase()
  const reasonHints = ["原因", "为什么", "卡住", "不想", "没动力", "焦虑", "畏难"]
  const actionHints = ["待办", "步骤", "行动", "开始", "执行", "今日", "明日", "今天", "明天"]

  const prefersReason = reasonHints.some((k) => q.includes(k))
  const prefersCommit = actionHints.some((k) => q.includes(k))

  if (prefersReason && !prefersCommit) return list.filter((r) => r.kind === "reason")
  if (prefersCommit && !prefersReason) return list.filter((r) => r.kind === "commitment")

  // 默认混合
  return list
}

export const Memory = {
  addReasons(reasons: string[]) {
    if (!reasons || reasons.length === 0) return
    let all = loadAll()
    reasons.forEach((r) => {
      const text = clampText(r)
      if (!text) return
      all = dedupePush(all, {
        id: makeId(),
        kind: "reason",
        text,
        createdAt: now(),
        updatedAt: now(),
        tags: ["reason"],
      })
    })
    saveAll(all)
  },

  addCommitment(steps: string[]) {
    const clean = (steps || [])
      .map((s) => clampText(s, 80))
      .filter(Boolean)
      .slice(0, 6)
    if (clean.length === 0) return

    let all = loadAll()
    const text = clean.join("；")
    all = dedupePush(all, {
      id: makeId(),
      kind: "commitment",
      text,
      createdAt: now(),
      updatedAt: now(),
      tags: ["commitment"],
    })
    saveAll(all)
  },

  getAll(): MemoryRecord[] {
    return loadAll().sort((a, b) => b.updatedAt - a.updatedAt)
  },

  clearAll() {
    if (!isClient()) return
    localStorage.removeItem(STORAGE_KEY)
  },

  buildPreface(query: string, maxItems = 6, maxChars = 500): string | null {
    const all = this.getAll()
    if (all.length === 0) return null
    const picked = pickByQuery(query, all)
    if (picked.length === 0) return null

    const reasons = picked.filter((r) => r.kind === "reason").slice(0, Math.max(2, Math.floor(maxItems / 2)))
    const commits = picked.filter((r) => r.kind === "commitment").slice(0, Math.max(2, Math.ceil(maxItems / 2)))

    const lines: string[] = []
    if (reasons.length > 0) {
      lines.push(`拖延原因：${reasons.map((r) => r.text).join("；")}`)
    }
    if (commits.length > 0) {
      lines.push(`最近确认的待办：${commits.map((r) => r.text).join("；")}`)
    }
    if (lines.length === 0) return null

    let preface = `以下是与该用户相关的已知信息（仅用于个性化建议，勿逐字复述）：\n- ${lines.join("\n- ")}`
    if (preface.length > maxChars) {
      preface = clampText(preface, maxChars)
    }
    return preface
  },
}

