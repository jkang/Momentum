"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Send, Square, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"
import AppHeader from "@/components/app-header"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useRouter, useSearchParams } from "next/navigation"

const LOGO_URL = "/images/logo-momentum.png"

// 专家模式隐藏上下文（不会出现在 UI，随请求发送）
const EXPERT_SYSTEM = `
你是“vibe coding”专家与学习教练。请严格按“低压、分阶段”的节奏推进：
- 第1轮（诊断/澄清）：先帮助用户说清楚“为什么会拖延/卡在哪”，禁止直接给步骤。结尾选项≤3，用【】包裹：例如【说说原因】【我想先放下】【我想行动】。
- 决策（行动/放下）：根据用户意向给出方向性建议，不急于拆解。结尾选项≤3。
- 拆解（仅在确认行动后）：给出3-5个具体步骤；如能区分“今日/明日”，分段标注。结尾只给与添加相关的选项（≤3）：【加到待办】【再调整】；如含“今日/明日”，补充【只加今日】或【只加明日】其一。
- 全程选项≤3，且用【】包裹；语气简洁温暖（50-150字）。如需可适当推荐入门教程（Markdown 链接），但不要在首轮给步骤。
`

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { messages, isLoading, error, sendMessage, stopGeneration, handleQuickReply } = useAiChat()
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // 一次性清理：限制现有会话数量和消息数量
  useEffect(() => {
    const hasCleanedUp = localStorage.getItem("momentum-storage-cleaned-v2")
    if (!hasCleanedUp) {
      try {
        const sessionsRaw = localStorage.getItem("momentum-sessions-v1")
        if (sessionsRaw) {
          const sessions = JSON.parse(sessionsRaw)
          // 按更新时间排序，只保留最近3次对话
          const recentSessions = sessions
            .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
            .slice(0, 3)
            .map((session: any) => ({
              ...session,
              messages: session.messages?.slice(-25) || [] // 每个会话只保留最新25条消息
            }))
          localStorage.setItem("momentum-sessions-v1", JSON.stringify(recentSessions))
        }
        localStorage.setItem("momentum-storage-cleaned-v2", "true")
        console.log("✅ 已清理localStorage，只保留最近3次对话，每次对话最多25条消息")
      } catch (error) {
        console.log("清理历史数据时出错:", error)
      }
    }
  }, [])

  // 首次打开 /chat 时的行为控制：
  // 1) 若来自首页携带 autostart=1&text=...，则立即以该内容开聊（不显示开场白）
  // 2) 清理URL参数，保持URL简洁
  useEffect(() => {
    const sp = new URLSearchParams(searchParams?.toString() || "")
    const auto = sp.get("autostart")
    const text = sp.get("text")
    const title = sp.get("title") || (text ? text.slice(0, 20) : "")
    const expert = sp.get("expert") === "1"

    // 处理autostart
    if (!startedRef.current && auto === "1" && text) {
      startedRef.current = true
      // 立即清理URL参数
      router.replace("/chat", { scroll: false })
      // 发送消息
      void sendMessage(text, {
        titleForNewSession: title,
        hiddenSystem: expert ? EXPERT_SYSTEM : undefined,
      })
      return
    }

    // 如果URL有参数但不是autostart，清理URL
    if (sp.toString()) {
      router.replace("/chat", { scroll: false })
    }
  }, [searchParams, sendMessage, router])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return
    await sendMessage(inputValue, { titleForNewSession: inputValue.slice(0, 20) })
    setInputValue("")
    inputRef.current?.focus()
  }



  return (
    <div className="min-h-screen bg-momentum-cream pb-16 flex flex-col">
      <AppHeader />

      {/* 仅对话内容：无欢迎区/快捷卡片，避免与首页重复 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 mobile-spacing">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 无历史且非加载中：显示一条开场白 */}
            {messages.length === 0 && !isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 mr-2 rounded-full overflow-hidden border border-momentum-sage-light-20">
                  <Image src={LOGO_URL || "/placeholder.svg"} alt="小M头像" width={28} height={28} />
                </div>
                <div className="max-w-[80%] rounded-lg px-4 py-3 bg-momentum-white text-momentum-forest border border-momentum-sage-light-20">
                  <div className="text-sm leading-relaxed">你好！我是即刻行动小M，专门帮你克服拖延。最近有遇到什么拖延的烦恼吗？</div>
                  <div className="text-[11px] mt-1 text-momentum-muted">现在就跟我说说吧～</div>
                </div>
              </div>
            )}

            {/* 历史与实时消息 */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-momentum-sage-light-20">
                    <Image src={LOGO_URL || "/placeholder.svg"} alt="小M头像" width={28} height={28} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    m.role === "user"
                      ? "bg-momentum-sage text-momentum-white"
                      : "bg-momentum-white text-momentum-forest border border-momentum-sage-light-20"
                  }`}
                >
                  <div
                    className={m.role === "user" ? "text-sm leading-relaxed text-white" : "prose prose-xs max-w-none text-sm"}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => (
                          <a
                            href={href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={m.role === "user" ? "underline text-white" : "underline text-momentum-sage"}
                            {...props}
                          >
                            {children}
                          </a>
                        ),
                        code: ({ inline, children }: any) =>
                          inline ? (
                            <code
                              className={
                                m.role === "user"
                                  ? "px-1 py-0.5 rounded bg-white/10 text-white"
                                  : "px-1 py-0.5 rounded bg-black/5"
                              }
                            >
                              {children}
                            </code>
                          ) : (
                            <pre
                              className={
                                m.role === "user"
                                  ? "p-3 rounded bg-white/10 overflow-x-auto text-xs text-white"
                                  : "p-3 rounded bg-black/5 overflow-x-auto text-xs"
                              }
                            >
                              <code>{children}</code>
                            </pre>
                          ),
                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
                        p: ({ children }) => <p className="m-0">{children}</p>,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>

                  {/* 快捷回复按钮 */}
                  {m.role === "assistant" && m.quickReplies && m.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {m.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply.action, reply.text)}
                          className="text-[10px] px-1 py-0.5 h-1.5 border-momentum-sage text-momentum-sage hover:bg-momentum-sage hover:text-white rounded-md flex-shrink-0"
                        >
                          {reply.text}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[11px] mt-1 ${
                      m.role === "user" ? "text-momentum-white/70" : "text-momentum-muted"
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-momentum-sage text-white border border-momentum-sage">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-momentum-white border border-momentum-sage-light-20 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-momentum-sage rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-momentum-muted text-sm">小M正在思考...</span>
                    <Button
                      variant="outline"
                      size="sm"
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
        <div className="bg-momentum-white border-t border-momentum-sage-light-20 px-4 py-4 safe-bottom mobile-spacing">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="描述你遇到的拖延问题..."
                  disabled={isLoading}
                  className="resize-none border-momentum-sage-light-20 focus:border-momentum-sage focus:ring-momentum-sage/20 min-h-[44px] text-sm"
                />
              </div>
              <Button
                onClick={isLoading ? stopGeneration : handleSend}
                disabled={!isLoading && !inputValue.trim()}
                size="icon"
                className="shrink-0 bg-momentum-coral hover:bg-momentum-coral-dark text-white disabled:bg-momentum-coral/50 disabled:text-white/70"
              >
                {isLoading ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
