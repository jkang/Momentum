"use client"

// 长期成长追踪系统
export interface GrowthDimension {
  id: string
  name: string
  description: string
  icon: string
  color: string
  maxLevel: number
  currentLevel: number
  currentExp: number
  expToNext: number
  totalExp: number
  milestones: GrowthMilestone[]
}

export interface GrowthMilestone {
  id: string
  title: string
  description: string
  level: number
  unlockedAt?: string
  reward?: string
}

export interface GrowthRecord {
  id: string
  dimensionId: string
  date: string
  expGained: number
  source: "task_completion" | "skill_unlock" | "reflection" | "achievement" | "manual"
  sourceDetail: string
  notes?: string
}

export interface GrowthGoal {
  id: string
  title: string
  description: string
  dimensionId: string
  targetLevel: number
  targetDate: string
  currentProgress: number
  status: "active" | "completed" | "paused" | "cancelled"
  createdAt: string
  completedAt?: string
}

class GrowthTracker {
  private dimensions: GrowthDimension[] = [
    {
      id: "productivity",
      name: "效率管理",
      description: "任务管理、时间规划、执行力",
      icon: "⚡",
      color: "#FF8A65", // sunrise-coral
      maxLevel: 50,
      currentLevel: 1,
      currentExp: 0,
      expToNext: 100,
      totalExp: 0,
      milestones: [
        { id: "prod_1", title: "行动起步", description: "完成第一个任务", level: 1 },
        { id: "prod_5", title: "习惯养成", description: "连续5天完成任务", level: 5 },
        { id: "prod_10", title: "效率达人", description: "掌握基础时间管理", level: 10 },
        { id: "prod_20", title: "管理专家", description: "能够处理复杂项目", level: 20 },
        { id: "prod_30", title: "效率大师", description: "帮助他人提升效率", level: 30 },
      ],
    },
    {
      id: "learning",
      name: "学习成长",
      description: "知识获取、技能提升、思维发展",
      icon: "📚",
      color: "#A0C4FF", // gentle-blue
      maxLevel: 50,
      currentLevel: 1,
      currentExp: 0,
      expToNext: 100,
      totalExp: 0,
      milestones: [
        { id: "learn_1", title: "求知开始", description: "完成第一个学习任务", level: 1 },
        { id: "learn_5", title: "知识积累", description: "持续学习一周", level: 5 },
        { id: "learn_10", title: "学习达人", description: "掌握学习方法", level: 10 },
        { id: "learn_20", title: "知识专家", description: "在某领域有深入理解", level: 20 },
        { id: "learn_30", title: "智慧导师", description: "能够传授知识给他人", level: 30 },
      ],
    },
    {
      id: "wellbeing",
      name: "身心健康",
      description: "身体健康、心理平衡、生活质量",
      icon: "🌱",
      color: "#B2B8A3", // sage-green
      maxLevel: 50,
      currentLevel: 1,
      currentExp: 0,
      expToNext: 100,
      totalExp: 0,
      milestones: [
        { id: "well_1", title: "关注自己", description: "开始关注身心健康", level: 1 },
        { id: "well_5", title: "健康习惯", description: "建立基础健康习惯", level: 5 },
        { id: "well_10", title: "平衡生活", description: "工作生活平衡", level: 10 },
        { id: "well_20", title: "健康专家", description: "全面的健康管理", level: 20 },
        { id: "well_30", title: "生活导师", description: "帮助他人改善生活质量", level: 30 },
      ],
    },
    {
      id: "relationships",
      name: "人际关系",
      description: "沟通能力、团队协作、社交技能",
      icon: "🤝",
      color: "#FFB74D", // warm orange
      maxLevel: 50,
      currentLevel: 1,
      currentExp: 0,
      expToNext: 100,
      totalExp: 0,
      milestones: [
        { id: "rel_1", title: "社交起步", description: "主动与他人交流", level: 1 },
        { id: "rel_5", title: "沟通改善", description: "提升沟通技巧", level: 5 },
        { id: "rel_10", title: "关系建设", description: "建立良好人际关系", level: 10 },
        { id: "rel_20", title: "团队领导", description: "具备领导和协调能力", level: 20 },
        { id: "rel_30", title: "人际大师", description: "成为他人的人际导师", level: 30 },
      ],
    },
    {
      id: "creativity",
      name: "创新创造",
      description: "创意思维、问题解决、创新能力",
      icon: "🎨",
      color: "#CE93D8", // light purple
      maxLevel: 50,
      currentLevel: 1,
      currentExp: 0,
      expToNext: 100,
      totalExp: 0,
      milestones: [
        { id: "crea_1", title: "创意萌芽", description: "开始创意思考", level: 1 },
        { id: "crea_5", title: "创新尝试", description: "尝试新的解决方案", level: 5 },
        { id: "crea_10", title: "创意达人", description: "具备创新思维", level: 10 },
        { id: "crea_20", title: "创新专家", description: "能够创造性解决问题", level: 20 },
        { id: "crea_30", title: "创意大师", description: "启发他人的创新能力", level: 30 },
      ],
    },
  ]

  // 检查是否在浏览器环境
  private isClient(): boolean {
    return typeof window !== "undefined"
  }

  // 获取所有成长维度
  getAllDimensions(): GrowthDimension[] {
    if (!this.isClient()) {
      return this.dimensions
    }

    const saved = localStorage.getItem("growthDimensions")
    if (saved) {
      return JSON.parse(saved)
    }
    return this.dimensions
  }

  // 保存成长维度
  saveDimensions(dimensions: GrowthDimension[]): void {
    if (!this.isClient()) return
    localStorage.setItem("growthDimensions", JSON.stringify(dimensions))
  }

  // 获取特定维度
  getDimension(dimensionId: string): GrowthDimension | null {
    const dimensions = this.getAllDimensions()
    return dimensions.find((d) => d.id === dimensionId) || null
  }

  // 添加经验值
  addExperience(dimensionId: string, exp: number, source: GrowthRecord["source"], sourceDetail: string): boolean {
    if (!this.isClient()) return false

    const dimensions = this.getAllDimensions()
    const dimension = dimensions.find((d) => d.id === dimensionId)

    if (!dimension) return false

    // 记录成长记录
    this.addGrowthRecord({
      dimensionId,
      date: new Date().toISOString(),
      expGained: exp,
      source,
      sourceDetail,
    })

    // 更新经验值
    dimension.totalExp += exp
    dimension.currentExp += exp

    // 检查升级
    let leveledUp = false
    while (dimension.currentExp >= dimension.expToNext && dimension.currentLevel < dimension.maxLevel) {
      dimension.currentExp -= dimension.expToNext
      dimension.currentLevel += 1
      leveledUp = true

      // 计算下一级所需经验（递增）
      dimension.expToNext = Math.floor(100 * Math.pow(1.2, dimension.currentLevel - 1))

      // 检查里程碑
      const milestone = dimension.milestones.find((m) => m.level === dimension.currentLevel && !m.unlockedAt)
      if (milestone) {
        milestone.unlockedAt = new Date().toISOString()
      }
    }

    this.saveDimensions(dimensions)
    return leveledUp
  }

  // 添加成长记录
  addGrowthRecord(record: Omit<GrowthRecord, "id">): void {
    if (!this.isClient()) return

    const records = this.getGrowthRecords()
    const newRecord: GrowthRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    records.unshift(newRecord) // 最新的在前面

    // 只保留最近1000条记录
    if (records.length > 1000) {
      records.splice(1000)
    }

    localStorage.setItem("growthRecords", JSON.stringify(records))
  }

  // 获取成长记录
  getGrowthRecords(dimensionId?: string, limit?: number): GrowthRecord[] {
    if (!this.isClient()) return []

    const saved = localStorage.getItem("growthRecords")
    let records: GrowthRecord[] = saved ? JSON.parse(saved) : []

    if (dimensionId) {
      records = records.filter((r) => r.dimensionId === dimensionId)
    }

    if (limit) {
      records = records.slice(0, limit)
    }

    return records
  }

  // 获取成长统计
  getGrowthStats(
    dimensionId?: string,
    days = 30,
  ): {
    totalExp: number
    averageDaily: number
    recordCount: number
    topSources: Array<{ source: string; count: number; exp: number }>
  } {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    let records = this.getGrowthRecords(dimensionId)
    records = records.filter((r) => new Date(r.date) >= cutoffDate)

    const totalExp = records.reduce((sum, r) => sum + r.expGained, 0)
    const averageDaily = totalExp / days

    // 统计来源
    const sourceStats: Record<string, { count: number; exp: number }> = {}
    records.forEach((r) => {
      if (!sourceStats[r.source]) {
        sourceStats[r.source] = { count: 0, exp: 0 }
      }
      sourceStats[r.source].count++
      sourceStats[r.source].exp += r.expGained
    })

    const topSources = Object.entries(sourceStats)
      .map(([source, stats]) => ({ source, ...stats }))
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 5)

    return {
      totalExp,
      averageDaily,
      recordCount: records.length,
      topSources,
    }
  }

  // 设置成长目标
  setGrowthGoal(goal: Omit<GrowthGoal, "id" | "createdAt" | "currentProgress" | "status">): void {
    if (!this.isClient()) return

    const goals = this.getGrowthGoals()
    const newGoal: GrowthGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      currentProgress: 0,
      status: "active",
    }

    goals.push(newGoal)
    localStorage.setItem("growthGoals", JSON.stringify(goals))
  }

  // 获取成长目标
  getGrowthGoals(status?: GrowthGoal["status"]): GrowthGoal[] {
    if (!this.isClient()) return []

    const saved = localStorage.getItem("growthGoals")
    let goals: GrowthGoal[] = saved ? JSON.parse(saved) : []

    if (status) {
      goals = goals.filter((g) => g.status === status)
    }

    return goals
  }

  // 更新目标进度
  updateGoalProgress(): void {
    if (!this.isClient()) return

    const goals = this.getGrowthGoals("active")
    const dimensions = this.getAllDimensions()
    let updated = false

    goals.forEach((goal) => {
      const dimension = dimensions.find((d) => d.id === goal.dimensionId)
      if (dimension) {
        const oldProgress = goal.currentProgress
        goal.currentProgress = (dimension.currentLevel / goal.targetLevel) * 100

        if (goal.currentProgress >= 100 && goal.status === "active") {
          goal.status = "completed"
          goal.completedAt = new Date().toISOString()
          updated = true
        } else if (oldProgress !== goal.currentProgress) {
          updated = true
        }
      }
    })

    if (updated) {
      localStorage.setItem("growthGoals", JSON.stringify(this.getGrowthGoals()))
    }
  }

  // 获取总体成长等级
  getOverallLevel(): number {
    const dimensions = this.getAllDimensions()
    const totalLevel = dimensions.reduce((sum, d) => sum + d.currentLevel, 0)
    return Math.floor(totalLevel / dimensions.length)
  }

  // 获取成长趋势数据（用于图表）
  getGrowthTrend(dimensionId: string, days = 30): Array<{ date: string; exp: number; level: number }> {
    const records = this.getGrowthRecords(dimensionId)
    const dimension = this.getDimension(dimensionId)

    if (!dimension) return []

    const trend: Array<{ date: string; exp: number; level: number }> = []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // 模拟历史数据（实际应用中应该保存历史快照）
    const currentExp = dimension.totalExp
    const currentLevel = dimension.currentLevel

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // 计算该日期的经验值（简化计算）
      const dayRecords = records.filter((r) => {
        const recordDate = new Date(r.date)
        return recordDate.toDateString() === date.toDateString()
      })

      const dayExp = dayRecords.reduce((sum, r) => sum + r.expGained, 0)

      trend.push({
        date: date.toISOString().split("T")[0],
        exp: dayExp,
        level: currentLevel, // 简化处理，实际应该计算历史等级
      })
    }

    return trend
  }
}

export const growthTracker = new GrowthTracker()
