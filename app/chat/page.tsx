"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Mic, Paperclip } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "text" | "suggestion" | "encouragement"
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userName, setUserName] = useState("思慧")

  useEffect(() => {
    // 获取用户名
    const userProfile = localStorage.getItem("userProfile")
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile)
        if (profile.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error("解析用户档案失败:", error)
      }
    }

    // 初始化对话
    const initialMessages: Message[] = [
      {
        id: "1",
        content: `你好${userName}！我是小M，你的专属成长伙伴。有什么想聊的吗？或者遇到什么困难需要我帮忙的？`,
        sender: "assistant",
        timestamp: new Date(),
        type: "text",
      },
    ]
    setMessages(initialMessages)
  }, [userName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // 模拟小M的回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAssistantResponse(inputValue),
        sender: "assistant",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("论文") || input.includes("毕业")) {
      return `我理解写论文的压力，${userName}。让我们把这个大任务拆解一下：\n\n1. 先花15分钟整理一下现有的资料\n2. 列出这一章需要包含的3-5个要点\n3. 选择最容易写的一个要点开始\n\n记住，完美不是目标，完成才是。你觉得从哪一步开始比较好？`
    }

    if (input.includes("拖延") || input.includes("不想做")) {
      return `拖延是很正常的，${userName}。每个人都会有这样的时候。\n\n让我们试试"2分钟法则"：如果一件事只需要2分钟就能完成，那就立刻去做。如果需要更长时间，就把它拆解成2分钟能完成的小步骤。\n\n你现在最想完成但一直在拖延的是什么事情？`
    }

    if (input.includes("累") || input.includes("疲惫") || input.includes("压力")) {
      return `听起来你需要好好休息一下，${userName}。压力太大的时候，强迫自己继续往往效果不好。\n\n不如先做点让自己放松的事情：\n• 深呼吸5分钟\n• 听一首喜欢的歌\n• 喝杯温水\n• 到窗边看看外面\n\n照顾好自己，才能更好地面对挑战。你想先休息一下吗？`
    }

    if (input.includes("谢谢") || input.includes("感谢")) {
      return `不用客气，${userName}！能陪伴你成长是我的荣幸。记住，每一个小小的进步都值得庆祝。你已经很棒了！\n\n有什么其他需要帮助的吗？`
    }

    // 默认回复
    const responses = [
      `我听到了，${userName}。能详细说说吗？我想更好地理解你的情况。`,
      `这听起来很重要。让我们一起想想解决的办法吧。`,
      `我理解你的感受，${userName}。每个人都会遇到这样的时候，你并不孤单。`,
      `很好的想法！让我们把它拆解成具体的行动步骤吧。`,
      `我相信你能做到的，${userName}。让我们从最小的一步开始。`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickReplies = ["我想聊聊论文的事", "感觉有点累了", "不知道从哪里开始", "需要一些鼓励"]

  return (
    <div className="h-screen flex flex-col bg-warm-off-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm p-4 border-b border-light-gray sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-sage-green flex items-center justify-center mr-3">
              <span className="text-white text-sm">🌱</span>
            </div>
            <div>
              <h1 className="font-bold text-soft-gray">小M</h1>
              <p className="text-xs text-soft-gray/60">你的成长伙伴</p>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === "user" ? "bg-sage-green text-white" : "bg-white text-soft-gray shadow-soft"
                }`}
              >
                {message.sender === "assistant" && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-sage-light flex items-center justify-center mr-2">
                      <span className="text-sage-green text-xs">🌱</span>
                    </div>
                    <span className="text-xs text-soft-gray/60">小M</span>
                  </div>
                )}
                <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.sender === "user" ? "text-white/70" : "text-soft-gray/50"}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl shadow-soft">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-sage-light flex items-center justify-center mr-2">
                    <span className="text-sage-green text-xs">🌱</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-soft-gray/40 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-soft-gray/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-soft-gray/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        {messages.length <= 1 && (
          <div className="mt-6">
            <p className="text-sm text-soft-gray/60 mb-3 px-2">你可以试试这些话题：</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(reply)}
                  className="px-4 py-2 bg-white rounded-full text-sm text-soft-gray border border-light-gray hover:border-sage-green/50 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-light-gray p-4">
        <div className="flex items-end space-x-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              className="w-full p-3 pr-12 border border-light-gray rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-green/50 max-h-32"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-sage-green flex items-center justify-center text-white hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  )
}
