"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export type Role = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: Role
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

const SESSIONS_KEY = "momentum-sessions-v1"
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 天过期

function now() {
  return Date.now()
}

function readSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    const list: ChatSession[] = raw ? JSON.parse(raw) : []
    // 过期清理
    const cutoff = now() - EXPIRY_MS
    const filtered = list.filter((s) => s.updatedAt >= cutoff)
    if (filtered.length !== list.length) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered))
    }
    return filtered
  } catch {
    return []
  }
}

function writeSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

type SendMessageOptions = {
  titleForNewSession?: string
  hiddenSystem?: string // 隐藏上下文，仅随请求发送，不展示在 UI
}

export function useAiChat() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 仅用稳定字符串作为依赖，避免 useSearchParams 引用变化导致死循环
  const sessionIdString = useMemo(() => (searchParams ? searchParams.toString() : ""), [searchParams])
  const sessionId = useMemo(() => {
    try {
      const sp = new URLSearchParams(sessionIdString)
      return sp.get("sessionId")
    } catch {
      return null
    }
  }, [sessionIdString])

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 初始化：根据 ?sessionId 加载
  useEffect(() => {
    if (typeof window === "undefined") return

    if (!sessionId) {
      // 无 sessionId 时仅重置状态
      setCurrentSessionId(null)
      setMessages([])
      return
    }

    const sessions = readSessions()
    const s = sessions.find((x) => x.id === sessionId)

    if (s) {
      setCurrentSessionId((prev) => (prev === s.id ? prev : s.id))
      setMessages((prev) => {
        const prevLen = prev.length
        const nextLen = s.messages.length
        if (prevLen === nextLen && prevLen > 0 && prev[prevLen - 1]?.id === s.messages[nextLen - 1]?.id) {
          return prev
        }
        return s.messages
      })
    } else {
      router.replace("/")
    }
  }, [sessionId, router])

  // 列出会话
  const listSessions = useCallback((): ChatSession[] => {
    const sessions = readSessions()
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [])

  // 新建会话
  const startSession = useCallback(
    (title?: string) => {
      const id = makeId()
      const session: ChatSession = {
        id,
        title: title?.trim() || "新的对话",
        createdAt: now(),
        updatedAt: now(),
        messages: [],
      }
      const sessions = readSessions()
      sessions.push(session)
      writeSessions(sessions)
      setCurrentSessionId(id)
      setMessages([])
      router.replace(`/?sessionId=${encodeURIComponent(id)}`)
      return id
    },
    [router],
  )

  // 更新会话标题
  const updateSessionTitle = useCallback((id: string, title: string) => {
    const sessions = readSessions()
    const idx = sessions.findIndex((s) => s.id === id)
    if (idx >= 0) {
      sessions[idx].title = title
      sessions[idx].updatedAt = now()
      writeSessions(sessions)
    }
  }, [])

  // 删除当前/指定会话
  const deleteSession = useCallback(
    (id?: string) => {
      const targetId = id || currentSessionId
      if (!targetId) return
      const sessions = readSessions().filter((s) => s.id !== targetId)
      writeSessions(sessions)
      if (!id || id === currentSessionId) {
        setCurrentSessionId(null)
        setMessages([])
        router.replace("/")
      }
    },
    [currentSessionId, router],
  )

  // 清空全部历史
  const clearAllSessions = useCallback(() => {
    localStorage.removeItem(SESSIONS_KEY)
    setCurrentSessionId(null)
    setMessages([])
    router.replace("/")
  }, [router])

  // 将最新消息写回当前会话
  const persistMessages = useCallback(
    (msgs: ChatMessage[]) => {
      const id = currentSessionId
      if (!id) return
      const sessions = readSessions()
      const idx = sessions.findIndex((s) => s.id === id)
      if (idx >= 0) {
        sessions[idx].messages = msgs
        sessions[idx].updatedAt = now()
        writeSessions(sessions)
      }
    },
    [currentSessionId],
  )

  // 提取行动步骤（最多 6）
  const extractActionSteps = useCallback((text: string): string[] => {
    const items: string[] = []
    const numbered = text.match(/^\d+\.\s*(.+)$/gm)
    if (numbered) items.push(...numbered.map((m) => m.replace(/^\d+\.\s*/, "")))
    const bullets = text.match(/^[-•]\s*(.+)$/gm)
    if (bullets) items.push(...bullets.map((m) => m.replace(/^[-•]\s*/, "")))
    const steps = text.match(/步骤\d+[:：]\s*(.+)/g)
    if (steps) items.push(...steps.map((m) => m.replace(/步骤\d+[:：]\s*/, "")))
    return items.filter((x) => x.trim()).slice(0, 6)
  }, [])

  // 检测“加到待办”意图
  const detectAddTodo = useCallback((user: string): boolean => {
    const list = ["帮我加到待办", "添加到待办", "加入待办", "放到待办", "保存到待办", "记录到待办"]
    return list.some((k) => user.toLowerCase().includes(k.toLowerCase()))
  }, [])

  // 添加到待办（localStorage: momentum-todos）
  const addTodos = useCallback((steps: string[]) => {
    try {
      const existing = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
      const newOnes = steps.slice(0, 6).map((s: string) => ({
        id: makeId(),
        title: s.length > 50 ? `${s.slice(0, 50)}...` : s,
        description: s,
        completed: false,
        createdAt: new Date().toISOString(),
      }))
      localStorage.setItem("momentum-todos", JSON.stringify([...existing, ...newOnes]))
      return newOnes.length
    } catch {
      return 0
    }
  }, [])

  const TUTORIALS = [
    { slug: "github", title: "GitHub 入门教程", pattern: /(github|git hub|git 的教程|github 入门|看看\s*github)/i },
    { slug: "vercel", title: "Vercel 入门教程", pattern: /(vercel|vercel 入门|部署到\s*vercel|看看\s*vercel)/i },
    { slug: "cursor", title: "Cursor 入门教程", pattern: /(cursor|cursor 入门|看看\s*cursor)/i },
    { slug: "v0", title: "v0 入门教程", pattern: /(v0|v 0|v0 入门|看看\s*v0)/i },
  ]

  function detectTutorialIntent(text: string): { slug: string; title: string } | null {
    for (const item of TUTORIALS) {
      if (item.pattern.test(text)) return { slug: item.slug, title: item.title }
    }
    return null
  }

  // 发送消息（支持隐藏 system 上下文）
  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions) => {
      if (!content.trim() || isLoading) return

      // 若没有会话，创建并命名
      let sid = currentSessionId
      if (!sid) {
        sid = startSession(options?.titleForNewSession || content.slice(0, 30))
      }

      setError(null)
      setIsLoading(true)

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: content.trim(),
        timestamp: now(),
      }
      const nextMessages = [...messages, userMsg]
      setMessages(nextMessages)
      persistMessages(nextMessages)

      const tutorialHit = detectTutorialIntent(content)
      let baseMessages = nextMessages
      if (tutorialHit) {
        const linkMsg: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content: `📘 教程推荐： [${tutorialHit.title}](/tutorials/${tutorialHit.slug})\n\n提示：阅读后我可以根据教程为你拆出最多 6 条学习行动项，随时对我说“帮我加到待办”。`,
          timestamp: now(),
        }
        baseMessages = [...nextMessages, linkMsg]
        setMessages(baseMessages)
        persistMessages(baseMessages)
      }

      const wantAddTodo = detectAddTodo(content)
      const lastAi = [...messages].reverse().find((m) => m.role === "assistant")?.content || ""

      try {
        abortRef.current = new AbortController()

        const apiMessages = [
          ...(options?.hiddenSystem ? [{ role: "system", content: options.hiddenSystem }] : []),
          ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
        ]

        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortRef.current.signal,
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const reader = response.body?.getReader()
        if (!reader) throw new Error("No body")

        const assistantMsg: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content: "",
          timestamp: now(),
        }

        // 关键修复：以 baseMessages（可能包含教程链接）为起点
        let working = [...baseMessages, assistantMsg]
        setMessages(working)

        const decoder = new TextDecoder()
        let buf = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split("\n")
          buf = lines.pop() || ""
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantMsg.content += parsed.content
                  working = [...baseMessages, { ...assistantMsg }]
                  setMessages(working)
                  persistMessages(working)
                }
              } catch {}
            }
          }
        }

        if (wantAddTodo && lastAi) {
          const steps = extractActionSteps(lastAi)
          if (steps.length) {
            const added = addTodos(steps)
            const confirm: ChatMessage = {
              id: makeId(),
              role: "assistant",
              content: `✅ 已添加 ${added} 个学习行动项到待办清单。\n3 秒后将跳转到待办页查看。`,
              timestamp: now(),
            }
            const finalList = [...working, confirm]
            setMessages(finalList)
            persistMessages(finalList)
            setTimeout(() => router.push("/todolist"), 3000)
          }
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError("发送消息失败，请重试")
        }
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [
      isLoading,
      currentSessionId,
      startSession,
      messages,
      persistMessages,
      detectAddTodo,
      extractActionSteps,
      addTodos,
      router,
    ],
  )

  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
      setIsLoading(false)
    }
  }, [])

  // 清空当前会话（删除会话）
  const clearChat = useCallback(() => {
    deleteSession()
  }, [deleteSession])

  return {
    // state
    messages,
    isLoading,
    error,
    currentSessionId,
    // actions
    sendMessage,
    stopGeneration,
    clearChat,
    // sessions
    startSession,
    updateSessionTitle,
    listSessions,
    deleteSession,
    clearAllSessions,
  }
}
