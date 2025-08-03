"use client"

// 成就系统引擎
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: UserStats) => boolean
  experience: number
}

export interface UserStats {
  totalTasks: number
  currentStreak: number
  longestStreak: number
  totalFocusTime: number // 分钟
  tasksByType: Record<string, number>
  lastActiveDate: string
  achievements: string[] // achievement IDs
  level: number
  experience: number
}

const achievements: Achievement[] = [
  {
    id: "first_task",
    name: "初次行动",
    description: "完成第一个任务",
    icon: "🌱",
    condition: (stats) => stats.totalTasks >= 1,
    experience: 50,
  },
  {
    id: "streak_3",
    name: "三日坚持",
    description: "连续3天完成任务",
    icon: "🔥",
    condition: (stats) => stats.currentStreak >= 3,
    experience: 100,
  },
  {
    id: "streak_7",
    name: "一周习惯",
    description: "连续7天完成任务",
    icon: "⭐",
    condition: (stats) => stats.currentStreak >= 7,
    experience: 200,
  },
  {
    id: "focus_master",
    name: "专注大师",
    description: "累计专注时长达到10小时",
    icon: "🎯",
    condition: (stats) => stats.totalFocusTime >= 36000000, // 10小时的毫秒数
    experience: 300,
  },
  {
    id: "task_10",
    name: "行动达人",
    description: "完成10个任务",
    icon: "🏆",
    condition: (stats) => stats.totalTasks >= 10,
    experience: 250,
  },
]

export const achievementSystem = {
  checkAchievements: (stats: UserStats): Achievement[] => {
    return achievements.filter(
      (achievement) => achievement.condition(stats) && !stats.achievements.includes(achievement.id),
    )
  },

  calculateLevel: (stats: UserStats) => {
    const baseExp = 100
    const expGrowth = 1.5

    let level = 1
    let totalExpNeeded = 0
    let currentLevelExp = baseExp

    while (totalExpNeeded + currentLevelExp <= stats.experience) {
      totalExpNeeded += currentLevelExp
      level++
      currentLevelExp = Math.floor(baseExp * Math.pow(expGrowth, level - 1))
    }

    const experienceInCurrentLevel = stats.experience - totalExpNeeded
    const nextLevelExp = currentLevelExp

    return {
      level,
      experience: experienceInCurrentLevel,
      nextLevelExp,
      totalExperience: stats.experience,
    }
  },

  addExperience: (currentExp: number, amount: number): number => {
    return currentExp + amount
  },
}
