"use client"

// 庆祝和鼓励系统

const COMPLETION_STATS_KEY = "momentum-completion-stats"

export interface CompletionStats {
  totalCompleted: number
  completedToday: number
  lastCompletionDate: string
  streak: number // 连续完成天数
}

// 庆祝消息库
const CELEBRATION_MESSAGES = [
  "🎉 太棒了！又完成一项任务！",
  "✨ 你真的很厉害！继续保持！",
  "🌟 每一步都在进步，为你骄傲！",
  "🚀 行动力满分！你正在变得更好！",
  "💪 看到你的坚持，真的很感动！",
  "🎯 目标达成！你的努力没有白费！",
  "🔥 热情满满！这就是行动的力量！",
  "⭐ 小步快跑，你正在创造奇迹！",
  "🎊 又一个胜利！你的改变让人惊喜！",
  "💎 每个完成都是珍贵的成长！",
  "🌈 你的坚持正在绘制美好的未来！",
  "🎈 轻松愉快地完成任务，你找到了节奏！",
  "🏆 冠军的感觉就是这样！继续前进！",
  "🌸 温柔而坚定，你的方式很棒！",
  "🎵 节拍完美！你正在谱写成功的乐章！",
  "🍀 幸运眷顾努力的人，你就是最好的证明！",
  "🌅 每个完成都是新的开始！",
  "🎪 生活因为你的行动变得精彩！",
  "🎭 你正在演绎最棒的自己！",
  "🎨 用行动描绘理想的生活，真美！"
]

// 里程碑庆祝消息
const MILESTONE_MESSAGES: Record<number, string> = {
  1: "🎉 恭喜完成第一个任务！万事开头难，你已经迈出了最重要的一步！",
  5: "🌟 已经完成5个任务了！你的行动力让人刮目相看！",
  10: "🚀 10个任务完成！你正在建立强大的行动习惯！",
  20: "💪 20个任务达成！你的坚持正在改变一切！",
  50: "🏆 50个任务里程碑！你已经是行动达人了！",
  100: "👑 100个任务完成！你就是自己生活的国王/女王！",
  200: "🌈 200个任务成就解锁！你的改变激励着所有人！",
  500: "💎 500个任务传奇！你已经成为行动的艺术家！",
  1000: "🎆 1000个任务神话！你重新定义了什么叫做坚持！"
}

// 获取完成统计
export function getCompletionStats(): CompletionStats {
  if (typeof window === "undefined") {
    return { totalCompleted: 0, completedToday: 0, lastCompletionDate: "", streak: 0 }
  }
  
  try {
    const raw = localStorage.getItem(COMPLETION_STATS_KEY)
    if (!raw) {
      return { totalCompleted: 0, completedToday: 0, lastCompletionDate: "", streak: 0 }
    }
    return JSON.parse(raw)
  } catch {
    return { totalCompleted: 0, completedToday: 0, lastCompletionDate: "", streak: 0 }
  }
}

// 保存完成统计
function saveCompletionStats(stats: CompletionStats) {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPLETION_STATS_KEY, JSON.stringify(stats))
}

// 记录任务完成
export function recordTaskCompletion(): string {
  const stats = getCompletionStats()
  const today = new Date().toISOString().slice(0, 10)
  
  // 更新统计
  const newStats: CompletionStats = {
    totalCompleted: stats.totalCompleted + 1,
    completedToday: stats.lastCompletionDate === today ? stats.completedToday + 1 : 1,
    lastCompletionDate: today,
    streak: stats.lastCompletionDate === today ? stats.streak : 
           stats.lastCompletionDate === getPreviousDay(today) ? stats.streak + 1 : 1
  }
  
  saveCompletionStats(newStats)
  
  // 检查是否是里程碑
  if (MILESTONE_MESSAGES[newStats.totalCompleted]) {
    return MILESTONE_MESSAGES[newStats.totalCompleted]
  }
  
  // 返回随机庆祝消息
  const randomIndex = Math.floor(Math.random() * CELEBRATION_MESSAGES.length)
  return CELEBRATION_MESSAGES[randomIndex]
}

// 获取前一天的日期
function getPreviousDay(dateStr: string): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

// 获取今日完成数量
export function getTodayCompletionCount(): number {
  const stats = getCompletionStats()
  const today = new Date().toISOString().slice(0, 10)
  return stats.lastCompletionDate === today ? stats.completedToday : 0
}

// 获取连续完成天数
export function getCompletionStreak(): number {
  const stats = getCompletionStats()
  return stats.streak
}
