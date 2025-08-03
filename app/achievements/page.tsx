"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Trophy, Crown, Lock } from "lucide-react"
import { achievementSystem, type Achievement, type UserStats } from "@/lib/achievement-system"

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all")
  const [categoryFilter, setCategoryFilter] = useState<Achievement["category"] | "all">("all")

  useEffect(() => {
    // 加载用户统计数据
    const loadData = () => {
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
      const focusTime = Number.parseInt(localStorage.getItem("totalFocusTime") || "0")
      const userAchievements = JSON.parse(localStorage.getItem("userAchievements") || "[]")
      const currentStreak = Number.parseInt(localStorage.getItem("currentStreak") || "0")
      const longestStreak = Number.parseInt(localStorage.getItem("longestStreak") || "0")

      // 统计任务类型
      const tasksByType: Record<string, number> = {}
      completedTasks.forEach((task: any) => {
        if (task.taskType) {
          tasksByType[task.taskType] = (tasksByType[task.taskType] || 0) + 1
        }
      })

      const stats: UserStats = {
        totalTasks: completedTasks.length,
        currentStreak,
        longestStreak,
        totalFocusTime: focusTime,
        tasksByType,
        lastActiveDate: localStorage.getItem("lastActiveDate") || "",
        achievements: userAchievements,
        level: 1,
        experience: 0,
      }

      // 计算等级
      const levelInfo = achievementSystem.calculateLevel(stats)
      stats.level = levelInfo.level
      stats.experience = levelInfo.experience

      setUserStats(stats)

      // 获取所有成就并更新进度
      const allAchievements = achievementSystem.getAllAchievements()
      const achievementsWithProgress = allAchievements.map((achievement) => {
        const isUnlocked = userAchievements.includes(achievement.id)
        let progress = 0

        if (!isUnlocked) {
          switch (achievement.condition.type) {
            case "task_count":
              progress = Math.min(stats.totalTasks, achievement.condition.target)
              break
            case "streak_days":
              progress = Math.min(stats.currentStreak, achievement.condition.target)
              break
            case "focus_time":
              progress = Math.min(stats.totalFocusTime, achievement.condition.target)
              break
            case "task_type":
              if (achievement.condition.taskType) {
                progress = Math.min(
                  stats.tasksByType[achievement.condition.taskType] || 0,
                  achievement.condition.target,
                )
              }
              break
          }
        }

        return {
          ...achievement,
          progress,
          unlockedAt: isUnlocked ? "已解锁" : undefined,
        }
      })

      setAchievements(achievementsWithProgress)
    }

    loadData()
  }, [])

  const filteredAchievements = achievements.filter((achievement) => {
    const statusMatch =
      filter === "all" ||
      (filter === "unlocked" && achievement.unlockedAt) ||
      (filter === "locked" && !achievement.unlockedAt)

    const categoryMatch = categoryFilter === "all" || achievement.category === categoryFilter

    return statusMatch && categoryMatch
  })

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length
  const totalCount = achievements.length

  if (!userStats) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-sage-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-soft-gray">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
      <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
        <Link href="/" className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-soft-gray" />
        </Link>
        <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">成就系统</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-grow p-4">
        {/* 用户等级和进度 */}
        <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-green to-gentle-blue rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-soft-gray">等级 {userStats.level}</h2>
                <p className="text-sm text-soft-gray/60">经验值 {userStats.experience}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-soft-gray/60">成就进度</p>
              <p className="font-bold text-sage-green">
                {unlockedCount}/{totalCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-sunrise-coral font-bold">{userStats.totalTasks}</div>
              <div className="text-soft-gray/60">完成任务</div>
            </div>
            <div>
              <div className="text-orange-500 font-bold">{userStats.currentStreak}</div>
              <div className="text-soft-gray/60">当前连击</div>
            </div>
            <div>
              <div className="text-gentle-blue font-bold">{Math.floor(userStats.totalFocusTime / 60)}</div>
              <div className="text-soft-gray/60">专注小时</div>
            </div>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-2xl p-4 shadow-soft mb-4">
          <div className="flex gap-2 mb-3">
            {[
              { key: "all", label: "全部" },
              { key: "unlocked", label: "已解锁" },
              { key: "locked", label: "未解锁" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === option.key
                    ? "bg-sage-green text-white"
                    : "bg-light-gray text-soft-gray hover:bg-sage-light"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "全部", icon: "🏆" },
              { key: "task", label: "任务", icon: "✅" },
              { key: "streak", label: "连击", icon: "🔥" },
              { key: "time", label: "时间", icon: "⏰" },
              { key: "special", label: "特殊", icon: "⭐" },
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setCategoryFilter(category.key as any)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  categoryFilter === category.key
                    ? "bg-gentle-blue text-white"
                    : "bg-light-gray text-soft-gray hover:bg-sage-light"
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* 成就列表 */}
        <div className="space-y-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl p-4 shadow-soft transition-all ${
                achievement.unlockedAt ? "border-l-4 border-sage-green" : "opacity-75"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    achievement.unlockedAt ? achievementSystem.getRarityBgColor(achievement.rarity) : "bg-gray-100"
                  }`}
                >
                  {achievement.unlockedAt ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${achievement.unlockedAt ? "text-soft-gray" : "text-soft-gray/60"}`}>
                      {achievement.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        achievement.rarity === "legendary"
                          ? "bg-yellow-100 text-yellow-600"
                          : achievement.rarity === "epic"
                            ? "bg-purple-100 text-purple-600"
                            : achievement.rarity === "rare"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {achievement.rarity === "legendary"
                        ? "传说"
                        : achievement.rarity === "epic"
                          ? "史诗"
                          : achievement.rarity === "rare"
                            ? "稀有"
                            : "普通"}
                    </span>
                  </div>

                  <p className={`text-sm ${achievement.unlockedAt ? "text-soft-gray/70" : "text-soft-gray/50"}`}>
                    {achievement.description}
                  </p>

                  {!achievement.unlockedAt && achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-soft-gray/60 mb-1">
                        <span>进度</span>
                        <span>
                          {achievement.progress}/{achievement.condition.target}
                        </span>
                      </div>
                      <div className="w-full bg-light-gray rounded-full h-2">
                        <div
                          className="bg-sage-green h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((achievement.progress / achievement.condition.target) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {achievement.unlockedAt && (
                    <div className="mt-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-sage-green" />
                      <span className="text-xs text-sage-green font-medium">已解锁</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-soft-gray/60">暂无符合条件的成就</p>
          </div>
        )}
      </main>
    </div>
  )
}
