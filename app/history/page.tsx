"use client"

import { useEffect, useState } from "react"
import { Trash2, Clock, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

const SESSIONS_KEY = "momentum-sessions-v1"
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000
const MAX_SESSIONS = 3 // 只保留最近的3次对话历史

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  const load = () => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY)
      const all: ChatSession[] = raw ? JSON.parse(raw) : []
      const cutoff = Date.now() - EXPIRY_MS

      // 过期清理和会话数量限制
      let filtered = all.filter((s) => s.updatedAt >= cutoff)
      filtered = filtered
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, MAX_SESSIONS) // 只保留最近3次对话

      // 如果数据有变化，更新localStorage
      if (filtered.length !== all.length) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered))
      }

      setSessions(filtered)
    } catch {
      setSessions([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = (id: string) => {
    const next = sessions.filter((s) => s.id !== id)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next))
    setSessions(next)
  }

  const clearAll = () => {
    localStorage.removeItem(SESSIONS_KEY)
    setSessions([])
  }

  return (
    <div className="min-h-screen bg-momentum-cream">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-momentum-forest">聊天历史</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" className="bg-transparent text-momentum-sage hover:text-momentum-forest">
                返回聊天
              </Button>
            </Link>
            {sessions.length > 0 && (
              <Button variant="outline" onClick={clearAll} className="bg-transparent text-red-600 hover:text-red-700">
                清空所有
              </Button>
            )}
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-momentum-white border border-momentum-sage-light-20 rounded-lg p-6 text-momentum-muted">
            暂无历史记录。
          </div>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="bg-momentum-white border border-momentum-sage-light-20 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <Link
                    href={`/?sessionId=${encodeURIComponent(s.id)}`}
                    className="block hover:underline text-momentum-forest font-medium truncate"
                  >
                    {s.title || "未命名对话"}
                  </Link>
                  <div className="text-xs text-momentum-muted mt-1 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(s.updatedAt).toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquareText className="w-3 h-3" />
                      {s.messages.length} 条消息
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => remove(s.id)}
                  className="bg-transparent text-red-600 hover:text-red-700 ml-3"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
