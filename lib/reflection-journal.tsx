"use client"

// 反思日记系统
export interface JournalEntry {
  id: string
  date: string
  title?: string
  content: string
  mood: 1 | 2 | 3 | 4 | 5 // 1=很差, 2=不好, 3=一般, 4=不错, 5=很好
  energy: 1 | 2 | 3 | 4 | 5 // 精力水平
  productivity: 1 | 2 | 3 | 4 | 5 // 效率感受
  tags: string[]
  achievements: string[] // 今日成就
  challenges: string[] // 遇到的挑战
  learnings: string[] // 学到的东西
  gratitude: string[] // 感恩的事情
  tomorrowGoals: string[] // 明日目标
  createdAt: string
  updatedAt: string
}

export interface ReflectionPrompt {
  id: string
  category: "daily" | "weekly" | "monthly" | "achievement" | "challenge"
  question: string
  description?: string
  isActive: boolean
}

export interface InsightPattern {
  id: string
  type: "mood_trend" | "productivity_pattern" | "energy_cycle" | "tag_frequency" | "achievement_growth"
  title: string
  description: string
  data: any
  discoveredAt: string
  confidence: number // 0-1
}

class ReflectionJournal {
  private defaultPrompts: ReflectionPrompt[] = [
    // 日常反思
    {
      id: "daily_highlight",
      category: "daily",
      question: "今天最值得庆祝的一件事是什么？",
      description: "记录每日的亮点时刻",
      isActive: true,
    },
    {
      id: "daily_challenge",
      category: "daily",
      question: "今天遇到的最大挑战是什么？你是如何应对的？",
      description: "反思挑战和应对策略",
      isActive: true,
    },
    {
      id: "daily_learning",
      category: "daily",
      question: "今天学到了什么新东西？",
      description: "记录每日的学习收获",
      isActive: true,
    },
    {
      id: "daily_gratitude",
      category: "daily",
      question: "今天你最感恩的三件事是什么？",
      description: "培养感恩的心态",
      isActive: true,
    },

    // 周度反思
    {
      id: "weekly_progress",
      category: "weekly",
      question: "这周在哪些方面有了明显的进步？",
      description: "回顾一周的成长",
      isActive: true,
    },
    {
      id: "weekly_pattern",
      category: "weekly",
      question: "这周你注意到了哪些行为模式？",
      description: "识别行为规律",
      isActive: true,
    },

    // 月度反思
    {
      id: "monthly_goals",
      category: "monthly",
      question: "这个月的目标完成情况如何？",
      description: "评估月度目标达成",
      isActive: true,
    },
    {
      id: "monthly_growth",
      category: "monthly",
      question: "这个月你在哪些方面成长最多？",
      description: "总结月度成长",
      isActive: true,
    },

    // 成就反思
    {
      id: "achievement_feeling",
      category: "achievement",
      question: "完成这个成就时你的感受如何？",
      description: "记录成就感受",
      isActive: true,
    },

    // 挑战反思
    {
      id: "challenge_lesson",
      category: "challenge",
      question: "这个挑战教会了你什么？",
      description: "从挑战中学习",
      isActive: true,
    },
  ]

  // 检查是否在浏览器环境
  private isClient(): boolean {
    return typeof window !== "undefined"
  }

  // 获取所有日记条目
  getAllEntries(): JournalEntry[] {
    if (!this.isClient()) return []

    const saved = localStorage.getItem("journalEntries")
    return saved ? JSON.parse(saved) : []
  }

  // 保存日记条目
  saveEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">): string {
    if (!this.isClient()) return ""

    const entries = this.getAllEntries()
    const now = new Date().toISOString()

    const newEntry: JournalEntry = {
      ...entry,
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    }

    entries.unshift(newEntry) // 最新的在前面
    localStorage.setItem("journalEntries", JSON.stringify(entries))

    return newEntry.id
  }

  // 更新日记条目
  updateEntry(entryId: string, updates: Partial<JournalEntry>): boolean {
    if (!this.isClient()) return false

    const entries = this.getAllEntries()
    const entryIndex = entries.findIndex((e) => e.id === entryId)

    if (entryIndex === -1) return false

    entries[entryIndex] = {
      ...entries[entryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("journalEntries", JSON.stringify(entries))
    return true
  }

  // 删除日记条目
  deleteEntry(entryId: string): boolean {
    if (!this.isClient()) return false

    const entries = this.getAllEntries()
    const filteredEntries = entries.filter((e) => e.id !== entryId)

    if (filteredEntries.length === entries.length) return false

    localStorage.setItem("journalEntries", JSON.stringify(filteredEntries))
    return true
  }

  // 获取特定日期的条目
  getEntryByDate(date: string): JournalEntry | null {
    const entries = this.getAllEntries()
    return entries.find((e) => e.date === date) || null
  }

  // 获取日期范围内的条目
  getEntriesInRange(startDate: string, endDate: string): JournalEntry[] {
    const entries = this.getAllEntries()
    return entries.filter((e) => e.date >= startDate && e.date <= endDate)
  }

  // 获取反思提示
  getReflectionPrompts(category?: ReflectionPrompt["category"]): ReflectionPrompt[] {
    if (!this.isClient()) {
      let prompts = this.defaultPrompts
      if (category) {
        prompts = prompts.filter((p) => p.category === category)
      }
      return prompts.filter((p) => p.isActive)
    }

    const saved = localStorage.getItem("reflectionPrompts")
    let prompts: ReflectionPrompt[] = saved ? JSON.parse(saved) : this.defaultPrompts

    if (category) {
      prompts = prompts.filter((p) => p.category === category)
    }

    return prompts.filter((p) => p.isActive)
  }

  // 添加自定义反思提示
  addCustomPrompt(prompt: Omit<ReflectionPrompt, "id">): void {
    if (!this.isClient()) return

    const prompts = this.getReflectionPrompts()
    const newPrompt: ReflectionPrompt = {
      ...prompt,
      id: `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    prompts.push(newPrompt)
    localStorage.setItem("reflectionPrompts", JSON.stringify(prompts))
  }

  // 分析情绪趋势
  analyzeMoodTrend(days = 30): {
    averageMood: number
    trend: "improving" | "declining" | "stable"
    moodData: Array<{ date: string; mood: number }>
  } {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const entries = this.getAllEntries().filter((e) => new Date(e.date) >= cutoffDate)

    if (entries.length === 0) {
      return { averageMood: 3, trend: "stable", moodData: [] }
    }

    const moodData = entries.map((e) => ({ date: e.date, mood: e.mood })).reverse()
    const averageMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length

    // 计算趋势（简单的线性回归）
    let trend: "improving" | "declining" | "stable" = "stable"
    if (entries.length >= 7) {
      const recentAvg = entries.slice(0, 7).reduce((sum, e) => sum + e.mood, 0) / 7
      const olderAvg = entries.slice(-7).reduce((sum, e) => sum + e.mood, 0) / 7

      if (recentAvg > olderAvg + 0.3) trend = "improving"
      else if (recentAvg < olderAvg - 0.3) trend = "declining"
    }

    return { averageMood, trend, moodData }
  }

  // 分析生产力模式
  analyzeProductivityPattern(): {
    averageProductivity: number
    bestDays: string[]
    worstDays: string[]
    patterns: string[]
  } {
    const entries = this.getAllEntries()

    if (entries.length === 0) {
      return { averageProductivity: 3, bestDays: [], worstDays: [], patterns: [] }
    }

    const averageProductivity = entries.reduce((sum, e) => sum + e.productivity, 0) / entries.length

    // 按星期几分组
    const dayGroups: Record<string, number[]> = {}
    entries.forEach((entry) => {
      const dayOfWeek = new Date(entry.date).toLocaleDateString("zh-CN", { weekday: "long" })
      if (!dayGroups[dayOfWeek]) dayGroups[dayOfWeek] = []
      dayGroups[dayOfWeek].push(entry.productivity)
    })

    // 计算每天的平均生产力
    const dayAverages = Object.entries(dayGroups).map(([day, scores]) => ({
      day,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    }))

    dayAverages.sort((a, b) => b.average - a.average)

    const bestDays = dayAverages.slice(0, 2).map((d) => d.day)
    const worstDays = dayAverages.slice(-2).map((d) => d.day)

    // 生成模式描述
    const patterns: string[] = []
    if (bestDays.includes("星期一")) patterns.push("周一状态通常不错")
    if (worstDays.includes("星期五")) patterns.push("周五效率可能下降")

    return { averageProductivity, bestDays, worstDays, patterns }
  }

  // 分析标签频率
  analyzeTagFrequency(): Array<{ tag: string; count: number; percentage: number }> {
    const entries = this.getAllEntries()
    const tagCounts: Record<string, number> = {}

    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const totalTags = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)

    if (totalTags === 0) return []

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: (count / totalTags) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // 只返回前10个
  }

  // 生成洞察
  generateInsights(): InsightPattern[] {
    const insights: InsightPattern[] = []

    // 情绪趋势洞察
    const moodTrend = this.analyzeMoodTrend()
    if (moodTrend.trend !== "stable") {
      insights.push({
        id: `mood_${Date.now()}`,
        type: "mood_trend",
        title: moodTrend.trend === "improving" ? "情绪持续改善" : "情绪需要关注",
        description:
          moodTrend.trend === "improving"
            ? `最近30天你的情绪呈上升趋势，平均分数${moodTrend.averageMood.toFixed(1)}`
            : `最近30天你的情绪有下降趋势，建议关注心理健康`,
        data: moodTrend,
        discoveredAt: new Date().toISOString(),
        confidence: 0.8,
      })
    }

    // 生产力模式洞察
    const productivityPattern = this.analyzeProductivityPattern()
    if (productivityPattern.bestDays.length > 0) {
      insights.push({
        id: `productivity_${Date.now()}`,
        type: "productivity_pattern",
        title: "发现你的高效时段",
        description: `你在${productivityPattern.bestDays.join("和")}的效率通常更高`,
        data: productivityPattern,
        discoveredAt: new Date().toISOString(),
        confidence: 0.7,
      })
    }

    // 标签频率洞察
    const tagFrequency = this.analyzeTagFrequency()
    if (tagFrequency.length > 0) {
      const topTag = tagFrequency[0]
      insights.push({
        id: `tag_${Date.now()}`,
        type: "tag_frequency",
        title: "你最关注的主题",
        description: `"${topTag.tag}"是你最常提到的标签，出现了${topTag.count}次`,
        data: tagFrequency,
        discoveredAt: new Date().toISOString(),
        confidence: 0.9,
      })
    }

    return insights
  }

  // 获取日记统计
  getJournalStats(): {
    totalEntries: number
    streakDays: number
    averageMood: number
    averageProductivity: number
    mostUsedTags: string[]
  } {
    const entries = this.getAllEntries()

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        streakDays: 0,
        averageMood: 3,
        averageProductivity: 3,
        mostUsedTags: [],
      }
    }

    // 计算连续记录天数
    let streakDays = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]

      if (entries.some((e) => e.date === dateStr)) {
        streakDays++
      } else {
        break
      }
    }

    const averageMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
    const averageProductivity = entries.reduce((sum, e) => sum + e.productivity, 0) / entries.length

    const tagFrequency = this.analyzeTagFrequency()
    const mostUsedTags = tagFrequency.slice(0, 5).map((t) => t.tag)

    return {
      totalEntries: entries.length,
      streakDays,
      averageMood,
      averageProductivity,
      mostUsedTags,
    }
  }
}

export const reflectionJournal = new ReflectionJournal()
