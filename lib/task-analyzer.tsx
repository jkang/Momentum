"use client"

// 智能任务分析引擎
export interface TaskAnalysis {
  type: "work" | "study" | "life" | "health" | "relationship" | "creative"
  complexity: "simple" | "medium" | "complex"
  timeEstimate: number // 预估总时间（分钟）
  difficulty: 1 | 2 | 3 | 4 | 5
  keywords: string[]
  category: string
}

export interface TaskStep {
  id: string
  title: string
  description: string
  timeEstimate: number
  difficulty: 1 | 2 | 3
  dependencies: string[]
  tips: string[]
  type: "preparation" | "execution" | "review" | "communication"
}

export interface DecomposedTask {
  originalTask: string
  analysis: TaskAnalysis
  steps: TaskStep[]
  totalTime: number
  suggestions: string[]
}

class TaskAnalyzer {
  // 任务类型识别
  analyzeTask(taskDescription: string): TaskAnalysis {
    const text = taskDescription.toLowerCase()

    // 关键词匹配
    const workKeywords = ["报告", "会议", "项目", "客户", "销售", "管理", "分析", "策划", "汇报", "预算"]
    const studyKeywords = ["学习", "考试", "课程", "论文", "研究", "阅读", "复习", "作业", "知识", "技能"]
    const lifeKeywords = ["购物", "清洁", "整理", "搬家", "装修", "旅行", "计划", "安排", "家务", "生活"]
    const healthKeywords = ["运动", "健身", "减肥", "体检", "医院", "锻炼", "饮食", "睡眠", "健康", "养生"]
    const relationshipKeywords = ["朋友", "家人", "恋人", "同事", "社交", "聚会", "约会", "沟通", "关系", "交流"]
    const creativeKeywords = ["设计", "创作", "写作", "绘画", "音乐", "视频", "摄影", "艺术", "创意", "作品"]

    let type: TaskAnalysis["type"] = "work"
    let category = "工作任务"

    if (workKeywords.some((keyword) => text.includes(keyword))) {
      type = "work"
      category = "工作任务"
    } else if (studyKeywords.some((keyword) => text.includes(keyword))) {
      type = "study"
      category = "学习成长"
    } else if (lifeKeywords.some((keyword) => text.includes(keyword))) {
      type = "life"
      category = "生活事务"
    } else if (healthKeywords.some((keyword) => text.includes(keyword))) {
      type = "health"
      category = "健康管理"
    } else if (relationshipKeywords.some((keyword) => text.includes(keyword))) {
      type = "relationship"
      category = "人际关系"
    } else if (creativeKeywords.some((keyword) => text.includes(keyword))) {
      type = "creative"
      category = "创意项目"
    }

    // 复杂度分析
    let complexity: TaskAnalysis["complexity"] = "medium"
    let timeEstimate = 120 // 默认2小时
    let difficulty: TaskAnalysis["difficulty"] = 3

    if (text.includes("简单") || text.includes("快速") || text.length < 10) {
      complexity = "simple"
      timeEstimate = 30
      difficulty = 2
    } else if (text.includes("复杂") || text.includes("详细") || text.includes("深入") || text.length > 50) {
      complexity = "complex"
      timeEstimate = 240
      difficulty = 4
    }

    // 提取关键词
    const keywords = [
      ...workKeywords.filter((k) => text.includes(k)),
      ...studyKeywords.filter((k) => text.includes(k)),
      ...lifeKeywords.filter((k) => text.includes(k)),
      ...healthKeywords.filter((k) => text.includes(k)),
      ...relationshipKeywords.filter((k) => text.includes(k)),
      ...creativeKeywords.filter((k) => text.includes(k)),
    ]

    return {
      type,
      complexity,
      timeEstimate,
      difficulty,
      keywords,
      category,
    }
  }

  // 智能任务拆解
  decomposeTask(taskDescription: string, userPreferences?: any): DecomposedTask {
    const analysis = this.analyzeTask(taskDescription)
    const steps = this.generateSteps(taskDescription, analysis)
    const totalTime = steps.reduce((sum, step) => sum + step.timeEstimate, 0)
    const suggestions = this.generateSuggestions(analysis)

    return {
      originalTask: taskDescription,
      analysis,
      steps,
      totalTime,
      suggestions,
    }
  }

  // 生成具体步骤
  private generateSteps(task: string, analysis: TaskAnalysis): TaskStep[] {
    const templates = this.getTaskTemplates(analysis.type)
    const baseSteps = templates[analysis.complexity] || templates.medium

    return baseSteps.map((template, index) => ({
      id: `step-${index + 1}`,
      title: this.personalizeStepTitle(template.title, task),
      description: this.personalizeStepDescription(template.description, task),
      timeEstimate: this.adjustTimeEstimate(template.timeEstimate, analysis.complexity),
      difficulty: template.difficulty,
      dependencies: template.dependencies,
      tips: this.generateTips(template.type, analysis.type),
      type: template.type,
    }))
  }

  // 任务模板库
  private getTaskTemplates(type: TaskAnalysis["type"]) {
    const templates = {
      work: {
        simple: [
          {
            title: "明确任务目标",
            description: "花5分钟明确具体要完成什么",
            timeEstimate: 5,
            difficulty: 1,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "收集必要信息",
            description: "收集完成任务所需的基础信息",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "执行核心工作",
            description: "专注完成主要工作内容",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "检查和完善",
            description: "检查工作质量，进行必要的完善",
            timeEstimate: 10,
            difficulty: 1,
            dependencies: ["step-3"],
            type: "review",
          },
        ],
        medium: [
          {
            title: "任务分析和规划",
            description: "分析任务需求，制定详细计划",
            timeEstimate: 20,
            difficulty: 2,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "资料收集和整理",
            description: "收集相关资料，进行分类整理",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "核心内容创建",
            description: "开始创建或执行主要内容",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "内容完善和优化",
            description: "完善细节，优化整体质量",
            timeEstimate: 30,
            difficulty: 3,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "质量检查",
            description: "全面检查，确保符合要求",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: ["step-4"],
            type: "review",
          },
          {
            title: "提交或汇报",
            description: "按要求提交成果或进行汇报",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: ["step-5"],
            type: "communication",
          },
        ],
        complex: [
          {
            title: "深度需求分析",
            description: "深入分析任务背景和具体需求",
            timeEstimate: 30,
            difficulty: 3,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "制定详细方案",
            description: "制定完整的执行方案和时间计划",
            timeEstimate: 45,
            difficulty: 3,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "关键信息调研",
            description: "进行深入的信息调研和分析",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "preparation",
          },
          {
            title: "核心框架搭建",
            description: "搭建整体框架和主要结构",
            timeEstimate: 90,
            difficulty: 4,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "详细内容填充",
            description: "逐步填充各部分详细内容",
            timeEstimate: 120,
            difficulty: 4,
            dependencies: ["step-4"],
            type: "execution",
          },
          {
            title: "多轮优化完善",
            description: "进行多轮检查和优化",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-5"],
            type: "review",
          },
          {
            title: "同事反馈收集",
            description: "收集同事或上级的反馈意见",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-6"],
            type: "communication",
          },
          {
            title: "最终完善提交",
            description: "根据反馈进行最终完善并提交",
            timeEstimate: 45,
            difficulty: 3,
            dependencies: ["step-7"],
            type: "execution",
          },
        ],
      },
      study: {
        simple: [
          {
            title: "确定学习目标",
            description: "明确这次学习要达到什么目标",
            timeEstimate: 5,
            difficulty: 1,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "准备学习材料",
            description: "准备好需要的书籍、笔记等材料",
            timeEstimate: 10,
            difficulty: 1,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "专注学习",
            description: "专心学习核心内容",
            timeEstimate: 45,
            difficulty: 2,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "总结回顾",
            description: "总结学到的要点，加深记忆",
            timeEstimate: 10,
            difficulty: 2,
            dependencies: ["step-3"],
            type: "review",
          },
        ],
        medium: [
          {
            title: "制定学习计划",
            description: "制定详细的学习计划和时间安排",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "预习和准备",
            description: "预习相关内容，准备学习环境",
            timeEstimate: 20,
            difficulty: 2,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "深入学习",
            description: "深入学习主要内容，做好笔记",
            timeEstimate: 90,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "练习和应用",
            description: "通过练习巩固所学知识",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "复习和总结",
            description: "复习重点，总结学习成果",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-4"],
            type: "review",
          },
        ],
        complex: [
          {
            title: "学习目标分解",
            description: "将大的学习目标分解为具体的小目标",
            timeEstimate: 20,
            difficulty: 2,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "资源收集整理",
            description: "收集各种学习资源，建立知识体系",
            timeEstimate: 40,
            difficulty: 3,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "基础知识学习",
            description: "学习基础概念和理论知识",
            timeEstimate: 120,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "进阶内容学习",
            description: "学习更深入的内容和应用",
            timeEstimate: 150,
            difficulty: 4,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "实践和练习",
            description: "通过大量练习巩固知识",
            timeEstimate: 120,
            difficulty: 4,
            dependencies: ["step-4"],
            type: "execution",
          },
          {
            title: "知识体系整理",
            description: "整理完整的知识体系和笔记",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-5"],
            type: "review",
          },
          {
            title: "测试和评估",
            description: "测试学习效果，找出薄弱环节",
            timeEstimate: 45,
            difficulty: 3,
            dependencies: ["step-6"],
            type: "review",
          },
        ],
      },
      life: {
        simple: [
          {
            title: "列出具体事项",
            description: "列出需要完成的具体事项",
            timeEstimate: 5,
            difficulty: 1,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "准备必需品",
            description: "准备完成任务需要的物品",
            timeEstimate: 10,
            difficulty: 1,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "逐项完成",
            description: "按计划逐项完成各个事项",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "检查确认",
            description: "检查是否都已完成",
            timeEstimate: 5,
            difficulty: 1,
            dependencies: ["step-3"],
            type: "review",
          },
        ],
        medium: [
          {
            title: "详细规划",
            description: "制定详细的执行计划",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "资源准备",
            description: "准备所需的时间、物品等资源",
            timeEstimate: 20,
            difficulty: 2,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "分步执行",
            description: "按计划分步骤执行",
            timeEstimate: 90,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "execution",
          },
          {
            title: "调整优化",
            description: "根据实际情况调整和优化",
            timeEstimate: 30,
            difficulty: 2,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "完成确认",
            description: "确认所有事项都已妥善完成",
            timeEstimate: 15,
            difficulty: 2,
            dependencies: ["step-4"],
            type: "review",
          },
        ],
        complex: [
          {
            title: "全面分析",
            description: "全面分析任务的各个方面",
            timeEstimate: 30,
            difficulty: 3,
            dependencies: [],
            type: "preparation",
          },
          {
            title: "制定方案",
            description: "制定详细的执行方案",
            timeEstimate: 45,
            difficulty: 3,
            dependencies: ["step-1"],
            type: "preparation",
          },
          {
            title: "资源协调",
            description: "协调各种必要的资源",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-2"],
            type: "preparation",
          },
          {
            title: "分阶段执行",
            description: "分阶段有序执行各项任务",
            timeEstimate: 180,
            difficulty: 4,
            dependencies: ["step-3"],
            type: "execution",
          },
          {
            title: "过程监控",
            description: "监控执行过程，及时调整",
            timeEstimate: 60,
            difficulty: 3,
            dependencies: ["step-4"],
            type: "execution",
          },
          {
            title: "质量检查",
            description: "全面检查完成质量",
            timeEstimate: 45,
            difficulty: 3,
            dependencies: ["step-5"],
            type: "review",
          },
        ],
      },
    }

    return templates[type] || templates.work
  }

  // 个性化步骤标题
  private personalizeStepTitle(template: string, task: string): string {
    return template.replace(/任务|工作|内容/g, task.slice(0, 10))
  }

  // 个性化步骤描述
  private personalizeStepDescription(template: string, task: string): string {
    return template.replace(/任务|工作/g, `"${task.slice(0, 15)}..."`)
  }

  // 调整时间估算
  private adjustTimeEstimate(baseTime: number, complexity: TaskAnalysis["complexity"]): number {
    const multipliers = { simple: 0.8, medium: 1, complex: 1.3 }
    return Math.round(baseTime * multipliers[complexity])
  }

  // 生成小贴士
  private generateTips(stepType: string, taskType: TaskAnalysis["type"]): string[] {
    const tipDatabase = {
      preparation: {
        work: ["可以先和同事讨论一下思路", "准备一个安静的工作环境", "关闭不必要的通知干扰"],
        study: ["选择精神状态最好的时间段", "准备好笔和纸做记录", "找一个舒适的学习环境"],
        life: ["列一个清单避免遗漏", "提前准备好需要的物品", "选择合适的时间进行"],
      },
      execution: {
        work: ["专注25分钟，然后休息5分钟", "遇到困难及时寻求帮助", "保持积极的心态"],
        study: ["主动思考，不要被动接受", "及时记录重要的点", "适当休息保持专注"],
        life: ["一次只做一件事", "保持耐心和细心", "适时奖励自己的进步"],
      },
      review: {
        work: ["站在用户角度检查质量", "请同事帮忙review", "对照最初的目标检查"],
        study: ["用自己的话总结要点", "尝试教给别人来检验理解", "制作思维导图整理知识"],
        life: ["检查是否达到预期效果", "总结经验教训", "为下次做得更好做准备"],
      },
    }

    const categoryTips = tipDatabase[stepType as keyof typeof tipDatabase]
    return categoryTips?.[taskType] || categoryTips?.work || ["保持专注，一步一步来"]
  }

  // 生成建议
  private generateSuggestions(analysis: TaskAnalysis): string[] {
    const suggestions = []

    if (analysis.complexity === "complex") {
      suggestions.push("这是一个复杂任务，建议分多天完成，避免疲劳")
    }

    if (analysis.timeEstimate > 120) {
      suggestions.push("预计需要较长时间，建议安排专门的时间块")
    }

    if (analysis.type === "work") {
      suggestions.push("工作任务建议在精神状态最好的时间段进行")
    }

    if (analysis.difficulty >= 4) {
      suggestions.push("难度较高，不要给自己太大压力，循序渐进")
    }

    return suggestions
  }
}

export const taskAnalyzer = new TaskAnalyzer()
