"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

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
const CURRENT_SESSION_KEY = "momentum-current-session-v1"
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

// 当前会话管理
function getCurrentSessionId(): string | null {
  try {
    return localStorage.getItem(CURRENT_SESSION_KEY)
  } catch {
    return null
  }
}

function setCurrentSessionId(sessionId: string | null) {
  try {
    if (sessionId) {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY)
    }
  } catch {
    // ignore
  }
}

type SendMessageOptions = {
  titleForNewSession?: string
  hiddenSystem?: string // 隐藏上下文，仅随请求发送，不展示在 UI
}

export function useAiChat() {
  const router = useRouter()

  const [currentSessionId, setCurrentSessionIdState] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingTodos, setPendingTodos] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  // 包装setCurrentSessionId，同时更新localStorage
  const updateCurrentSessionId = useCallback((sessionId: string | null) => {
    setCurrentSessionIdState(sessionId)
    setCurrentSessionId(sessionId)
  }, [])

  // 初始化：从localStorage加载当前会话
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedSessionId = getCurrentSessionId()
    if (!savedSessionId) {
      // 无当前会话时，尝试加载最近的会话
      const sessions = readSessions()
      if (sessions.length > 0) {
        const latestSession = sessions[0] // sessions已按updatedAt排序
        updateCurrentSessionId(latestSession.id)
        setMessages(latestSession.messages)
      } else {
        updateCurrentSessionId(null)
        setMessages([])
      }
      return
    }

    // 加载指定会话
    const sessions = readSessions()
    const session = sessions.find((s) => s.id === savedSessionId)

    if (session) {
      updateCurrentSessionId(session.id)
      setMessages(session.messages)
    } else {
      // 会话不存在，清除并加载最新会话
      const latestSession = sessions[0]
      if (latestSession) {
        updateCurrentSessionId(latestSession.id)
        setMessages(latestSession.messages)
      } else {
        updateCurrentSessionId(null)
        setMessages([])
      }
    }
  }, [updateCurrentSessionId])

  // 列出会话
  const listSessions = useCallback((): ChatSession[] => {
    const sessions = readSessions()
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [])

  // 切换到指定会话
  const switchToSession = useCallback((sessionId: string) => {
    const sessions = readSessions()
    const session = sessions.find((s) => s.id === sessionId)
    if (session) {
      updateCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }, [updateCurrentSessionId])

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
      updateCurrentSessionId(id)
      setMessages([])
      return id
    },
    [updateCurrentSessionId],
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
        // 删除当前会话后，尝试加载最新会话
        if (sessions.length > 0) {
          const latestSession = sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0]
          updateCurrentSessionId(latestSession.id)
          setMessages(latestSession.messages)
        } else {
          updateCurrentSessionId(null)
          setMessages([])
        }
      }
    },
    [currentSessionId, updateCurrentSessionId],
  )

  // 清空全部历史
  const clearAllSessions = useCallback(() => {
    localStorage.removeItem(SESSIONS_KEY)
    setCurrentSessionId(null)
    setMessages([])
    router.replace("/chat")
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

    // 匹配数字列表格式的行动步骤
    const numbered = text.match(/^\d+\.\s*(.+)$/gm)
    if (numbered) {
      items.push(...numbered.map((m) => m.replace(/^\d+\.\s*/, "")).filter(item => {
        // 过滤掉分析性文字，只保留行动性内容
        const actionKeywords = ['开始', '制定', '设置', '完成', '练习', '尝试', '联系', '准备', '安排', '执行', '写', '做', '学习', '阅读']
        const analysisKeywords = ['因为', '所以', '可能', '通常', '一般来说', '建议', '重要的是', '需要注意']

        const hasActionKeyword = actionKeywords.some(keyword => item.includes(keyword))
        const hasAnalysisKeyword = analysisKeywords.some(keyword => item.includes(keyword))

        return hasActionKeyword && !hasAnalysisKeyword && item.length > 5 && item.length < 50
      }))
    }

    const bullets = text.match(/^[-•]\s*(.+)$/gm)
    if (bullets) {
      items.push(...bullets.map((m) => m.replace(/^[-•]\s*/, "")).filter(item => {
        const actionKeywords = ['开始', '制定', '设置', '完成', '练习', '尝试', '联系', '准备', '安排', '执行', '写', '做', '学习', '阅读']
        return actionKeywords.some(keyword => item.includes(keyword)) && item.length > 5 && item.length < 50
      }))
    }

    return items.filter((x) => x.trim()).slice(0, 6)
  }, [])

  // 提取特定类型的待办项（如今日待办、明日待办）
  const extractSpecificTodos = useCallback((text: string, keyword: string): string[] => {
    // 查找包含关键词的段落
    const lines = text.split('\n')
    let inTargetSection = false
    let sectionItems: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      // 检测是否进入目标段落
      if (trimmedLine.includes(keyword) && (trimmedLine.includes('待办') || trimmedLine.includes('计划') || trimmedLine.includes('任务'))) {
        inTargetSection = true
        sectionItems = []
        continue
      }

      // 检测是否离开目标段落（遇到其他标题）
      if (inTargetSection && trimmedLine.match(/^(明日|今日|本周|下周|短期|长期|第\d+|步骤)/)) {
        if (!trimmedLine.includes(keyword)) {
          break
        }
      }

      // 在目标段落中提取项目
      if (inTargetSection) {
        const numbered = trimmedLine.match(/^\d+\.\s*(.+)$/)
        const bulleted = trimmedLine.match(/^[-•]\s*(.+)$/)

        if (numbered) {
          const item = numbered[1].trim()
          if (item.length > 5 && item.length < 80) {
            sectionItems.push(item)
          }
        } else if (bulleted) {
          const item = bulleted[1].trim()
          if (item.length > 5 && item.length < 80) {
            sectionItems.push(item)
          }
        }
      }
    }

    return sectionItems.slice(0, 6)
  }, [])

  // 检测“加到待办”意图
  const detectAddTodo = useCallback((user: string): { type: 'add' | 'confirm' | 'specific', content?: string } | null => {
    const userLower = user.toLowerCase()

    // 检测确认意图
    const confirmKeywords = ["确认", "好的", "是的", "对", "没错", "正确", "添加这些"]
    if (confirmKeywords.some(k => userLower.includes(k))) {
      return { type: 'confirm' }
    }

    // 检测特定待办意图（如"把今日待办添加到todolist"）
    const specificPatterns = [
      /把(.+?)添加到/,
      /将(.+?)加入/,
      /(.+?)加到待办/,
      /添加(.+?)到待办/
    ]

    for (const pattern of specificPatterns) {
      const match = user.match(pattern)
      if (match) {
        return { type: 'specific', content: match[1] }
      }
    }

    // 检测一般加到待办意图
    const generalKeywords = ["帮我加到待办", "添加到待办", "加入待办", "放到待办", "保存到待办", "记录到待办"]
    if (generalKeywords.some(k => userLower.includes(k))) {
      return { type: 'add' }
    }

    return null
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
    async (content: string, options?: SendMessageOptions): Promise<string | undefined> => {
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
      let tutorialPrompt = ""
      if (tutorialHit) {
        // const linkMsg: ChatMessage = {
        //   id: makeId(),
        //   role: "assistant",
        //   content: `📘 教程推荐： [${tutorialHit.title}](/tutorials/${tutorialHit.slug})\n\n提示：阅读后我可以根据教程为你拆出最多 6 条学习行动项，随时对我说“帮我加到待办”。`,
        //   timestamp: now(),
        // }
        tutorialPrompt = `\n\n另外，我发现有个相关教程可能对你有帮助：📘 [${tutorialHit.title}](/tutorials/${tutorialHit.slug})。如果需要，我可以根据教程为你拆解学习行动项。`
      }

      const todoIntent = detectAddTodo(content)
      const lastAi = [...messages].reverse().find((m) => m.role === "assistant")?.content || ""

      try {
        abortRef.current = new AbortController()

        const apiMessages = [
          ...(options?.hiddenSystem ? [{ role: "system", content: options.hiddenSystem }] : []),
          ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
        ]

        // 如果有教程推荐，添加到系统提示中
        if (tutorialPrompt) {
          apiMessages.push({ role: "system", content: `请在回复末尾添加这个教程推荐：${tutorialPrompt}` })
        }

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

        // 关键修复：以 nextMessages 为起点
        let working = [...nextMessages, assistantMsg]
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
                  working = [...nextMessages, { ...assistantMsg }]
                  setMessages(working)
                  persistMessages(working)
                }
              } catch {}
            }
          }
        }

        // 处理待办相关意图
        if (todoIntent && lastAi) {
          if (todoIntent.type === 'confirm' && pendingTodos.length > 0) {
            // 用户确认添加待办
            const added = addTodos(pendingTodos)
            setPendingTodos([])
            const confirm: ChatMessage = {
              id: makeId(),
              role: "assistant",
              content: `✅ 已添加 ${added} 个行动项到待办清单。\n\n3 秒后将跳转到待办页查看。`,
              timestamp: now(),
            }
            const finalList = [...working, confirm]
            setMessages(finalList)
            persistMessages(finalList)
            setTimeout(() => router.push("/todolist"), 3000)
          } else if (todoIntent.type === 'specific' && todoIntent.content) {
            // 用户指定了特定类型的待办（如"今日待办"）
            const specificTodos = extractSpecificTodos(lastAi, todoIntent.content)
            if (specificTodos.length > 0) {
              setPendingTodos(specificTodos)
              const confirm: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `我从上次回复中提取到以下${todoIntent.content}项目：\n\n${specificTodos.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n请确认是否要将这些项目添加到待办清单？回复"确认"即可添加。`,
                timestamp: now(),
              }
              const finalList = [...working, confirm]
              setMessages(finalList)
              persistMessages(finalList)
            } else {
              const noItems: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `抱歉，我在上次回复中没有找到明确的${todoIntent.content}项目。你可以直接告诉我具体要添加哪些待办事项。`,
                timestamp: now(),
              }
              const finalList = [...working, noItems]
              setMessages(finalList)
              persistMessages(finalList)
            }
          } else if (todoIntent.type === 'add') {
            // 一般的加到待办意图
            const steps = extractActionSteps(lastAi)
            if (steps.length > 0) {
              setPendingTodos(steps)
              const confirm: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `我从上次回复中提取到以下行动项：\n\n${steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n请确认是否要将这些项目添加到待办清单？回复"确认"即可添加。`,
                timestamp: now(),
              }
              const finalList = [...working, confirm]
              setMessages(finalList)
              persistMessages(finalList)
            } else {
              const noSteps: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `抱歉，我在上次回复中没有找到明确的行动步骤。你可以直接告诉我具体要添加哪些待办事项。`,
                timestamp: now(),
              }
              const finalList = [...working, noSteps]
              setMessages(finalList)
              persistMessages(finalList)
            }
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

      return sid
    },
    [
      isLoading,
      currentSessionId,
      startSession,
      messages,
      persistMessages,
      detectAddTodo,
      extractActionSteps,
      extractSpecificTodos,
      addTodos,
      pendingTodos,
      setPendingTodos,
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
    switchToSession,
    updateSessionTitle,
    listSessions,
    deleteSession,
    clearAllSessions,
  }
}
