"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [userName, setUserName] = useState("思慧")

  useEffect(() => {
    // 检查用户的完整引导流程状态
    const userProfile = localStorage.getItem("userProfile")
    const challengeTasks = localStorage.getItem("challengeTasks")
    const onboardingCompleted = localStorage.getItem("onboardingCompleted")

    // 如果没有用户档案，跳转到新用户欢迎页面
    if (!userProfile) {
      router.push("/welcome-newuser")
      return
    }

    // 如果有用户档案但没有完成挑战任务设置，跳转到挑战任务页面
    if (!challengeTasks || !onboardingCompleted) {
      router.push("/challenge-tasks")
      return
    }

    // 如果有完整的用户档案，解析用户名
    try {
      const profile = JSON.parse(userProfile)
      if (profile.name) {
        setUserName(profile.name)
      }
    } catch (error) {
      console.error("解析用户档案失败:", error)
    }

    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-warm-off-white flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-sunrise-coral/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-sage-light/40 rounded-full blur-3xl"></div>
        <div className="relative text-center px-8">
          <div className="animate-bounce">
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-sage-green to-sage-green/80 rounded-full flex items-center justify-center">
              <div className="text-8xl">🌱</div>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h1 className="text-4xl font-extrabold text-soft-gray">即刻行动</h1>
            <p className="mt-4 text-lg text-soft-gray/70">从今天起，和拖延温柔告别</p>
          </div>
        </div>
        <div className="absolute bottom-10 text-xs text-soft-gray/50">你的朋友 小M</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-warm-off-white">
      {/* Header */}
      <header className="bg-warm-off-white/80 backdrop-blur-sm p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <span className="text-sage-green font-bold text-lg">{userName.charAt(0)}</span>
            </div>
            <h1 className="ml-3 text-xl font-bold text-soft-gray">你好, {userName}</h1>
          </div>
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 text-center">
        {/* Companion Welcome Section */}
        <section className="flex flex-col items-center justify-center pt-8 pb-12 animate-slide-up">
          <div className="relative mb-6">
            <div className="w-48 h-48 bg-gradient-to-br from-sage-green to-sage-green/80 rounded-full flex items-center justify-center shadow-soft">
              <div className="text-8xl">🌱</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-soft-gray">你的成长，我都看在眼里</h2>
          <p className="mt-2 text-soft-gray/70 max-w-xs mx-auto">
            每一个微小的进步，都是一次了不起的胜利。今天，我们从哪里开始呢？
          </p>
        </section>

        {/* Quick Actions Section */}
        <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/create-task"
              className="bg-white rounded-2xl p-5 shadow-soft text-center flex flex-col items-center justify-center hover:shadow-soft-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-sunrise-coral/10 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-sunrise-coral" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-soft-gray">开启新挑战</h3>
              <p className="text-xs text-soft-gray/60 mt-1">拆解一个新挑战</p>
            </Link>
            <Link
              href="/actions"
              className="bg-white rounded-2xl p-5 shadow-soft text-center flex flex-col items-center justify-center hover:shadow-soft-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-sage-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
              </div>
              <h3 className="font-bold text-soft-gray">继续进行中</h3>
              <p className="text-xs text-soft-gray/60 mt-1">完成下一步</p>
            </Link>
          </div>
        </section>

        {/* Gentle Reminder Section */}
        <section className="mt-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="bg-sage-light/70 rounded-2xl p-5">
            <div className="flex items-start text-left">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center mt-1">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray">还记得"毕业论文最后一章"吗？</p>
                <p className="text-soft-gray/80 leading-relaxed text-sm mt-1">
                  我知道面对重要的章节会有压力。别担心，我们已经把它拆解成了小步骤，第一步只需要15分钟就能完成。要不要现在就开始？
                </p>
                <div className="mt-4">
                  <Link
                    href="/actions"
                    className="bg-sage-green text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-sage-green/90 transition-colors inline-block"
                  >
                    开始第一步
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
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
            <Link href="/" className="flex flex-col items-center text-sage-green w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs mt-1 font-semibold">主页</span>
            </Link>
            <Link href="/actions" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1">行动</span>
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
