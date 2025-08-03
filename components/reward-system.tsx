"use client"

import { useState } from "react"
import { Gift, Star, Trophy, Heart } from "lucide-react"

interface RewardSystemProps {
  onClose: () => void
  taskTitle: string
}

const rewards = [
  { type: "self-care", icon: Heart, text: "给自己泡一杯好茶，慢慢品味", color: "text-pink-500" },
  { type: "treat", icon: Gift, text: "买一个小零食奖励自己", color: "text-purple-500" },
  { type: "rest", icon: Star, text: "看10分钟喜欢的视频放松一下", color: "text-blue-500" },
  { type: "achievement", icon: Trophy, text: "在朋友圈分享这个小成就", color: "text-yellow-500" },
  { type: "activity", icon: Gift, text: "出门走走，呼吸新鲜空气", color: "text-green-500" },
  { type: "hobby", icon: Star, text: "花15分钟做自己喜欢的事", color: "text-indigo-500" },
]

export function RewardSystem({ onClose, taskTitle }: RewardSystemProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedReward, setSelectedReward] = useState<(typeof rewards)[0] | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSpin = () => {
    setIsSpinning(true)

    setTimeout(() => {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
      setSelectedReward(randomReward)
      setIsSpinning(false)
      setShowResult(true)

      // Save reward to localStorage
      const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
      completedTasks.push({
        task: taskTitle,
        reward: randomReward.text,
        completedAt: new Date().toISOString(),
      })
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
    }, 2000)
  }

  if (showResult && selectedReward) {
    const IconComponent = selectedReward.icon
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-pop-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-sage-green to-gentle-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <IconComponent className={`w-10 h-10 ${selectedReward.color}`} />
            </div>
            <h3 className="text-xl font-bold text-soft-gray mb-2">🎉 恭喜完成任务！</h3>
            <p className="text-sm text-soft-gray/80 mb-4">"{taskTitle}"</p>
          </div>

          <div className="bg-sage-light rounded-2xl p-4 mb-6">
            <p className="text-soft-gray font-medium">你的奖励是：</p>
            <p className="text-lg font-bold text-sage-green mt-2">{selectedReward.text}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-sage-green text-white py-3 rounded-full font-semibold hover:bg-sage-green/90 transition-colors"
          >
            太棒了！
          </button>
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
        </div>

        <div className="mb-8">
          <div
            className={`w-32 h-32 border-4 border-sage-green rounded-full flex items-center justify-center mx-auto mb-4 ${isSpinning ? "animate-spin" : ""}`}
          >
            <Gift className="w-16 h-16 text-sage-green" />
          </div>
          <p className="text-soft-gray">点击转盘获得奖励！</p>
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
