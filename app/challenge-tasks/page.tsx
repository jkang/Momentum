"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Target, Clock, Star, CheckCircle, ArrowLeft, Home } from "lucide-react"

interface ChallengeTask {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: string
  selected: boolean
}

interface UserProfile {
  name: string
  procrastinationAreas: string[]
  procrastinationReasons: string[]
  motivationTypes: string[]
}

export default function ChallengeTasksPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  // 根据用户档案生成个性化的挑战任务
  const generatePersonalizedTasks = (profile: UserProfile): ChallengeTask[] => {
    const baseTasks: ChallengeTask[] = [
      {
        id: "thesis-chapter",
        title: "完成毕业论文最后一章",
        description: "专注写作，完成学术生涯的重要里程碑",
        category: "学习/工作任务",
        difficulty: "hard",
        estimatedTime: "2-3周",
        selected: false,
      },
      {
        id: "morning-routine",
        title: "建立晨间例行公事",
        description: "每天早上7点起床，进行30分钟的晨间活动",
        category: "健康习惯养成",
        difficulty: "medium",
        estimatedTime: "21天",
        selected: false,
      },
      {
        id: "room-organization",
        title: "整理和装饰房间",
        description: "创造一个舒适、有序的生活空间",
        category: "家务整理",
        difficulty: "easy",
        estimatedTime: "1周",
        selected: false,
      },
      {
        id: "skill-learning",
        title: "学习一项新技能",
        description: "选择一个感兴趣的技能，制定学习计划",
        category: "个人成长项目",
        difficulty: "medium",
        estimatedTime: "1个月",
        selected: false,
      },
      {
        id: "social-connection",
        title: "重新联系老朋友",
        description: "主动联系3个很久没联系的朋友",
        category: "社交活动参与",
        difficulty: "easy",
        estimatedTime: "1周",
        selected: false,
      },
      {
        id: "creative-project",
        title: "完成一个创意项目",
        description: "发挥创造力，完成一个让自己满意的作品",
        category: "创意兴趣爱好",
        difficulty: "medium",
        estimatedTime: "2-4周",
        selected: false,
      },
    ]

    // 根据用户的拖延领域推荐相关任务
    return baseTasks.filter((task) => profile.procrastinationAreas.includes(task.category))
  }

  const [availableTasks, setAvailableTasks] = useState<ChallengeTask[]>([])

  useEffect(() => {
    // 检查用户档案
    const profileData = localStorage.getItem("userProfile")
    if (!profileData) {
      router.push("/welcome-newuser")
      return
    }

    try {
      const profile = JSON.parse(profileData)
      setUserProfile(profile)
      setAvailableTasks(generatePersonalizedTasks(profile))
    } catch (error) {
      console.error("解析用户档案失败:", error)
      router.push("/welcome-newuser")
    }
  }, [router])

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleStartJourney = () => {
    if (selectedTasks.length === 0) return

    // 保存选择的挑战任务
    const challengeTasks = availableTasks.filter((task) => selectedTasks.includes(task.id))
    localStorage.setItem("challengeTasks", JSON.stringify(challengeTasks))
    localStorage.setItem("onboardingCompleted", "true")

    // 跳转到主页面
    router.push("/")
  }

  const handleSkipToHome = () => {
    // 跳过挑战任务设置，直接进入主页
    localStorage.setItem("challengeTasks", JSON.stringify([]))
    localStorage.setItem("onboardingCompleted", "true")

    // 跳转到主页面
    router.push("/")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-sage-green bg-sage-light"
      case "medium":
        return "text-sunrise-coral bg-sunrise-coral/10"
      case "hard":
        return "text-gentle-blue bg-gentle-blue/10"
      default:
        return "text-soft-gray bg-light-gray"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "轻松"
      case "medium":
        return "适中"
      case "hard":
        return "挑战"
      default:
        return "未知"
    }
  }

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-warm-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-soft-gray">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-warm-off-white/80 backdrop-blur-sm p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-soft-gray">设置挑战任务</h1>
          <button
            onClick={handleSkipToHome}
            className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
            title="跳过设置，直接进入主页"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow px-6 pt-4 pb-8">
        {currentStep === 1 && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-sunrise-coral/10 rounded-full mb-4">
                <Target className="w-8 h-8 text-sunrise-coral" />
              </div>
              <h2 className="text-xl font-bold text-soft-gray mb-2">{userProfile.name}，让我们开始第一个挑战吧！</h2>
              <p className="text-soft-gray/70 text-sm leading-relaxed">
                根据你刚才的回答，我为你推荐了一些挑战任务。选择1-2个你最想完成的，我们一起开始行动！
              </p>
            </div>

            <div className="space-y-4">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskToggle(task.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTasks.includes(task.id)
                      ? "border-sage-green bg-sage-light/50"
                      : "border-light-gray bg-white hover:border-sage-green/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-soft-gray flex-1">{task.title}</h3>
                    <div className="flex items-center ml-3">
                      {selectedTasks.includes(task.id) && <CheckCircle className="w-5 h-5 text-sage-green" />}
                    </div>
                  </div>

                  <p className="text-soft-gray/80 text-sm mb-4 leading-relaxed">{task.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}
                      >
                        {getDifficultyText(task.difficulty)}
                      </span>
                      <div className="flex items-center text-soft-gray/60 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {availableTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-soft-gray/60" />
                </div>
                <p className="text-soft-gray/70 mb-4">暂时没有推荐的任务，你可以稍后自己创建挑战。</p>
                <button
                  onClick={handleSkipToHome}
                  className="bg-sage-green text-white px-6 py-3 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors"
                >
                  直接进入主页
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && selectedTasks.length > 0 && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-sage-light rounded-full mb-4">
                <Star className="w-8 h-8 text-sage-green" />
              </div>
              <h2 className="text-xl font-bold text-soft-gray mb-2">太棒了！</h2>
              <p className="text-soft-gray/70 text-sm leading-relaxed">
                你已经选择了 {selectedTasks.length} 个挑战任务。我会陪伴你一步步完成它们，让我们开始这段成长之旅吧！
              </p>
            </div>

            <div className="space-y-4">
              {availableTasks
                .filter((task) => selectedTasks.includes(task.id))
                .map((task, index) => (
                  <div key={task.id} className="bg-white rounded-2xl p-5 shadow-soft">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-sage-green text-white flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-soft-gray">{task.title}</h3>
                    </div>
                    <p className="text-soft-gray/80 text-sm mb-3">{task.description}</p>
                    <div className="flex items-center text-soft-gray/60 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      预计用时：{task.estimatedTime}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 bg-sage-light/70 rounded-2xl p-5">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                  <div className="text-white text-lg">🌱</div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-soft-gray mb-2">小M的贴心提醒</p>
                  <p className="text-soft-gray/80 text-sm leading-relaxed">
                    记住，每一个大目标都是由小步骤组成的。我会帮你把这些挑战拆解成容易完成的小任务，让你每天都能感受到进步的喜悦。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 pb-8 pt-4">
        <div className="flex gap-3">
          {currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-4 border border-light-gray rounded-2xl text-soft-gray hover:bg-light-gray transition-colors"
            >
              重新选择
            </button>
          )}

          {currentStep === 1 && (
            <button
              onClick={handleSkipToHome}
              className="px-6 py-4 border border-light-gray rounded-2xl text-soft-gray hover:bg-light-gray transition-colors flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              跳过设置
            </button>
          )}

          <button
            onClick={() => {
              if (currentStep === 1 && selectedTasks.length > 0) {
                setCurrentStep(2)
              } else if (currentStep === 2) {
                handleStartJourney()
              }
            }}
            disabled={selectedTasks.length === 0}
            className="flex-1 bg-sage-green text-white py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? `确认选择 (${selectedTasks.length})` : "开始我的成长之旅 ✨"}
          </button>
        </div>
      </footer>
    </div>
  )
}
