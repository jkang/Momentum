"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Memory } from "@/lib/memory"
import { extractReasonsFromText, extractCommitStepsFromAi } from "@/lib/memory-extract"
import { shouldSummarize, buildSummarySystem } from "@/lib/memory-summarize"
import { sanitizeChatText } from "@/lib/sanitization"

export type Role = "user" | "assistant" | "system"

export interface QuickReply {
  text: string
  action: string
}

export interface ChatMessage {
  id: string
  role: Role
  content: string
  timestamp: number
  quickReplies?: QuickReply[]
}

export interface ChatSession {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

// 带有日期信息的待办项接口
interface TodoWithDate {
  title: string
  description?: string
  deadlineDate?: string // YYYY-MM-DD格式
}

// 日期工具函数
const getTodayDate = (): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString().slice(0, 10)
}

const getTomorrowDate = (): string => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.toISOString().slice(0, 10)
}

// 将字符串数组转换为TodoWithDate数组的辅助函数
const convertStringArrayToTodos = (items: string[], defaultDate?: string): TodoWithDate[] => {
  const date = defaultDate || getTomorrowDate()
  return items.map(item => ({
    title: item.length > 50 ? `${item.slice(0, 50)}...` : item,
    description: item,
    deadlineDate: date
  }))
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
      items.push(...numbered.map((m) => m.replace(/^\d+\.\s*/, "")))
    }

    // 匹配项目符号格式
    const bullets = text.match(/^[-•]\s*(.+)$/gm)
    if (bullets) {
      items.push(...bullets.map((m) => m.replace(/^[-•]\s*/, "")))
    }

    // 支持checkbox格式 [ ] 任务内容
    const checkboxItems = text.match(/^[\s]*\[[\s]*\][\s]*(.+)$/gm)
    if (checkboxItems) {
      items.push(...checkboxItems.map(m => m.replace(/^[\s]*\[[\s]*\][\s]*/, "")))
    }

    // 支持特殊符号格式（如∨、图、@等）
    const specialItems = text.match(/^[∨图@钟]\s*(.+)$/gm)
    if (specialItems) {
      items.push(...specialItems.map(m => m.replace(/^[∨图@钟]\s*/, "")))
    }

    // 支持时间前缀格式（如"15:00前"、"晚饭后"等）
    const timeItems = text.match(/^[\s]*(?:\d{1,2}:\d{2}前|早上\d{1,2}点|晚饭后|下午\d点前)\s*(.+)$/gm)
    if (timeItems) {
      items.push(...timeItems.map(m => m.replace(/^[\s]*(?:\d{1,2}:\d{2}前|早上\d{1,2}点|晚饭后|下午\d点前)\s*/, "")))
    }

    const analysisKeywords = ['因为', '所以', '可能', '通常', '一般来说', '建议', '重要的是', '需要注意', '但是', '然而', '不过', '虽然', '尽管']

    return items.filter(item => {
      const trimmedItem = item.trim()
      const hasAnalysisKeyword = analysisKeywords.some(keyword => trimmedItem.includes(keyword))

      // 过滤掉明显的标题、时间描述等
      const isTitle = /^(今日|明日|本周|下周|步骤|提示|小技巧|需要|时间|剩余时间|建议设定|约\d+小时)/.test(trimmedItem)

      return !hasAnalysisKeyword && !isTitle && trimmedItem.length >= 3 && trimmedItem.length <= 80
    }).slice(0, 6)
  }, [])

  // 根据用户意图，从AI回复中提取特定待办事项
  const extractSpecificTodos = useCallback((text: string, userMessage: string): { type: 'specific'; items: TodoWithDate[] } | { type: 'none' } => {
    const userLower = userMessage.toLowerCase();
    const allKeywords = ["都添加", "全部添加", "所有的", "全部的", "今日和明日", "今天和明天"];
    const isAddAll = allKeywords.some(k => userLower.includes(k));

    const todayKeywords = ['今日', '今天'];
    const tomorrowKeywords = ['明日', '明天'];

    const wantsToday = todayKeywords.some(kw => userLower.includes(kw));
    const wantsTomorrow = tomorrowKeywords.some(kw => userLower.includes(kw));

    // 根据用户消息确定默认日期
    let defaultDate: string;
    if (wantsToday && !wantsTomorrow) {
      defaultDate = getTodayDate();
    } else if (wantsTomorrow && !wantsToday) {
      defaultDate = getTomorrowDate();
    } else {
      // 如果没有明确指定或者同时指定了今天和明天，默认为明天
      defaultDate = getTomorrowDate();
    }

    const extractAllItems = (text: string): TodoWithDate[] => {
        const items: TodoWithDate[] = [];

        // 匹配多种格式的列表项
        const patterns = [
          /^\s*\d+\.\s*(.+)$/gm,                    // 数字列表: 1. 任务
          /^\s*[-•]\s*(.+)$/gm,                     // 项目符号: - 任务 或 • 任务
          /^\s*\[\s*\]\s*(.+)$/gm,                  // checkbox: [] 任务
          /^\s*[∨图@钟]\s*(.+)$/gm,                 // 特殊符号: ∨ 任务
          /^\s*(?:\d{1,2}:\d{2}前|早上\d{1,2}点|晚饭后|下午\d点前)\s*(.+)$/gm  // 时间前缀
        ];

        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            const item = match[1].trim();
            if (item.length > 3 && item.length < 80) {
              // 过滤掉标题和描述性文字
              if (!/^(今日|明日|本周|下周|步骤|提示|小技巧|需要|时间|剩余时间|建议设定|约\d+小时)/.test(item)) {
                items.push({
                  title: item.length > 50 ? `${item.slice(0, 50)}...` : item,
                  description: item,
                  deadlineDate: defaultDate
                });
              }
            }
          }
        });

        // 去重（基于title）
        const uniqueItems = items.filter((item, index, self) =>
          index === self.findIndex(t => t.title === item.title)
        );
        return uniqueItems;
    };

    if (isAddAll || (wantsToday && wantsTomorrow)) {
        const allItems = extractAllItems(text);
        if (allItems.length > 0) {
            return { type: 'specific', items: allItems.slice(0, 10) };
        }
    }

    const lines = text.split('\n');
    let items: TodoWithDate[] = [];
    let collectingFor: 'today' | 'tomorrow' | 'none' = 'none';
    let currentDate = defaultDate;

    for (const line of lines) {
        const isTodayHeader = todayKeywords.some(kw => line.includes(kw) && !/^\s*(\d+\.|[-•]|\[\s*\])/.test(line));
        const isTomorrowHeader = tomorrowKeywords.some(kw => line.includes(kw) && !/^\s*(\d+\.|[-•]|\[\s*\])/.test(line));

        if (isTodayHeader) {
            collectingFor = 'today';
            currentDate = getTodayDate();
            continue;
        }
        if (isTomorrowHeader) {
            collectingFor = 'tomorrow';
            currentDate = getTomorrowDate();
            continue;
        }

        const isListItem = /^\s*(?:\d+\.|[-•]|\[\s*\])\s*(.+)/.test(line);
        if (!isListItem) {
            if (line.trim() !== '') {
                 collectingFor = 'none';
                 currentDate = defaultDate;
            }
            continue;
        }

        if ((wantsToday && collectingFor === 'today') || (wantsTomorrow && collectingFor === 'tomorrow')) {
            const itemText = line.replace(/^\s*(?:\d+\.|[-•]|\[\s*\])\s*/, '').trim();
            if (itemText) {
                items.push({
                  title: itemText.length > 50 ? `${itemText.slice(0, 50)}...` : itemText,
                  description: itemText,
                  deadlineDate: currentDate
                });
            }
        }
    }

    if (items.length === 0) {
        const genericKeywords = ['todo', '待办'];
        if (genericKeywords.some(kw => userLower.includes(kw))) {
            items = extractAllItems(text);
        }
    }

    if (items.length > 0) {
        return { type: 'specific', items: items.slice(0, 10) };
    }

    return { type: 'none' };
  }, []);

  // 检测“加到待办”意图
  const detectAddTodo = useCallback((userMessage: string): { type: 'add_all' | 'confirm' | 'specific' | 'action_steps' | 'none' } => {
    const userLower = userMessage.toLowerCase()

    // 检测确认意图
    const confirmKeywords = ["确认", "好的", "是的", "对", "没错", "正确", "添加这些"]
    if (confirmKeywords.some(k => userLower.includes(k))) {
      return { type: 'confirm' }
    }

    // 检测添加全部意图
    const allKeywords = ["都添加", "全部添加", "所有的", "全部的", "今日和明日", "今天和明天"]
    if (allKeywords.some(k => userLower.includes(k))) {
      return { type: 'add_all' }
    }

    // 检测特定时间意图
    const specificKeywords = ['今日', '明日', '今天', '明天']
    if (specificKeywords.some(k => userLower.includes(k))) {
      return { type: 'specific' }
    }

    // 检测一般加到待办意图
    const generalKeywords = ["加到待办", "帮我加到待办", "添加到待办", "加入待办", "放到待办", "保存到待办", "记录到待办", "加到todolist", "加到todo", 'action', 'list', '总结', '安排', '计划']
    const uniqueKeywords = [...new Set(generalKeywords)]
    if (uniqueKeywords.some(k => userLower.includes(k))) {
      return { type: 'action_steps' }
    }

    return { type: 'none' }
  }, [])

  // 添加到待办（localStorage: momentum-todos）
  const addTodos = useCallback((todos: TodoWithDate[]) => {
    try {
      const existing = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
      // 增加支持更多待办项，从6个提高到10个
      const newOnes = todos.slice(0, 10).map((todo: TodoWithDate) => ({
        id: makeId(),
        title: todo.title,
        description: todo.description || todo.title,
        completed: false,
        deadlineDate: todo.deadlineDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      localStorage.setItem("momentum-todos", JSON.stringify([...existing, ...newOnes]))
      return newOnes.length
    } catch {
      return 0
    }
  }, [])

  // 检测是否包含任务拆解（多种列表格式）
  const containsTaskBreakdown = useCallback((content: string): boolean => {
    // 检测是否有各种格式的任务拆解
    const listPatterns = [
      /^\d+\.\s+.+$/m,              // 1. 任务
      /^•\s+.+$/m,                  // • 任务
      /^-\s+.+$/m,                  // - 任务
      /^\*\s+.+$/m,                 // * 任务
      /^\[\s*\]\s+.+$/m,            // [] 任务
      /^[∨图@钟]\s+.+$/m,           // ∨ 任务 (特殊符号)
      /^\d{1,2}:\d{2}前\s+.+$/m,    // 15:00前 任务
      /^(早上|晚饭后|下午)\d*点?\s+.+$/m  // 早上10点 任务
    ]

    return listPatterns.some(pattern => pattern.test(content))
  }, [])

  // 阶段识别与兜底选项
  type Stage = 1 | 2 | 3 | 4 | 5
  function detectStage(history: ChatMessage[], content: string): Stage {
    const txt = content || ""
    const hasList = /(^\d+\.|^[-•]|^\[\s*\]|^[∨图@钟]|^\s*(?:\d{1,2}:\d{2}前|早上\d{1,2}点|晚饭后|下午\d点前))/m.test(txt)
    const mentionsToday = /今日|今天/.test(txt)
    const mentionsTomorrow = /明日|明天/.test(txt)
    if (/已添加|已加入待办|跳转|3秒后|3 秒后/.test(txt)) return 4
    if (hasList) return 3
    if (/(原因|为什么|卡住|困扰|不想做|没动力|焦虑|畏难)/.test(txt)) return 1
    // 简单根据上一条用户意向推断：若上条用户包含“行动/放下”
    const lastUser = [...history].reverse().find(m => m.role === 'user')?.content || ''
    if (/放下|先放/.test(lastUser)) return 2
    if (/行动|继续|拆解|开始|做/.test(lastUser)) return 2
    // 默认回落到诊断
    return 1
  }

  function getFallbackQuickReplies(stage: Stage, content: string): QuickReply[] {
    const hasToday = /今日|今天/.test(content)
    const hasTomorrow = /明日|明天/.test(content)
    if (stage === 1) {
      return [
        { text: "说说原因", action: "select_option" },
        { text: "我想先放下", action: "select_option" },
        { text: "我想行动", action: "select_option" },
      ]
    }
    if (stage === 3) {
      const base: QuickReply[] = [
        { text: "加到待办", action: "confirm_todo" },
        { text: "再调整", action: "select_option" },
      ]
      if (hasToday && hasTomorrow) {
        base.push({ text: "只加今日", action: "confirm_todo_today" })
      } else if (hasToday) {
        base.push({ text: "只加今日", action: "confirm_todo_today" })
      } else if (hasTomorrow) {
        base.push({ text: "只加明日", action: "confirm_todo_tomorrow" })
      }
      return base.slice(0, 3)
    }
    if (stage === 4) {
      return [
        { text: "继续聊聊", action: "select_option" },
      ]
    }
    // Stage 2 / 5 兜底
    return [
      { text: "继续拆解", action: "select_option" },
      { text: "我想先放下", action: "select_option" },
      { text: "换个小目标", action: "select_option" },
    ]
  }


  // 清理文本内容，移除选项标记
  const cleanContentFromOptions = useCallback((content: string): string => {
    // 移除所有【】标记
    return content.replace(/【[^】]+】/g, '').trim()
  }, [])

  // 解析AI回复中的选项标记，生成快捷回复（不足时按阶段兜底）
  const parseQuickReplies = useCallback((content: string): QuickReply[] => {
    const optionRegex = /【([^】]+)】/g
    const matches = content.match(optionRegex)

    let options: QuickReply[] = []
    if (matches && matches.length > 0) {
      options = matches.map(match => {
        const text = match.replace(/【|】/g, '')
        return { text, action: "select_option" }
      })
      // 去重并限制最多3个
      options = options.filter((option, index, self) => index === self.findIndex(o => o.text === option.text)).slice(0, 3)
    }

    // 若选项不足（<2），根据阶段兜底
    if (options.length < 2) {
      const stage = detectStage(messages, content)
      const fallback = getFallbackQuickReplies(stage, content)
      return fallback.slice(0, 3)
    }

    return options
  }, [messages])

  // 处理快捷回复
  const handleQuickReply = useCallback((action: string, text: string) => {
    if (action === "select_option") {
      // 处理选项选择
      void sendMessage(text)
    } else if (action === "confirm_todo" || action === "confirm_todo_today" || action === "confirm_todo_tomorrow") {
      // 添加用户消息
      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: text,
        timestamp: now(),
      }

      // 直接从AI的最近1条回复中提取todolist
      const lastAiMessage = [...messages].reverse().find((m) => m.role === "assistant")
      let todosToAdd: TodoWithDate[] = []

      if (lastAiMessage) {
        // 使用智能提取方法获取待办项
        if (action === "confirm_todo_today") {
          const res = extractSpecificTodos(lastAiMessage.content, "今日")
          if (res.type === 'specific') todosToAdd = res.items
        } else if (action === "confirm_todo_tomorrow") {
          const res = extractSpecificTodos(lastAiMessage.content, "明日")
          if (res.type === 'specific') todosToAdd = res.items
        }
        // 若仍为空则尝试全量提取
        if (todosToAdd.length === 0) {
          const specificResult = extractSpecificTodos(lastAiMessage.content, "全部添加")
          if (specificResult.type === 'specific' && specificResult.items.length > 0) {
            todosToAdd = specificResult.items
          } else {
            const actionSteps = extractActionSteps(lastAiMessage.content)
            todosToAdd = convertStringArrayToTodos(actionSteps)
          }
        }
      }

      if (todosToAdd.length > 0) {
        // 添加待办项到用户的todolist
        const added = addTodos(todosToAdd)
        setPendingTodos([]) // 清空pending状态

        // 添加确认消息
        const confirmMsg: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content: `✅ ${added} 条 todolist 已经添加，3秒后跳转到待办页面...`,
          timestamp: now(),
        }

        const newMessages = [...messages, userMsg, confirmMsg]
        setMessages(newMessages)
        persistMessages(newMessages)

        // 跳转到待办页面
        setTimeout(() => router.push("/todolist"), 3000)
      } else {
        // 没有找到可添加的任务
        const noTasksMsg: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content: "抱歉，我没有找到可以添加到待办的具体任务。请告诉我你想要添加哪些具体的行动项。",
          timestamp: now(),
        }

        const newMessages = [...messages, userMsg, noTasksMsg]
        setMessages(newMessages)
        persistMessages(newMessages)
      }
    } else if (action === "cancel_todo") {
      // 添加用户消息
      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: text,
        timestamp: now(),
      }

      // 清除待办项
      setPendingTodos([])

      // 添加取消消息
      const cancelMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: "好的，我们继续聊聊。如果需要调整任务拆解或有其他拖延困扰，随时告诉我！💪",
        timestamp: now(),
      }

      const newMessages = [...messages, userMsg, cancelMsg]
      setMessages(newMessages)
      persistMessages(newMessages)
    }
  }, [pendingTodos, messages, addTodos, setPendingTodos, persistMessages, router])

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

      // 清洗用户输入，防止 Prompt Injection
      const { clean: cleanContent } = sanitizeChatText(content)
      if (!cleanContent.trim()) return

      // 若没有会话，创建并命名
      let sid = currentSessionId
      if (!sid) {
        sid = startSession(options?.titleForNewSession || cleanContent.slice(0, 30))
      }

      setError(null)
      setIsLoading(true)

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: cleanContent.trim(),
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

        // 检查是否需要对话摘要
        let messagesToSend = nextMessages
        if (shouldSummarize(nextMessages)) {
          const summary = buildSummarySystem(nextMessages.slice(0, -10)) // 保留最近10条消息
          const recentMessages = nextMessages.slice(-10)
          messagesToSend = [
            { id: makeId(), role: "system" as const, content: summary.content, timestamp: now() },
            ...recentMessages
          ]
        }

        // 构建记忆前缀（基于用户输入检索相关记忆）
        const memoryPreface = Memory.buildPreface(content)

        const apiMessages = [
          ...(options?.hiddenSystem ? [{ role: "system", content: options.hiddenSystem }] : []),
          ...(memoryPreface ? [{ role: "system", content: memoryPreface }] : []),
          ...messagesToSend.map((m) => ({ role: m.role, content: m.content })),
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
        let rawContent = ""

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
                  // 累积原始内容
                  rawContent += parsed.content

                  // 流式过程中，展示给用户的内容始终为“去掉【】标签”的版本
                  assistantMsg.content = cleanContentFromOptions(rawContent)

                  working = [...nextMessages, { ...assistantMsg }]
                  setMessages(working)
                  persistMessages(working)
                }
              } catch {}
            }
          }
        }

        // 解析AI回复中的选项，自动生成快捷回复（在流式完成后）
        if (assistantMsg.content && todoIntent.type === 'none') {
          // 用原始内容提取选项
          const quickReplies = parseQuickReplies(rawContent || assistantMsg.content)
          assistantMsg.quickReplies = quickReplies

          // 正文已在流式过程中持续清理过，这里确保最终一次再清理
          assistantMsg.content = cleanContentFromOptions(rawContent || assistantMsg.content)

          working = [...nextMessages, { ...assistantMsg }]
          setMessages(working)
          persistMessages(working)
        }

        // 提取并保存记忆（从用户输入和AI回复中）
        try {
          // 从用户输入中提取拖延原因
          const reasons = extractReasonsFromText(content)
          if (reasons.length > 0) {
            Memory.addReasons(reasons)
          }

          // 从AI回复中提取行动步骤/承诺
          const commitSteps = extractCommitStepsFromAi(assistantMsg.content)
          if (commitSteps.length > 0) {
            Memory.addCommitment(commitSteps)
          }
        } catch (error) {
          console.warn('Failed to extract memory:', error)
        }

        // 处理待办相关意图
        if (todoIntent.type !== 'none' && lastAi) {
          if (todoIntent.type === 'confirm') {
            // 用户确认添加待办 - 直接从AI最近回复中提取
            let todosToAdd: TodoWithDate[] = []
            const specificResult = extractSpecificTodos(lastAi, "全部添加")
            if (specificResult.type === 'specific' && specificResult.items.length > 0) {
              todosToAdd = specificResult.items
            } else {
              const actionSteps = extractActionSteps(lastAi)
              todosToAdd = convertStringArrayToTodos(actionSteps)
            }

            if (todosToAdd.length > 0) {
              const added = addTodos(todosToAdd)
              setPendingTodos([])
              const confirm: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `✅ ${added} 条 todolist 已经添加，3秒后跳转到待办页面...`,
                timestamp: now(),
              }
              const finalList = [...working, confirm]
              setMessages(finalList)
              persistMessages(finalList)
              setTimeout(() => router.push("/todolist"), 3000)
            }
          } else if (todoIntent.type === 'specific' || todoIntent.type === 'add_all') {
            // 用户指定了特定类型的待办 - 直接添加
            const specificTodosResult = extractSpecificTodos(lastAi, content)
            if (specificTodosResult.type === 'specific' && specificTodosResult.items.length > 0) {
              const added = addTodos(specificTodosResult.items)
              const confirm: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `✅ ${added} 条 todolist 已经添加，3秒后跳转到待办页面...`,
                timestamp: now(),
              }
              const finalList = [...working, confirm]
              setMessages(finalList)
              persistMessages(finalList)
              setTimeout(() => router.push("/todolist"), 3000)
            } else {
              const noItems: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `抱歉，我在上次回复中没有找到明确的项目。你可以直接告诉我具体要添加哪些待办事项。`,
                timestamp: now(),
              }
              const finalList = [...working, noItems]
              setMessages(finalList)
              persistMessages(finalList)
            }
          } else if (todoIntent.type === 'action_steps') {
            // 一般的加到待办意图 - 直接添加
            let todosToAdd: TodoWithDate[] = []
            const specificResult = extractSpecificTodos(lastAi, "全部添加")
            if (specificResult.type === 'specific' && specificResult.items.length > 0) {
              todosToAdd = specificResult.items
            } else {
              const actionSteps = extractActionSteps(lastAi)
              todosToAdd = convertStringArrayToTodos(actionSteps)
            }

            if (todosToAdd.length > 0) {
              const added = addTodos(todosToAdd)
              const confirm: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: `✅ ${added} 条 todolist 已经添加，3秒后跳转到待办页面...`,
                timestamp: now(),
              }
              const finalList = [...working, confirm]
              setMessages(finalList)
              persistMessages(finalList)
              setTimeout(() => router.push("/todolist"), 3000)
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
    handleQuickReply,
    // sessions
    startSession,
    switchToSession,
    updateSessionTitle,
    listSessions,
    deleteSession,
    clearAllSessions,
  }
}
