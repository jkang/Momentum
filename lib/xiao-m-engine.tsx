"use client"

// 小M的对话引擎
export interface DialogueContext {
  userMood: "anxious" | "overwhelmed" | "motivated" | "confused" | "tired" | "neutral"
  taskType: "work" | "study" | "life" | "health" | "relationship"
  completedTasks: number
  lastActiveTime: string
}

export interface DialogueResponse {
  message: string
  followUp?: string
  mood: "happy" | "caring" | "thinking" | "celebrating"
  actionSuggestion?: {
    text: string
    action: "create_task" | "take_break" | "reflect" | "celebrate"
  }
}

class XiaoMEngine {
  // 主动关怀对话
  getProactiveGreeting(context: DialogueContext): DialogueResponse {
    const now = new Date()
    const hour = now.getHours()
    const lastActive = new Date(context.lastActiveTime)
    const daysSinceActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    // 根据时间和用户状态生成问候
    if (daysSinceActive > 3) {
      return {
        message: "好久不见！我有点想你了 😊 最近过得怎么样？",
        followUp: "有什么新的挑战需要我们一起面对吗？",
        mood: "caring",
      }
    }

    if (hour < 9) {
      return {
        message: "早上好！新的一天开始了 ☀️",
        followUp: "今天有什么想要完成的小目标吗？",
        mood: "happy",
        actionSuggestion: {
          text: "制定今日计划",
          action: "create_task",
        },
      }
    }

    if (hour > 22) {
      return {
        message: "夜深了，记得早点休息哦 🌙",
        followUp: "今天有什么值得庆祝的小成就吗？",
        mood: "caring",
      }
    }

    return {
      message: "嗨！我在这里陪着你 😊",
      followUp: "有什么想聊的吗？",
      mood: "happy",
    }
  }

  // 心理探寻对话
  getExplorationQuestions(userMood: DialogueContext["userMood"]): DialogueResponse {
    const questions = {
      anxious: {
        message: "我感觉到你可能有些焦虑，这很正常的 🤗",
        followUp: "能跟我说说是什么让你感到不安吗？有时候说出来会好一些。",
        mood: "caring" as const,
      },
      overwhelmed: {
        message: "感觉事情太多了是吗？我懂这种感觉 😔",
        followUp: "我们可以一起把这些事情理一理，一件一件来解决，你觉得呢？",
        mood: "caring" as const,
        actionSuggestion: {
          text: "开始整理任务",
          action: "create_task" as const,
        },
      },
      confused: {
        message: "遇到困惑很正常，说明你在思考 🤔",
        followUp: "想跟我聊聊是什么让你感到困惑吗？也许我们能一起找到答案。",
        mood: "thinking" as const,
      },
      tired: {
        message: "你辛苦了，感觉累了就要好好休息 💙",
        followUp: "要不要先放下手头的事，给自己一点时间？",
        mood: "caring" as const,
        actionSuggestion: {
          text: "休息一下",
          action: "take_break" as const,
        },
      },
      motivated: {
        message: "看到你这么有动力，我也很开心！✨",
        followUp: "趁着这股劲头，我们来制定一个小计划怎么样？",
        mood: "happy" as const,
        actionSuggestion: {
          text: "制定行动计划",
          action: "create_task" as const,
        },
      },
      neutral: {
        message: "今天感觉还不错吧？😊",
        followUp: "有什么想要尝试或者完成的事情吗？",
        mood: "happy" as const,
      },
    }

    return questions[userMood]
  }

  // 认知重塑对话
  getCognitiveReframing(negativeThought: string): DialogueResponse {
    const reframingPatterns = [
      {
        pattern: /太难了|做不到|不可能/,
        response: {
          message: "我理解这件事看起来很有挑战性 🤗",
          followUp: "但是，每个大目标都是由小步骤组成的。我们可以先从最简单的一步开始，你觉得呢？",
          mood: "caring" as const,
        },
      },
      {
        pattern: /没时间|太忙了/,
        response: {
          message: "时间确实很宝贵，我懂你的感受 ⏰",
          followUp: "不过，有时候哪怕5分钟的小行动，也能带来意想不到的进展。要不要试试？",
          mood: "thinking" as const,
        },
      },
      {
        pattern: /失败|搞砸了|不行/,
        response: {
          message: "每个人都会遇到挫折，这不代表你不行 💪",
          followUp: "失败只是学习的一部分。我们一起看看从中能学到什么，然后继续前进？",
          mood: "caring" as const,
        },
      },
    ]

    for (const pattern of reframingPatterns) {
      if (pattern.pattern.test(negativeThought)) {
        return pattern.response
      }
    }

    return {
      message: "我听到了你的担心，这些感受都很真实 🤗",
      followUp: "不过，也许我们可以从另一个角度来看看这件事？",
      mood: "caring",
    }
  }

  // 庆祝完成任务
  getCelebrationMessage(completedTasks: number): DialogueResponse {
    if (completedTasks === 1) {
      return {
        message: "哇！你完成了第一个任务！🎉",
        followUp: "这是一个很棒的开始，我为你感到骄傲！",
        mood: "celebrating",
      }
    }

    if (completedTasks % 5 === 0) {
      return {
        message: `太厉害了！你已经完成了${completedTasks}个任务！🏆`,
        followUp: "你的坚持让我很感动，继续保持这个节奏！",
        mood: "celebrating",
      }
    }

    return {
      message: "又完成一个！你真的很棒！✨",
      followUp: "每一个小步骤都在让你变得更好，加油！",
      mood: "celebrating",
    }
  }
}

export const xiaoMEngine = new XiaoMEngine()
