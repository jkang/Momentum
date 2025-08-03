"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Lightbulb } from "lucide-react"

export function ProactiveCare() {
  const [careMessage, setCareMessage] = useState<{
    type: "encouragement" | "reminder" | "insight"
    message: string
    action?: string
  } | null>(null)

  useEffect(() => {
    // 模拟小M的主动关怀逻辑
    const checkUserStatus = () => {
      const lastActiveDate = localStorage.getItem("lastActiveDate")
      const currentStreak = Number.parseInt(localStorage.getItem("currentStreak") || "0")
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")

      const today = new Date().toDateString()
      const isFirstVisitToday = lastActiveDate !== today

      if (isFirstVisitToday && currentStreak > 0) {
        setCareMessage({
          type: "encouragement",
          message: `太棒了！你已经连续行动了${currentStreak}天。今天也要保持这个好习惯哦！`,
          action: "查看今日任务",
        })
      } else if (completedTasks.length === 0) {
        setCareMessage({
          type: "insight",
          message: "我注意到你还没有开始第一个挑战。不用担心，每个人都有自己的节奏。要不要从一个简单的任务开始？",
          action: "创建第一个挑战",
        })
      } else if (Math.random() > 0.7) {
        setCareMessage({
          type: "reminder",
          message: "记住，进步不在于速度，而在于坚持。每一小步都值得庆祝！",
        })
      }
    }

    checkUserStatus()
  }, [])

  if (!careMessage) return null

  const getIcon = () => {
    switch (careMessage.type) {
      case "encouragement":
        return <Heart className="w-5 h-5 text-coral-500" />
      case "reminder":
        return <MessageCircle className="w-5 h-5 text-sage-500" />
      case "insight":
        return <Lightbulb className="w-5 h-5 text-yellow-500" />
    }
  }

  const getBgColor = () => {
    switch (careMessage.type) {
      case "encouragement":
        return "bg-coral-100/70"
      case "reminder":
        return "bg-sage-100/70"
      case "insight":
        return "bg-yellow-100/70"
    }
  }

  return (
    <div className={`${getBgColor()} rounded-2xl p-4 mb-6 animate-slide-up`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-gray-700 leading-relaxed">{careMessage.message}</p>
          {careMessage.action && (
            <button className="mt-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
              {careMessage.action} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
