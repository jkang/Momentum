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
  const searchParams = useSearchParams()

  const { messages, isLoading, error, sendMessage, stopGeneration, listSessions } = useAiChat()
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // 首次打开 /chat 时的行为控制：
  // 1) 若来自首页携带 autostart=1&text=...，则立即以该内容开聊（不显示开场白）
  // 2) 若无 sessionId 且存在历史会话，则跳到最近一次会话 /chat?sessionId=...
  // 3) 若无任何历史与 autostart，显示开场白气泡
  useEffect(() => {
    const sp = new URLSearchParams(searchParams?.toString() || "")
    const sid = sp.get("sessionId")
    const auto = sp.get("autostart")
    const text = sp.get("text")
    const title = sp.get("title") || (text ? text.slice(0, 20) : "")
    const expert = sp.get("expert") === "1"

    // 仅在无现有 sessionId 时处理自动开聊或跳到最近一次会话
    if (!sid) {
      if (!startedRef.current && auto === "1" && text) {
        startedRef.current = true
        // 发送消息并在完成后更新URL
        void sendMessage(text, {
          titleForNewSession: title,
          hiddenSystem: expert ? EXPERT_SYSTEM : undefined,
          skipUrlUpdate: true
        }).then((sessionId) => {
          // 消息发送完成后，更新URL到新的sessionId
          if (sessionId) {
            router.replace(`/chat?sessionId=${encodeURIComponent(sessionId)}`)
          }
        })
        return
      }
      const sessions = listSessions()
      if (sessions.length > 0) {
        router.replace(`/chat?sessionId=${encodeURIComponent(sessions[0].id)}`)
      }
    }
  }, [searchParams, sendMessage, listSessions, router])

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
