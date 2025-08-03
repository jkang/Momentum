"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, Calendar, Target, Award } from "lucide-react"
import Link from "next/link"

interface InsightData {
  completedTasks: number
  totalTasks: number
  streakDays: number
  focusTime: number
  topCategory: string
  weeklyProgress: number[]
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightData>({
    completedTasks: 12,
    totalTasks: 18,
    streakDays: 5,
    focusTime: 180, // minutes
    topCategory: "学习/工作任务",
    weeklyProgress: [60, 80, 45, 90, 75, 85, 70],
  })
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
  }, [])

  const completionRate = Math.round((insights.completedTasks / insights.totalTasks) * 100)
  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

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
          <h1 className="text-lg font-bold text-soft-gray">成长洞察</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Welcome Message */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-sage-light to-sage-light/70 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray mb-1">{userName}，你的成长轨迹</p>
                <p className="text-soft-gray/80 text-sm leading-relaxed">
                  数据不会说谎，让我们一起看看你这段时间的精彩表现吧！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-soft text-center">
              <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-sage-green" />
              </div>
              <h3 className="text-2xl font-bold text-soft-gray">{completionRate}%</h3>
              <p className="text-soft-gray/70 text-sm">任务完成率</p>
              <p className="text-xs text-soft-gray/60 mt-1">
                {insights.completedTasks}/{insights.totalTasks} 个任务
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-soft text-center">
              <div className="w-12 h-12 rounded-full bg-sunrise-coral/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-sunrise-coral" />
              </div>
              <h3 className="text-2xl font-bold text-soft-gray">{insights.streakDays}</h3>
              <p className="text-soft-gray/70 text-sm">连续行动天数</p>
              <p className="text-xs text-soft-gray/60 mt-1">保持这个节奏！</p>
            </div>
          </div>
        </section>

        {/* Weekly Progress Chart */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <h3 className="font-bold text-soft-gray mb-4">本周进度趋势</h3>
            <div className="flex items-end justify-between h-32 mb-4">
              {insights.weeklyProgress.map((progress, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-6 bg-light-gray rounded-t-lg relative">
                    <div
                      className="bg-sage-green rounded-t-lg transition-all duration-500"
                      style={{ height: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-soft-gray/60 mt-2">{weekDays[index]}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-soft-gray/70 text-center">
              平均每天完成 {Math.round(insights.weeklyProgress.reduce((a, b) => a + b, 0) / 7)}% 的计划任务
            </p>
          </div>
        </section>

        {/* Focus Time */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-soft-gray">专注时间统计</h3>
              <div className="w-8 h-8 rounded-full bg-gentle-blue/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-gentle-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-bold text-soft-gray mb-2">
                {Math.floor(insights.focusTime / 60)}h {insights.focusTime % 60}m
              </h4>
              <p className="text-soft-gray/70 text-sm mb-4">本周累计专注时间</p>
              <div className="bg-light-gray rounded-full h-2 mb-2">
                <div
                  className="bg-gentle-blue rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.min((insights.focusTime / 300) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-soft-gray/60">
                距离本周目标 5小时还差 {Math.max(300 - insights.focusTime, 0)} 分钟
              </p>
            </div>
          </div>
        </section>

        {/* Top Category */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-soft-gray">最活跃领域</h3>
              <Award className="w-5 h-5 text-sunrise-coral" />
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-sunrise-coral/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="font-bold text-soft-gray mb-1">{insights.topCategory}</h4>
              <p className="text-soft-gray/70 text-sm">你在这个领域最为活跃，已完成 8 个相关任务</p>
            </div>
          </div>
        </section>

        {/* Encouragement */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-sage-light/70 to-sunrise-coral/10 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-lg">🌱</div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray mb-2">小M的鼓励</p>
                <p className="text-soft-gray/80 text-sm leading-relaxed">
                  {userName}，你的进步真的很棒！{completionRate}% 的完成率已经超过了很多人。 连续 {insights.streakDays}{" "}
                  天的坚持更是难能可贵。记住，每一个小小的行动都在积累成巨大的改变。
                </p>
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
            <Link href="/" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs mt-1">主页</span>
            </Link>
            <Link href="/actions" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1">行动</span>
            </Link>
            <Link href="/insights" className="flex flex-col items-center text-sage-green w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1 font-semibold">洞察</span>
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
