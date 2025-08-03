"use client"

import { useState, useEffect } from "react"
import { Gift, Star, Zap, Crown } from "lucide-react"
import { rewardPool, type RewardItem } from "@/lib/reward-pool"
import { achievementSystem, type Achievement, type UserStats } from "@/lib/achievement-system"

interface EnhancedRewardSystemProps {
  onClose: () => void
  taskTitle: string
}

export function EnhancedRewardSystem({ onClose, taskTitle }: EnhancedRewardSystemProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [streakMultiplier, setStreakMultiplier] = useState(1)
  const [showAchievements, setShowAchievements] = useState(false)

  useEffect(() => {
    // 加载用户统计数据
    const loadUserStats = () => {
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
      const focusTime = Number.parseInt(localStorage.getItem("totalFocusTime") || "0")
      const achievements = JSON.parse(localStorage.getItem("userAchievements") || "[]")

      // 计算连击
      const today = new Date().toDateString()
      const lastActiveDate = localStorage.getItem("lastActiveDate") || ""
      let currentStreak = Number.parseInt(localStorage.getItem("currentStreak") || "0")

      if (lastActiveDate === today) {
        // 今天已经完成过任务，连击不变
      } else if (lastActiveDate === new Date(Date.now() - 86400000).toDateString()) {
        // 昨天完成过任务，连击+1
        currentStreak += 1
      } else if (lastActiveDate !== "") {
        // 中断了连击
        currentStreak = 1
      } else {
        // 第一次完成任务
        currentStreak = 1
      }

      // 更新连击数据
      localStorage.setItem("currentStreak", currentStreak.toString())
      localStorage.setItem("lastActiveDate", today)

      const longestStreak = Math.max(currentStreak, Number.parseInt(localStorage.getItem("longestStreak") || "0"))
      localStorage.setItem("longestStreak", longestStreak.toString())

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
        lastActiveDate: today,
        achievements,
        level: 1,
        experience: 0,
      }

      // 计算等级
      const levelInfo = achievementSystem.calculateLevel(stats)
      stats.level = levelInfo.level
      stats.experience = levelInfo.experience

      setUserStats(stats)

      // 检查新成就
      const newAchievements = achievementSystem.checkAchievements(stats)
      if (newAchievements.length > 0) {
        setNewAchievements(newAchievements)
        // 保存新成就
        const updatedAchievements = [...achievements, ...newAchievements.map((a) => a.id)]
        localStorage.setItem("userAchievements", JSON.stringify(updatedAchievements))
      }

      // 计算连击倍数
      const multiplier = achievementSystem.getStreakMultiplier(currentStreak)
      setStreakMultiplier(multiplier)
    }

    loadUserStats()
  }, [])

  const handleSpin = () => {
    if (!userStats) return

    setIsSpinning(true)

    setTimeout(() => {
      // 选择奖励
      const reward = rewardPool.selectReward(userStats.level, streakMultiplier)
      setSelectedReward(reward)
      setIsSpinning(false)

      // 保存奖励历史
      rewardPool.saveRewardHistory({
        rewardId: reward.id,
        taskTitle,
        earnedAt: new Date().toISOString(),
        streakMultiplier,
        achievementBonus: newAchievements.length > 0 ? `获得${newAchievements.length}个新成就` : undefined,
      })

      // 先显示奖励结果
      setShowResult(true)

      // 如果有新成就，2秒后显示成就
      if (newAchievements.length > 0) {
        setTimeout(() => {
          setShowAchievements(true)
        }, 2000)
      }
    }, 2000)
  }

  if (showAchievements && newAchievements.length > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-soft-gray mb-2">🎉 解锁新成就！</h3>
            <p className="text-sm text-soft-gray/80 mb-4">恭喜你获得了新的成就徽章！</p>
          </div>

          <div className="space-y-3 mb-6">
            {newAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`${achievementSystem.getRarityBgColor(achievement.rarity)} rounded-2xl p-4 border-2 ${
                  achievement.rarity === "legendary"
                    ? "border-yellow-400 shadow-lg"
                    : achievement.rarity === "epic"
                      ? "border-purple-400"
                      : achievement.rarity === "rare"
                        ? "border-blue-400"
                        : "border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-bold ${achievementSystem.getRarityColor(achievement.rarity)}`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-soft-gray/70 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
          >
            太棒了！继续加油 🚀
          </button>
        </div>
      </div>
    )
  }

  if (showResult && selectedReward) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in">
          <div className="mb-6">
            <div
              className={`w-20 h-20 ${rewardPool.getRarityBgColor(selectedReward.rarity)} rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce border-4 ${
                selectedReward.rarity === "epic"
                  ? "border-purple-400"
                  : selectedReward.rarity === "rare"
                    ? "border-blue-400"
                    : "border-gray-300"
              }`}
            >
              <span className="text-3xl">{selectedReward.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-soft-gray mb-2">🎉 任务完成！</h3>
            <p className="text-sm text-soft-gray/80 mb-2">"{taskTitle}"</p>

            {/* 连击显示 */}
            {userStats && userStats.currentStreak > 1 && (
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-3 py-1 inline-block mb-2">
                <span className="text-sm font-bold text-orange-600">
                  🔥 {userStats.currentStreak}天连击 × {streakMultiplier.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className={`${rewardPool.getRarityBgColor(selectedReward.rarity)} rounded-2xl p-4 mb-6`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-xs font-bold ${rewardPool.getRarityColor(selectedReward.rarity)} uppercase`}>
                {selectedReward.rarity === "epic" ? "史诗" : selectedReward.rarity === "rare" ? "稀有" : "普通"}
              </span>
              {selectedReward.rarity === "epic" && <Star className="w-4 h-4 text-purple-600" />}
              {selectedReward.rarity === "rare" && <Zap className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="text-soft-gray font-medium mb-1">你的奖励是：</p>
            <p className="text-lg font-bold text-sage-green">{selectedReward.title}</p>
            <p className="text-sm text-soft-gray/70 mt-1">{selectedReward.description}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (newAchievements.length > 0) {
                  setShowResult(false)
                  setShowAchievements(true)
                } else {
                  onClose()
                }
              }}
              className="w-full bg-sage-green text-white py-3 rounded-full font-semibold hover:bg-sage-green/90 transition-colors"
            >
              {newAchievements.length > 0 ? "查看新成就 🏆" : "太棒了！"}
            </button>

            {newAchievements.length === 0 && (
              <button onClick={onClose} className="w-full text-soft-gray/60 py-2">
                稍后享受奖励
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-soft-gray mb-2">🎉 任务完成！</h3>
          <p className="text-sm text-soft-gray/80">"{taskTitle}"</p>

          {/* 连击显示 */}
          {userStats && userStats.currentStreak > 1 && (
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-3 py-1 inline-block mt-2">
              <span className="text-sm font-bold text-orange-600">
                🔥 {userStats.currentStreak}天连击！奖励加成 × {streakMultiplier.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div
            className={`w-32 h-32 border-4 border-sage-green rounded-full flex items-center justify-center mx-auto mb-4 ${isSpinning ? "animate-spin" : ""}`}
          >
            <Gift className="w-16 h-16 text-sage-green" />
          </div>
          <p className="text-soft-gray">
            {streakMultiplier > 1 ? "连击加成中！点击转盘获得更好的奖励！" : "点击转盘获得奖励！"}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-sage-green text-white py-3 rounded-full font-semibold hover:bg-sage-green/90 transition-colors disabled:opacity-50"
          >
            {isSpinning ? "正在抽取..." : "开始抽奖 🎲"}
          </button>

          <button onClick={onClose} className="w-full text-soft-gray/60 py-2">
            稍后再说
          </button>
        </div>
      </div>
    </div>
  )
}
