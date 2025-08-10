"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"

const interests = [
  { id: "study", label: "学习成长", emoji: "📚" },
  { id: "work", label: "工作效率", emoji: "💼" },
  { id: "health", label: "健康生活", emoji: "🏃‍♀️" },
  { id: "hobby", label: "兴趣爱好", emoji: "🎨" },
  { id: "social", label: "人际关系", emoji: "👥" },
  { id: "finance", label: "理财规划", emoji: "💰" },
]

const challenges = [
  { id: "procrastination", label: "拖延症", description: "总是把事情推到最后一刻" },
  { id: "perfectionism", label: "完美主义", description: "害怕做得不够好而迟迟不开始" },
  { id: "overwhelm", label: "任务过载", description: "面对太多任务不知从何开始" },
  { id: "motivation", label: "缺乏动力", description: "知道该做什么但提不起劲" },
  { id: "focus", label: "注意力分散", description: "容易被其他事情打断" },
  { id: "anxiety", label: "焦虑情绪", description: "对未来感到担忧和不安" },
]

const goals = [
  { id: "daily", label: "每日小目标", description: "建立稳定的日常习惯" },
  { id: "weekly", label: "每周挑战", description: "完成有意义的周目标" },
  { id: "monthly", label: "月度成长", description: "实现重要的人生里程碑" },
  { id: "project", label: "项目推进", description: "完成具体的工作或学习项目" },
]

export default function WelcomeNewUserPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const router = useRouter()

  const steps = [
    {
      title: "欢迎来到即刻行动",
      subtitle: "让我们开始你的成长之旅",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-36 h-36 bg-gradient-to-br from-sage-green to-sage-green/80 rounded-full flex items-center justify-center shadow-soft mb-4">
              <div className="text-8xl">🌱</div>
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="请输入你的名字"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 border border-light-gray rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
            />
            <p className="text-sm text-soft-gray/70 text-center">我们会用这个名字来个性化你的体验</p>
          </div>
        </div>
      ),
    },
    {
      title: "你最关心哪些领域？",
      subtitle: "选择你想要改善的生活方面",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => {
                if (selectedInterests.includes(interest.id)) {
                  setSelectedInterests(selectedInterests.filter((id) => id !== interest.id))
                } else {
                  setSelectedInterests([...selectedInterests, interest.id])
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedInterests.includes(interest.id)
                  ? "border-sage-green bg-sage-light text-sage-dark"
                  : "border-light-gray bg-white text-soft-gray hover:border-sage-green/50"
              }`}
            >
              <div className="text-2xl mb-2">{interest.emoji}</div>
              <div className="text-sm font-medium">{interest.label}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "你面临的主要挑战是？",
      subtitle: "了解你的困难，我们才能更好地帮助你",
      content: (
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => {
                if (selectedChallenges.includes(challenge.id)) {
                  setSelectedChallenges(selectedChallenges.filter((id) => id !== challenge.id))
                } else {
                  setSelectedChallenges([...selectedChallenges, challenge.id])
                }
              }}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedChallenges.includes(challenge.id)
                  ? "border-sage-green bg-sage-light"
                  : "border-light-gray bg-white hover:border-sage-green/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-soft-gray">{challenge.label}</div>
                  <div className="text-sm text-soft-gray/70 mt-1">{challenge.description}</div>
                </div>
                {selectedChallenges.includes(challenge.id) && <Check className="w-5 h-5 text-sage-green" />}
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "你希望如何开始？",
      subtitle: "选择适合你的成长节奏",
      content: (
        <div className="space-y-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                if (selectedGoals.includes(goal.id)) {
                  setSelectedGoals(selectedGoals.filter((id) => id !== goal.id))
                } else {
                  setSelectedGoals([...selectedGoals, goal.id])
                }
              }}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedGoals.includes(goal.id)
                  ? "border-sage-green bg-sage-light"
                  : "border-light-gray bg-white hover:border-sage-green/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-soft-gray">{goal.label}</div>
                  <div className="text-sm text-soft-gray/70 mt-1">{goal.description}</div>
                </div>
                {selectedGoals.includes(goal.id) && <Check className="w-5 h-5 text-sage-green" />}
              </div>
            </button>
          ))}
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 保存用户信息
      const userProfile = {
        name: userName,
        interests: selectedInterests,
        challenges: selectedChallenges,
        goals: selectedGoals,
        completedAt: new Date().toISOString(),
      }
      localStorage.setItem("userProfile", JSON.stringify(userProfile))
      localStorage.setItem("hasCompletedOnboarding", "true")

      // 跳转到挑战任务设置页面
      router.push("/challenge-tasks")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userName.trim().length > 0
      case 1:
        return selectedInterests.length > 0
      case 2:
        return selectedChallenges.length > 0
      case 3:
        return selectedGoals.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-warm-off-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-light-gray sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-sage-green" : "bg-light-gray"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-soft-gray mb-2">{steps[currentStep].title}</h1>
            <p className="text-soft-gray/70">{steps[currentStep].subtitle}</p>
          </div>
          <div className="mb-8">{steps[currentStep].content}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-light-gray p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full bg-sage-green hover:bg-sage-dark text-black py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? "开始我的成长之旅" : "下一步"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
