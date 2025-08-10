"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import {
  Send,
  Square,
  RotateCcw,
  CheckSquare,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart3,
  User,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAiChat } from "@/hooks/use-ai-chat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PgJ7JkIGTS9mJybEQyaaysUC4KChJt.png"

const QUICK_QUESTIONS = [
  {
    id: 1,
    icon: BookOpen,
    iconBg: "bg-blue-500",
    title: "AI产品经理课程学习困难",
    description: "文科生学习编程工具遇到困难",
    content:
      "我现在正在参加一个AI产品经理课程，我是文科生，学习 Vibe Coding 产品，GitHub，Vercel，Cursor 啊啊每个地方都是坑...",
  },
  {
    id: 2,
    icon: GraduationCap,
    iconBg: "bg-green-500",
    title: "暑假作业拖延",
    description: "马上开学但作业还没完成",
    content: "马上开学了，暑假作业还没有做完...",
  },
  {
    id: 3,
    icon: FileText,
    iconBg: "bg-purple-500",
    title: "毕业论文初稿",
    description: "9月份要提交但完全没头绪",
    content: "导师让我在9月份提交我的毕业论文初稿，完全没头绪...",
  },
  {
    id: 4,
    icon: BarChart3,
    iconBg: "bg-orange-500",
    title: "实习调研任务",
    description: "不知道如何开始客户数据分析",
    content: "我在实习，领导让我做调研，收集客户数据做个分析，我完全不知道从哪里做起...",
  },
]

// 专家模式隐藏上下文（不会出现在 UI，随请求发送）
const EXPERT_SYSTEM = `
你是“vibe coding”专家与学习教练。请在分析用户问题并给出建议时：
- 根据用户情况适当推荐入门教程（Markdown 链接）：
  - [GitHub 入门教程](/tutorials/github)
  - [Vercel 入门教程](/tutorials/vercel)
  - [Cursor 入门教程](/tutorials/cursor)
  - [v0 入门教程](/tutorials/v0)
- 同时给出“最多 6 条”可执行的学习行动清单（分阶段，不要一次给太多），
  语气亲和、可落实。邀请用户说“帮我加到待办”来保存。`

export default function ChatPage() {
  const router = useRouter()

  const { messages, isLoading, error, sendMessage, stopGeneration, clearChat, currentSessionId } = useAiChat()

  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    await sendMessage(inputValue, { titleForNewSession: inputValue.slice(0, 20) })
    setInputValue("")
    inputRef.current?.focus()
  }

  // 快速选择：第 1 个问题带隐藏专家上下文
  const handleQuickSelect = async (q: (typeof QUICK_QUESTIONS)[number]) => {
    const opts =
      q.id === 1 ? { titleForNewSession: q.title, hiddenSystem: EXPERT_SYSTEM } : { titleForNewSession: q.title }
    await sendMessage(q.content, opts)
  }

  const getTodoCount = () => {
    try {
      const todos = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
      return todos.filter((t: any) => !t.completed).length
    } catch {
      return 0
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goHome = () => router.push("/") // 清除 sessionId 回到欢迎页

  return (
    <div className="min-h-screen bg-momentum-cream flex flex-col">
      {/* Header */}
      <div className="bg-momentum-white shadow-sm border-b border-momentum-sage-light-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* 返回首页按钮（在会话中显示） */}
            {currentSessionId && (
              <Button
                variant="outline"
                size="icon"
                onClick={goHome}
                className="bg-transparent text-momentum-sage hover:text-momentum-forest"
                aria-label="返回首页"
                title="返回首页"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image src={LOGO_URL || "/placeholder.svg"} alt="Momentum Logo" width={40} height={40} priority />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-momentum-forest">小M助手</h1>
              <p className="text-sm text-momentum-muted">要么行动，要么放下</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 打断 AI 回复（头部快捷） */}
            {isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopGeneration}
                className="bg-transparent text-momentum-sage hover:text-momentum-forest"
              >
                <Square className="w-4 h-4 mr-1" />
                打断
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/history")}
              className="bg-transparent text-momentum-sage hover:text-momentum-forest"
            >
              聊天历史
            </Button>
            {getTodoCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/todolist")}
                className="bg-transparent text-momentum-sage hover:text-momentum-forest"
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                待办 ({getTodoCount()})
              </Button>
            )}
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="bg-transparent text-momentum-muted hover:text-momentum-forest"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                清空对话
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="space-y-8">
                {/* Welcome */}
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden">
                    <Image src={LOGO_URL || "/placeholder.svg"} alt="Momentum Logo" width={80} height={80} />
                  </div>
                  <h2 className="text-2xl font-semibold text-momentum-forest mb-2">你好！我是小M</h2>
                  <p className="text-momentum-muted max-w-md mx-auto leading-relaxed">
                    我专门帮助你克服拖延。告诉我你遇到的困难，我会帮你分析原因并制定行动计划。
                  </p>
                </div>

                {/* 快速选择 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-momentum-forest text-center">常见拖延问题，点击快速开始：</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUICK_QUESTIONS.map((q) => {
                      const Icon = q.icon
                      return (
                        <div key={q.id} className="quick-select-card" onClick={() => handleQuickSelect(q)}>
                          <div className="flex items-start space-x-3">
                            <div className={`quick-select-icon ${q.iconBg}`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-momentum-forest mb-1 text-sm">{q.title}</h4>
                              <p className="text-momentum-muted text-xs leading-relaxed">{q.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
                >
                  {/* 左侧小M头像 或 右侧用户头像 */}
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-momentum-sage-light-20">
                      <Image src={LOGO_URL || "/placeholder.svg"} alt="小M头像" width={28} height={28} />
                    </div>
                  )}

                  {/* 气泡 */}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      m.role === "user"
                        ? "bg-momentum-sage text-momentum-white"
                        : "bg-momentum-white text-momentum-forest border border-momentum-sage-light-20"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, href, children, ...props }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={m.role === "user" ? "underline text-white" : "underline text-momentum-sage"}
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="px-1 py-0.5 rounded bg-black/5">{children}</code>
                            ) : (
                              <pre className="p-3 rounded bg-black/5 overflow-x-auto text-xs">
                                <code>{children}</code>
                              </pre>
                            ),
                          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    <div
                      className={`text-[11px] mt-1 ${m.role === "user" ? "text-momentum-white/70" : "text-momentum-muted"}`}
                    >
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* 用户右侧头像 */}
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-momentum-sage text-white border border-momentum-sage">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-momentum-white border border-momentum-sage-light-20 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-momentum-muted text-sm">小M正在思考...</span>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={stopGeneration}
                      className="h-7 px-2 bg-transparent text-momentum-sage hover:text-momentum-forest"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      打断
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">{error}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区 */}
        <div className="bg-momentum-white border-t border-momentum-sage-light-20 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="描述你遇到的拖延问题..."
                  disabled={isLoading}
                  className="resize-none border-momentum-sage-light-20 focus:border-momentum-sage focus:ring-momentum-sage/20"
                />
              </div>
              {isLoading ? (
                <Button onClick={stopGeneration} variant="outline" size="icon" className="shrink-0 bg-transparent">
                  <Square className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="shrink-0 momentum-button-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="mt-2 text-[11px] text-momentum-muted text-center">
              提示：当小M给出行动步骤后，说“帮我加到待办”即可保存至清单
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
