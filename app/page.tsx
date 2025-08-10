"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import AppHeader from "@/components/app-header"
import BottomNavigation from "@/components/bottom-navigation"
import { PullToRefresh } from "@/components/mobile-enhancements"
import { BookOpen, GraduationCap, FileText, BarChart3, MessagesSquare, ListTodo, AlertTriangle, Trophy } from "lucide-react"
import { getCompletionStats } from "@/lib/celebration"
import LaunchScreen from "@/components/launch-screen"

type StoredTodo = {
  id: string
  title: string
  completed: boolean
  // 新增/可选字段（向后兼容）
  deadlineDate?: string // 'YYYY-MM-DD'
  note?: string
  createdAt?: string
  updatedAt?: string
}

const QUICK_QUESTIONS = [
  {
    id: 1,
    icon: BookOpen,
    iconBg: "bg-momentum-sage",
    title: "AI产品经理课程学习困难",
    description: "文科生学习编程工具遇到困难",
    text: "我现在正在参加一个AI产品经理课程，我是文科生，学习 Vibe Coding 产品，GitHub，Vercel，Cursor 啊啊每个地方都是坑...",
    expert: 1,
  },
  {
    id: 2,
    icon: GraduationCap,
    iconBg: "bg-momentum-coral",
    title: "暑假作业拖延",
    description: "马上开学但作业还没完成",
    text: "马上开学了，暑假作业还没有做完...",
    expert: undefined,
  },
  {
    id: 3,
    icon: FileText,
    iconBg: "bg-momentum-forest",
    title: "毕业论文初稿",
    description: "9月份要提交但完全没头绪",
    text: "导师让我在9月份提交我的毕业论文初稿，完全没头绪...",
    expert: undefined,
  },
  {
    id: 4,
    icon: BarChart3,
    iconBg: "bg-momentum-sage-dark",
    title: "实习调研任务",
    description: "不知道如何开始客户数据分析",
    text: "我在实习，领导让我做调研，收集客户数据做个分析，我完全不知道从哪里做起...",
    expert: undefined,
  },
] as const

function parseDateToEndOfDay(dateStr: string): Date {
  // 将 YYYY-MM-DD 解析为当天 23:59:59
  return new Date(`${dateStr}T23:59:59`)
}
function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, "0")
  const d = `${date.getDate()}`.padStart(2, "0")
  return `${y}-${m}-${d}`
}

export default function HomePage() {
  const [todos, setTodos] = useState<StoredTodo[]>([])
  const [completionStats, setCompletionStats] = useState({ totalCompleted: 0, completedToday: 0, lastCompletionDate: "", streak: 0 })
  const [showLaunchScreen, setShowLaunchScreen] = useState(false)

  const loadTodos = () => {
    try {
      const raw = localStorage.getItem("momentum-todos")
      const arr: StoredTodo[] = raw ? JSON.parse(raw) : []
      setTodos(arr)
    } catch {
      setTodos([])
    }
  }

  // 检查是否首次访问
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem("momentum-has-visited")
      if (!hasVisited) {
        setShowLaunchScreen(true)
      }
    } catch {
      // localStorage不可用时，不显示启动页
    }
  }, [])

  // 读取本地待办和完成统计
  useEffect(() => {
    loadTodos()
    setCompletionStats(getCompletionStats())

    const onStorage = (e: StorageEvent) => {
      // 接收待办页的自定义通知
      if (e.key === "momentum-todos") {
        try {
          const raw = localStorage.getItem("momentum-todos")
          const arr: StoredTodo[] = raw ? JSON.parse(raw) : []
          setTodos(arr)
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener("storage", onStorage as any)
    return () => window.removeEventListener("storage", onStorage as any)
  }, [])

  const handleRefresh = async () => {
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    loadTodos()
    setCompletionStats(getCompletionStats())
    // 触发自定义事件通知其他组件更新
    window.dispatchEvent(new CustomEvent("todos:updated"))
  }

  const handleLaunchScreenStart = () => {
    // 标记用户已访问过
    localStorage.setItem("momentum-has-visited", "true")
    setShowLaunchScreen(false)
  }

  const urgent = useMemo(() => {
    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const result: Array<{ id: string; title: string; status: "overdue" | "soon"; deadlineDate: string }> = []

    todos.forEach((t) => {
      if (t.completed) return
      if (!t.deadlineDate) return
      const dueEnd = parseDateToEndOfDay(t.deadlineDate)
      if (dueEnd.getTime() < now.getTime()) {
        result.push({ id: t.id, title: t.title, status: "overdue", deadlineDate: t.deadlineDate })
        return
      }
      if (dueEnd.getTime() <= in24h.getTime()) {
        result.push({ id: t.id, title: t.title, status: "soon", deadlineDate: t.deadlineDate })
      }
    })
    // 仅展示最多 3 条
    return result.slice(0, 3)
  }, [todos])

  // 如果是首次访问，显示启动页
  if (showLaunchScreen) {
    return <LaunchScreen onStart={handleLaunchScreenStart} />
  }

  return (
    <div className="min-h-screen bg-momentum-cream pb-16">
      <AppHeader />

      <PullToRefresh onRefresh={handleRefresh}>
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 mobile-nav-spacing">
        {/* 提醒条 */}
        {urgent.length > 0 && (
          <section
            aria-live="polite"
            className="bg-white border border-momentum-coral/30 rounded-lg p-3 shadow-momentum-card"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertTriangle className="w-5 h-5 text-momentum-coral" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-momentum-forest font-medium">
                  有待办已超期或将在 24 小时内到期，请尽快处理：
                </p>
                <ul className="mt-2 space-y-1">
                  {urgent.map((u) => (
                    <li key={u.id} className="text-sm text-momentum-forest flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] ${
                          u.status === "overdue"
                            ? "bg-momentum-coral/10 text-momentum-coral"
                            : "bg-momentum-sage/10 text-momentum-sage"
                        }`}
                      >
                        {u.status === "overdue" ? "已超期" : "即将到期"}
                      </span>
                      <span className="truncate">{u.title}</span>
                      <span className="text-momentum-muted text-xs">（截止：{u.deadlineDate}）</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Link
                    href="/todolist"
                    className="text-xs text-momentum-forest underline underline-offset-4 hover:opacity-80"
                  >
                    去待办列表查看
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 欢迎区 */}
        <section className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden border border-momentum-sage-light-20 bg-white">
            <img src="/images/logo-momentum.png" alt="Momentum Logo" width={80} height={80} />
          </div>
          <h2 className="text-2xl font-semibold text-momentum-forest mb-2">你好！我是小M</h2>
          <p className="text-momentum-muted max-w-md mx-auto leading-relaxed text-sm">
            我来专门陪你告别拖延～
          </p>
           <p className="text-momentum-muted max-w-md mx-auto leading-relaxed text-sm">
            说说你遇到的困难，我会帮你分析原因并陪你行动。
          </p>

          {/* 完成统计 */}
          {completionStats.totalCompleted > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-momentum-sage/10 to-momentum-coral/10 rounded-lg border border-momentum-sage/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-momentum-coral" />
                <span className="text-lg font-semibold text-momentum-forest">
                  已完成 {completionStats.totalCompleted} 个任务
                </span>
              </div>
              <div className="flex justify-center gap-4 text-sm text-momentum-muted">
                <span>今日完成: {completionStats.completedToday}</span>
                {completionStats.streak > 1 && (
                  <span>连续 {completionStats.streak} 天</span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 常见拖延问题（品牌配色） */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-momentum-forest text-center">你遇到了什么拖延问题呢？</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {QUICK_QUESTIONS.map((q) => {
              const Icon = q.icon
              const qs = new URLSearchParams({
                autostart: "1",
                text: q.text,
                title: q.title,
                ...(q.expert ? { expert: "1" } : {}),
              }).toString()
              return (
                <Link key={q.id} href={`/chat?${qs}`} className="quick-select-card">
                  <div className="flex items-start space-x-3">
                    <div className={`quick-select-icon ${q.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-momentum-forest mb-1 text-sm">{q.title}</h4>
                      <p className="text-momentum-muted text-xs leading-relaxed">{q.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* 新增：我想聊聊别的拖延问题 */}
            <Link href="/chat" className="quick-select-card">
              <div className="flex items-start space-x-3">
                <div className="quick-select-icon bg-momentum-sage/80">
                  <MessagesSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-momentum-forest mb-1 text-sm">我想聊聊别的拖延问题</h4>
                  <p className="text-momentum-muted text-xs leading-relaxed">
                    不在上面？也可以直接告诉我你正在拖延的事。
                  </p>
                </div>
              </div>
            </Link>

            {/* 新增：看看我的待办 */}
            <Link href="/todolist" className="quick-select-card">
              <div className="flex items-start space-x-3">
                <div className="quick-select-icon bg-momentum-forest/80">
                  <ListTodo className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-momentum-forest mb-1 text-sm">看看我的待办</h4>
                  <p className="text-momentum-muted text-xs leading-relaxed">
                    查看和管理你的行动清单，配合小M一起推进。
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* 便捷入口：若无截止日期也可快速设定今天/明天（可选改进）
              这里保留占位，不做按钮，用户可在待办页设置或 AI 自动生成 */}
        </section>
      </main>
      </PullToRefresh>

      <BottomNavigation />
    </div>
  )
}
