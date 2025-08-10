"use client"

// 技能树系统
export interface SkillNode {
  id: string
  name: string
  description: string
  icon: string
  category: "productivity" | "learning" | "wellbeing" | "relationships" | "creativity"
  tier: number // 技能层级 1-5
  position: { x: number; y: number } // 在技能树中的位置
  prerequisites: string[] // 前置技能ID
  unlockConditions: {
    type: "level" | "tasks" | "streak" | "time" | "achievement"
    dimensionId?: string
    value: number
    description: string
  }[]
  benefits: string[] // 技能效果
  isUnlocked: boolean
  unlockedAt?: string
  progress: number // 解锁进度 0-100
}

export interface SkillCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  nodes: SkillNode[]
}

class SkillTree {
  private categories: SkillCategory[] = [
    {
      id: "productivity",
      name: "效率管理",
      description: "提升任务管理和执行效率的技能",
      icon: "⚡",
      color: "#FF8A65",
      nodes: [
        // 第一层 - 基础技能
        {
          id: "task_breakdown",
          name: "任务拆解",
          description: "将复杂任务分解为可执行的小步骤",
          icon: "🔧",
          category: "productivity",
          tier: 1,
          position: { x: 100, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "tasks",
              value: 5,
              description: "完成5个任务",
            },
          ],
          benefits: ["任务拆解更加精准", "提供更多实用建议", "减少任务执行阻力"],
          isUnlocked: false,
          progress: 0,
        },
        {
          id: "time_blocking",
          name: "时间块管理",
          description: "学会为不同类型的任务分配专门的时间块",
          icon: "⏰",
          category: "productivity",
          tier: 1,
          position: { x: 300, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "productivity",
              value: 3,
              description: "效率管理达到3级",
            },
          ],
          benefits: ["更好的时间规划", "减少任务切换成本", "提高专注度"],
          isUnlocked: false,
          progress: 0,
        },

        // 第二层 - 进阶技能
        {
          id: "priority_matrix",
          name: "优先级矩阵",
          description: "掌握重要性和紧急性的四象限管理法",
          icon: "📊",
          category: "productivity",
          tier: 2,
          position: { x: 200, y: 150 },
          prerequisites: ["task_breakdown", "time_blocking"],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "productivity",
              value: 8,
              description: "效率管理达到8级",
            },
            {
              type: "tasks",
              value: 25,
              description: "完成25个任务",
            },
          ],
          benefits: ["智能任务优先级排序", "更好的决策支持", "减少重要任务遗漏"],
          isUnlocked: false,
          progress: 0,
        },

        // 第三层 - 高级技能
        {
          id: "flow_state",
          name: "心流状态",
          description: "掌握进入和维持高效专注状态的技巧",
          icon: "🌊",
          category: "productivity",
          tier: 3,
          position: { x: 200, y: 250 },
          prerequisites: ["priority_matrix"],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "productivity",
              value: 15,
              description: "效率管理达到15级",
            },
            {
              type: "streak",
              value: 14,
              description: "连续14天完成任务",
            },
          ],
          benefits: ["专注时间延长", "工作质量提升", "减少疲劳感"],
          isUnlocked: false,
          progress: 0,
        },
      ],
    },

    {
      id: "learning",
      name: "学习成长",
      description: "提升学习效率和知识获取能力",
      icon: "📚",
      color: "#A0C4FF",
      nodes: [
        {
          id: "active_reading",
          name: "主动阅读",
          description: "掌握高效的阅读和信息提取技巧",
          icon: "📖",
          category: "learning",
          tier: 1,
          position: { x: 100, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "learning",
              value: 2,
              description: "学习成长达到2级",
            },
          ],
          benefits: ["阅读速度提升", "信息理解更深入", "知识记忆更持久"],
          isUnlocked: false,
          progress: 0,
        },
        {
          id: "note_system",
          name: "笔记系统",
          description: "建立高效的知识管理和笔记系统",
          icon: "📝",
          category: "learning",
          tier: 1,
          position: { x: 300, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "learning",
              value: 4,
              description: "学习成长达到4级",
            },
          ],
          benefits: ["知识整理更系统", "复习效率提升", "知识连接更紧密"],
          isUnlocked: false,
          progress: 0,
        },
        {
          id: "spaced_repetition",
          name: "间隔重复",
          description: "运用科学的记忆规律提升学习效果",
          icon: "🧠",
          category: "learning",
          tier: 2,
          position: { x: 200, y: 150 },
          prerequisites: ["active_reading", "note_system"],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "learning",
              value: 10,
              description: "学习成长达到10级",
            },
          ],
          benefits: ["记忆效果显著提升", "学习时间更高效", "知识遗忘率降低"],
          isUnlocked: false,
          progress: 0,
        },
      ],
    },

    {
      id: "wellbeing",
      name: "身心健康",
      description: "维护身心健康，提升生活质量",
      icon: "🌱",
      color: "#B2B8A3",
      nodes: [
        {
          id: "mindfulness",
          name: "正念冥想",
          description: "学会通过正念练习管理压力和情绪",
          icon: "🧘",
          category: "wellbeing",
          tier: 1,
          position: { x: 100, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "wellbeing",
              value: 2,
              description: "身心健康达到2级",
            },
          ],
          benefits: ["压力管理能力提升", "情绪更加稳定", "专注力增强"],
          isUnlocked: false,
          progress: 0,
        },
        {
          id: "energy_management",
          name: "精力管理",
          description: "学会识别和管理自己的精力周期",
          icon: "⚡",
          category: "wellbeing",
          tier: 1,
          position: { x: 300, y: 50 },
          prerequisites: [],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "wellbeing",
              value: 5,
              description: "身心健康达到5级",
            },
          ],
          benefits: ["工作效率提升", "疲劳感减少", "生活节奏更健康"],
          isUnlocked: false,
          progress: 0,
        },
        {
          id: "work_life_balance",
          name: "工作生活平衡",
          description: "建立健康的工作与生活边界",
          icon: "⚖️",
          category: "wellbeing",
          tier: 2,
          position: { x: 200, y: 150 },
          prerequisites: ["mindfulness", "energy_management"],
          unlockConditions: [
            {
              type: "level",
              dimensionId: "wellbeing",
              value: 12,
              description: "身心健康达到12级",
            },
          ],
          benefits: ["生活满意度提升", "工作压力减少", "人际关系改善"],
          isUnlocked: false,
          progress: 0,
        },
      ],
    },
  ]

  // 检查是否在浏览器环境
  private isClient(): boolean {
    return typeof window !== "undefined"
  }

  // 获取所有技能分类
  getAllCategories(): SkillCategory[] {
    if (!this.isClient()) {
      return this.categories
    }

    const saved = localStorage.getItem("skillTree")
    if (saved) {
      return JSON.parse(saved)
    }
    return this.categories
  }

  // 保存技能树
  saveSkillTree(categories: SkillCategory[]): void {
    if (!this.isClient()) return
    localStorage.setItem("skillTree", JSON.stringify(categories))
  }

  // 获取特定分类的技能
  getCategorySkills(categoryId: string): SkillNode[] {
    const categories = this.getAllCategories()
    const category = categories.find((c) => c.id === categoryId)
    return category?.nodes || []
  }

  // 获取所有技能节点
  getAllSkills(): SkillNode[] {
    const categories = this.getAllCategories()
    return categories.flatMap((c) => c.nodes)
  }

  // 检查技能解锁条件
  checkSkillUnlockConditions(skillId: string): { canUnlock: boolean; progress: number; missingConditions: string[] } {
    const skill = this.getSkill(skillId)
    if (!skill) return { canUnlock: false, progress: 0, missingConditions: ["技能不存在"] }

    // 检查前置技能
    const allSkills = this.getAllSkills()
    const missingPrerequisites = skill.prerequisites.filter((prereqId) => {
      const prereq = allSkills.find((s) => s.id === prereqId)
      return !prereq?.isUnlocked
    })

    if (missingPrerequisites.length > 0) {
      return {
        canUnlock: false,
        progress: 0,
        missingConditions: missingPrerequisites.map((id) => `需要��解锁: ${allSkills.find((s) => s.id === id)?.name}`),
      }
    }

    // 检查解锁条件
    const missingConditions: string[] = []
    let totalProgress = 0

    for (const condition of skill.unlockConditions) {
      let conditionMet = false
      let conditionProgress = 0

      switch (condition.type) {
        case "level":
          if (condition.dimensionId) {
            const dimension = this.getDimensionLevel(condition.dimensionId)
            conditionProgress = Math.min(dimension / condition.value, 1)
            conditionMet = dimension >= condition.value
          }
          break

        case "tasks":
          const completedTasks = this.getCompletedTasksCount()
          conditionProgress = Math.min(completedTasks / condition.value, 1)
          conditionMet = completedTasks >= condition.value
          break

        case "streak":
          const currentStreak = this.getCurrentStreak()
          conditionProgress = Math.min(currentStreak / condition.value, 1)
          conditionMet = currentStreak >= condition.value
          break

        case "time":
          const focusTime = this.getTotalFocusTime()
          conditionProgress = Math.min(focusTime / condition.value, 1)
          conditionMet = focusTime >= condition.value
          break

        case "achievement":
          const achievements = this.getUnlockedAchievements()
          conditionProgress = achievements >= condition.value ? 1 : 0
          conditionMet = achievements >= condition.value
          break
      }

      totalProgress += conditionProgress

      if (!conditionMet) {
        missingConditions.push(condition.description)
      }
    }

    const averageProgress = totalProgress / skill.unlockConditions.length
    const canUnlock = missingConditions.length === 0

    return {
      canUnlock,
      progress: averageProgress * 100,
      missingConditions,
    }
  }

  // 解锁技能
  unlockSkill(skillId: string): boolean {
    if (!this.isClient()) return false

    const { canUnlock } = this.checkSkillUnlockConditions(skillId)
    if (!canUnlock) return false

    const categories = this.getAllCategories()
    let skillFound = false

    categories.forEach((category) => {
      const skill = category.nodes.find((s) => s.id === skillId)
      if (skill) {
        skill.isUnlocked = true
        skill.unlockedAt = new Date().toISOString()
        skill.progress = 100
        skillFound = true
      }
    })

    if (skillFound) {
      this.saveSkillTree(categories)
      return true
    }

    return false
  }

  // 获取特定技能
  getSkill(skillId: string): SkillNode | null {
    const allSkills = this.getAllSkills()
    return allSkills.find((s) => s.id === skillId) || null
  }

  // 更新所有技能的解锁进度
  updateAllSkillProgress(): void {
    if (!this.isClient()) return

    const categories = this.getAllCategories()
    let updated = false

    categories.forEach((category) => {
      category.nodes.forEach((skill) => {
        if (!skill.isUnlocked) {
          const { progress } = this.checkSkillUnlockConditions(skill.id)
          if (skill.progress !== progress) {
            skill.progress = progress
            updated = true
          }
        }
      })
    })

    if (updated) {
      this.saveSkillTree(categories)
    }
  }

  // 获取已解锁技能统计
  getSkillStats(): {
    totalSkills: number
    unlockedSkills: number
    skillsByCategory: Record<string, { total: number; unlocked: number }>
  } {
    const categories = this.getAllCategories()
    const skillsByCategory: Record<string, { total: number; unlocked: number }> = {}

    let totalSkills = 0
    let unlockedSkills = 0

    categories.forEach((category) => {
      const total = category.nodes.length
      const unlocked = category.nodes.filter((s) => s.isUnlocked).length

      skillsByCategory[category.id] = { total, unlocked }
      totalSkills += total
      unlockedSkills += unlocked
    })

    return {
      totalSkills,
      unlockedSkills,
      skillsByCategory,
    }
  }

  // 辅助方法 - 获取维度等级
  private getDimensionLevel(dimensionId: string): number {
    if (!this.isClient()) return 1

    const dimensions = JSON.parse(localStorage.getItem("growthDimensions") || "[]")
    const dimension = dimensions.find((d: any) => d.id === dimensionId)
    return dimension?.currentLevel || 1
  }

  // 辅助方法 - 获取完成任务数
  private getCompletedTasksCount(): number {
    if (!this.isClient()) return 0

    const tasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
    return tasks.length
  }

  // 辅助方法 - 获取当前连击
  private getCurrentStreak(): number {
    if (!this.isClient()) return 0

    return Number.parseInt(localStorage.getItem("currentStreak") || "0")
  }

  // 辅助方法 - 获取总专注时间
  private getTotalFocusTime(): number {
    if (!this.isClient()) return 0

    return Number.parseInt(localStorage.getItem("totalFocusTime") || "0")
  }

  // 辅助方法 - 获取解锁成就数
  private getUnlockedAchievements(): number {
    if (!this.isClient()) return 0

    const achievements = JSON.parse(localStorage.getItem("userAchievements") || "[]")
    return achievements.length
  }
}

export const skillTree = new SkillTree()
