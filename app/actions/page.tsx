"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, CheckCircle, Play, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface ActionItem {
  id: string
  title: string
  description: string
  estimatedTime: string
  completed: boolean
  challengeId: string
  challengeTitle: string
  priority: "high" | "medium" | "low"
  dueDate?: Date
}

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([])
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

    // 模拟从挑战任务生成的行动项目
    const mockActions: ActionItem[] = [
      {
        id: "1",
        title: "整理论文资料和笔记",
        description: "收集所有相关资料，整理成文件夹，为写作做准备",
        estimatedTime: "15分钟",
        completed: false,
        challengeId: "thesis-chapter",
        challengeTitle: "完成毕业论文最后一章",
        priority: "high",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
      },
      {
        id: "2",
        title: "列出章节大纲要点",
        description: "写下这一章需要包含的3-5个主要要点",
        estimatedTime: "10分钟",
        completed: false,
        challengeId: "thesis-chapter",
        challengeTitle: "完成毕业论文最后一章",
        priority: "high",
      },
      {
        id: "3",
        title: "设置早起闹钟",
        description: "将闹钟设置为7:00，准备明天开始新的晨间例行公事",
        estimatedTime: "2分钟",
        completed: true,
        challengeId: "morning-routine",
        challengeTitle: "建立晨间例行公事",
        priority: "medium",
      },
      {
        id: "4",
        title: "准备晨间活动清单",
        description: "列出30分钟晨间活动的具体内容（如冥想、运动、阅读等）",
        estimatedTime: "5分钟",
        completed: false,
        challengeId: "morning-routine",
        challengeTitle: "建立晨间例行公事",
        priority: "medium",
      },
      {
        id: "5",
        title: "清理书桌表面",
        description: "移除书桌上不必要的物品，只保留必需品",
        estimatedTime: "10分钟",
        completed: false,
        challengeId: "room-organization",
        challengeTitle: "整理和装饰房间",
        priority: "low",
      },
    ]

    setActions(mockActions)
  }, [])

  const handleToggleComplete = (actionId: string) => {
    setActions((prev) =>
      prev.map((action) => (action.id === actionId ? { ...action, completed: !action.completed } : action)),
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-sunrise-coral bg-sunrise-coral/10"
      case "medium":
        return "text-gentle-blue bg-gentle-blue/10"
      case "low":
        return "text-sage-green bg-sage-light"
      default:
        return "text-soft-gray bg-light-gray"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "重要"
      case "medium":
        return "一般"
      case "low":
        return "较低"
      default:
        return "未知"
    }
  }

  const formatDueDate = (date?: Date) => {
    if (!date) return null
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "今天"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "明天"
    } else {
      return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
    }
  }

  const pendingActions = actions.filter((action) => !action.completed)
  const completedActions = actions.filter((action) => action.completed)

  return (
    <div className="h-screen flex flex-col bg-warm-off-white">
      {/* Header */}
      <header className="bg-warm-off-white/80 backdrop-blur-sm p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-soft-gray">行动清单</h1>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Welcome Message */}
        <section className="mb-6">
          <div className="bg-sage-light/70 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-lg">🌱</div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray mb-1">早上好，{userName}！</p>
                <p className="text-soft-gray/80 text-sm leading-relaxed">
                  今天有 {pendingActions.length} 个行动等待完成。记住，每完成一个小步骤，都是向目标迈进的重要一步。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pending Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-soft-gray mb-4">待完成 ({pendingActions.length})</h2>
          <div className="space-y-3">
            {pendingActions.map((action) => (
              <div key={action.id} className="bg-white rounded-2xl p-5 shadow-soft">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-soft-gray mb-1">{action.title}</h3>
                    <p className="text-soft-gray/70 text-sm leading-relaxed mb-2">{action.description}</p>
                    <p className="text-xs text-soft-gray/60 mb-3">来自：{action.challengeTitle}</p>
                  </div>
                  <button
                    onClick={() => handleToggleComplete(action.id)}
                    className="w-6 h-6 rounded-full border-2 border-light-gray hover:border-sage-green transition-colors flex-shrink-0 ml-3"
                  ></button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {getPriorityText(action.priority)}
                    </span>
                    <div className="flex items-center text-soft-gray/60 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {action.estimatedTime}
                    </div>
                    {action.dueDate && (
                      <div className="text-xs text-sunrise-coral">{formatDueDate(action.dueDate)}</div>
                    )}
                  </div>
                  <button className="bg-sage-green text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sage-green/90 transition-colors flex items-center">
                    <Play className="w-3 h-3 mr-1" />
                    开始
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pendingActions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-sage-green" />
              </div>
              <p className="text-soft-gray/70 mb-2">太棒了！所有行动都已完成</p>
              <p className="text-soft-gray/60 text-sm">你可以创建新的挑战或休息一下</p>
            </div>
          )}
        </section>

        {/* Completed Actions */}
        {completedActions.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-soft-gray mb-4">已完成 ({completedActions.length})</h2>
            <div className="space-y-3">
              {completedActions.map((action) => (
                <div key={action.id} className="bg-white/60 rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-soft-gray/70 line-through mb-1">{action.title}</h3>
                      <p className="text-soft-gray/50 text-sm leading-relaxed mb-2">{action.description}</p>
                      <p className="text-xs text-soft-gray/40">来自：{action.challengeTitle}</p>
                    </div>
                    <button
                      onClick={() => handleToggleComplete(action.id)}
                      className="w-6 h-6 rounded-full bg-sage-green flex items-center justify-center flex-shrink-0 ml-3"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        {/* Chat FAB */}
        <div className="absolute bottom-20 right-4 z-10">
          <Link
            href="/chat"
            className="w-16 h-16 rounded-full bg-sage-green flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform hover:bg-sage-green/90"
          >
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </Link>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-t border-light-gray px-6 pt-2 pb-4 rounded-t-2xl">
          <div className="flex justify-around items-center">
            <Link href="/" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs mt-1">主页</span>
            </Link>
            <Link href="/actions" className="flex flex-col items-center text-sage-green w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1 font-semibold">行动</span>
            </Link>
            <Link href="/insights" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1">洞察</span>
            </Link>
            <Link href="/growth" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="text-xs mt-1">成长</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
