"use client"

// 个性化奖励池系统
export interface RewardItem {
  id: string
  title: string
  description: string
  category: "self_care" | "treat" | "activity" | "social" | "learning" | "custom"
  icon: string
  rarity: "common" | "rare" | "epic"
  unlockLevel: number
  isCustom: boolean
  createdAt?: string
}

export interface RewardHistory {
  id: string
  rewardId: string
  taskTitle: string
  earnedAt: string
  streakMultiplier: number
  achievementBonus?: string
}

class RewardPool {
  private defaultRewards: RewardItem[] = [
    // 自我关怀类
    {
      id: "tea_break",
      title: "泡一杯好茶",
      description: "给自己泡一杯喜欢的茶，慢慢品味",
      category: "self_care",
      icon: "🍵",
      rarity: "common",
      unlockLevel: 1,
      isCustom: false,
    },
    {
      id: "bath_time",
      title: "舒缓泡澡",
      description: "泡个热水澡，放松身心",
      category: "self_care",
      icon: "🛁",
      rarity: "rare",
      unlockLevel: 5,
      isCustom: false,
    },
    {
      id: "massage",
      title: "按摩放松",
      description: "给自己做个简单的肩颈按摩",
      category: "self_care",
      icon: "💆",
      rarity: "epic",
      unlockLevel: 10,
      isCustom: false,
    },

    // 美食奖励类
    {
      id: "favorite_snack",
      title: "喜欢的零食",
      description: "买一个平时舍不得买的小零食",
      category: "treat",
      icon: "🍫",
      rarity: "common",
      unlockLevel: 1,
      isCustom: false,
    },
    {
      id: "special_meal",
      title: "特别的一餐",
      description: "去喜欢的餐厅吃一顿好的",
      category: "treat",
      icon: "🍽️",
      rarity: "rare",
      unlockLevel: 3,
      isCustom: false,
    },
    {
      id: "dessert_treat",
      title: "甜品时光",
      description: "品尝一份精致的甜品",
      category: "treat",
      icon: "🧁",
      rarity: "epic",
      unlockLevel: 8,
      isCustom: false,
    },

    // 活动类
    {
      id: "short_walk",
      title: "户外散步",
      description: "出门走走，呼吸新鲜空气",
      category: "activity",
      icon: "🚶",
      rarity: "common",
      unlockLevel: 1,
      isCustom: false,
    },
    {
      id: "movie_time",
      title: "电影时光",
      description: "看一部期待已久的电影",
      category: "activity",
      icon: "🎬",
      rarity: "rare",
      unlockLevel: 4,
      isCustom: false,
    },
    {
      id: "hobby_time",
      title: "兴趣时光",
      description: "花时间做自己喜欢的兴趣爱好",
      category: "activity",
      icon: "🎨",
      rarity: "epic",
      unlockLevel: 7,
      isCustom: false,
    },

    // 社交类
    {
      id: "friend_chat",
      title: "朋友聊天",
      description: "和好朋友聊聊天，分享近况",
      category: "social",
      icon: "💬",
      rarity: "common",
      unlockLevel: 2,
      isCustom: false,
    },
    {
      id: "family_time",
      title: "家人时光",
      description: "和家人一起度过温馨时光",
      category: "social",
      icon: "👨‍👩‍👧‍👦",
      rarity: "rare",
      unlockLevel: 6,
      isCustom: false,
    },

    // 学习成长类
    {
      id: "read_book",
      title: "阅读时光",
      description: "读几页喜欢的书",
      category: "learning",
      icon: "📖",
      rarity: "common",
      unlockLevel: 1,
      isCustom: false,
    },
    {
      id: "learn_skill",
      title: "技能学习",
      description: "学习一个新技能或知识点",
      category: "learning",
      icon: "🎓",
      rarity: "rare",
      unlockLevel: 5,
      isCustom: false,
    },
  ]

  // 获取可用奖励（根据用户等级）
  getAvailableRewards(userLevel: number): RewardItem[] {
    const customRewards = this.getCustomRewards()
    const allRewards = [...this.defaultRewards, ...customRewards]

    return allRewards.filter((reward) => reward.unlockLevel <= userLevel)
  }

  // 根据稀有度和连击倍数选择奖励
  selectReward(userLevel: number, streakMultiplier: number): RewardItem {
    const availableRewards = this.getAvailableRewards(userLevel)

    // 根据连击倍数调整稀有度权重
    let rarityWeights = { common: 70, rare: 25, epic: 5 }

    if (streakMultiplier >= 2.5) {
      rarityWeights = { common: 30, rare: 50, epic: 20 }
    } else if (streakMultiplier >= 2.0) {
      rarityWeights = { common: 40, rare: 45, epic: 15 }
    } else if (streakMultiplier >= 1.5) {
      rarityWeights = { common: 50, rare: 40, epic: 10 }
    }

    // 按稀有度分组
    const rewardsByRarity = {
      common: availableRewards.filter((r) => r.rarity === "common"),
      rare: availableRewards.filter((r) => r.rarity === "rare"),
      epic: availableRewards.filter((r) => r.rarity === "epic"),
    }

    // 随机选择稀有度
    const random = Math.random() * 100
    let selectedRarity: "common" | "rare" | "epic" = "common"

    if (random < rarityWeights.epic) {
      selectedRarity = "epic"
    } else if (random < rarityWeights.epic + rarityWeights.rare) {
      selectedRarity = "rare"
    }

    // 从选中稀有度中随机选择奖励
    const candidateRewards = rewardsByRarity[selectedRarity]
    if (candidateRewards.length === 0) {
      // 如果没有该稀有度的奖励，降级选择
      const fallbackRewards = availableRewards.filter((r) => r.rarity === "common")
      return fallbackRewards[Math.floor(Math.random() * fallbackRewards.length)]
    }

    return candidateRewards[Math.floor(Math.random() * candidateRewards.length)]
  }

  // 获取自定义奖励
  getCustomRewards(): RewardItem[] {
    const saved = localStorage.getItem("customRewards")
    return saved ? JSON.parse(saved) : []
  }

  // 添加自定义奖励
  addCustomReward(reward: Omit<RewardItem, "id" | "isCustom" | "createdAt">): void {
    const customRewards = this.getCustomRewards()
    const newReward: RewardItem = {
      ...reward,
      id: `custom_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    customRewards.push(newReward)
    localStorage.setItem("customRewards", JSON.stringify(customRewards))
  }

  // 删除自定义奖励
  removeCustomReward(rewardId: string): void {
    const customRewards = this.getCustomRewards()
    const filtered = customRewards.filter((r) => r.id !== rewardId)
    localStorage.setItem("customRewards", JSON.stringify(filtered))
  }

  // 保存奖励历史
  saveRewardHistory(history: Omit<RewardHistory, "id">): void {
    const saved = localStorage.getItem("rewardHistory")
    const histories: RewardHistory[] = saved ? JSON.parse(saved) : []

    const newHistory: RewardHistory = {
      ...history,
      id: `history_${Date.now()}`,
    }

    histories.unshift(newHistory) // 最新的在前面
    // 只保留最近100条记录
    if (histories.length > 100) {
      histories.splice(100)
    }

    localStorage.setItem("rewardHistory", JSON.stringify(histories))
  }

  // 获取奖励历史
  getRewardHistory(): RewardHistory[] {
    const saved = localStorage.getItem("rewardHistory")
    return saved ? JSON.parse(saved) : []
  }

  // 获取稀有度颜色
  getRarityColor(rarity: RewardItem["rarity"]): string {
    const colors = {
      common: "text-gray-600",
      rare: "text-blue-600",
      epic: "text-purple-600",
    }
    return colors[rarity]
  }

  // 获取稀有度背景色
  getRarityBgColor(rarity: RewardItem["rarity"]): string {
    const colors = {
      common: "bg-gray-100",
      rare: "bg-blue-100",
      epic: "bg-purple-100",
    }
    return colors[rarity]
  }

  // 获取分类图标
  getCategoryIcon(category: RewardItem["category"]): string {
    const icons = {
      self_care: "💆",
      treat: "🍫",
      activity: "🎯",
      social: "👥",
      learning: "📚",
      custom: "⭐",
    }
    return icons[category]
  }
}

export const rewardPool = new RewardPool()
