"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Hand } from "lucide-react"

interface UserProfile {
  name: string
  procrastinationAreas: string[]
  procrastinationReasons: string[]
  motivationTypes: string[]
}

export default function WelcomeNewUserPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    procrastinationAreas: [],
    procrastinationReasons: [],
    motivationTypes: [],
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleChoiceToggle = (category: keyof UserProfile, value: string) => {
    if (category === "name") {
      setUserProfile((prev) => ({ ...prev, name: value }))
    } else {
      setUserProfile((prev) => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      }))
    }
  }

  const handleContinueToChallengeTasks = () => {
    // 保存用户档案到localStorage
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
    console.log("用户档案已保存到localStorage:", userProfile)
    // 跳转到挑战任务设置页面
    router.push("/challenge-tasks")
  }

  const canProceed = () => {
    return (
      userProfile.name.trim().length > 0 &&
      userProfile.procrastinationAreas.length > 0 &&
      userProfile.procrastinationReasons.length > 0 &&
      userProfile.motivationTypes.length > 0
    )
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-warm-off-white flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-sunrise-coral/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-sage-light/40 rounded-full blur-3xl"></div>
        <div className="relative text-center px-8">
          <div className="animate-bounce">
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-sage-green to-sage-green/80 rounded-full flex items-center justify-center">
              <div className="text-8xl">🌱</div>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h1 className="text-4xl font-extrabold text-soft-gray">即刻行动</h1>
            <p className="mt-4 text-lg text-soft-gray/70">从今天起，和拖延温柔告别</p>
          </div>
        </div>
        <div className="absolute bottom-10 text-xs text-soft-gray/50">你的朋友 小M</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-light-gray h-1">
        <div
          className="bg-sage-green h-1 transition-all duration-300"
          style={{ width: `${canProceed() ? 100 : 25}%` }}
        ></div>
      </div>

      <main className="flex-grow px-6 pt-8 pb-8">
        <div className="text-center animate-slide-up mb-8">
          <div className="inline-block p-4 bg-sage-light rounded-full mb-6">
            <Hand className="w-8 h-8 text-sage-green" />
          </div>
          <h1 className="text-2xl font-bold text-soft-gray mb-2">你好，新朋友！我是小M</h1>
          <p className="text-soft-gray/70 mb-8 leading-relaxed">
            很高兴认识你。为了更好地陪伴你，可以花几分钟，让我更了解你吗？
          </p>
        </div>

        <div className="space-y-8">
          {/* 第一个问题：称呼 */}
          <div className="text-left">
            <h2 className="font-semibold text-soft-gray mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-sage-green text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              首先，我该怎么称呼你呢？
            </h2>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => handleChoiceToggle("name", e.target.value)}
              placeholder="请输入你的名字..."
              className="w-full p-4 border border-light-gray rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-green/50 bg-white text-soft-gray"
            />
          </div>

          {/* 第二个问题：拖延领域 */}
          <div>
            <h2 className="font-semibold text-soft-gray mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-sunrise-coral text-white rounded-full flex items-center justify-center text-sm">
                2
              </span>
              在哪些事情上，你最容易"想做但没做"？
            </h2>
            <p className="text-soft-gray/70 text-sm mb-4">可以选择多个选项</p>
            <div className="grid grid-cols-1 gap-3">
              {["学习/工作任务", "个人成长项目", "家务整理", "健康习惯养成", "社交活动参与", "创意兴趣爱好"].map(
                (area) => (
                  <button
                    key={area}
                    onClick={() => handleChoiceToggle("procrastinationAreas", area)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all text-sm ${
                      userProfile.procrastinationAreas.includes(area)
                        ? "border-sage-green bg-sage-light text-sage-green"
                        : "border-light-gray bg-white text-soft-gray hover:border-sage-green/50"
                    }`}
                  >
                    {area}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* 第三个问题：拖延原因 */}
          <div>
            <h2 className="font-semibold text-soft-gray mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-gentle-blue text-white rounded-full flex items-center justify-center text-sm">
                3
              </span>
              你觉得，是什么让你停下了脚步？
            </h2>
            <p className="text-soft-gray/70 text-sm mb-4">了解根源，才能对症下药</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                "害怕失败或被批评",
                "追求完美，迟迟不敢开始",
                "任务太复杂，不知从何下手",
                "缺乏动力和兴趣",
                "容易被手机等外界分心",
                "时间管理困难",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleChoiceToggle("procrastinationReasons", reason)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all text-sm ${
                    userProfile.procrastinationReasons.includes(reason)
                      ? "border-sage-green bg-sage-light text-sage-green"
                      : "border-light-gray bg-white text-soft-gray hover:border-sage-green/50"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* 第四个问题：激励方式 */}
          <div>
            <h2 className="font-semibold text-soft-gray mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-sunrise-coral text-white rounded-full flex items-center justify-center text-sm">
                4
              </span>
              什么样的激励对你最有效？
            </h2>
            <p className="text-soft-gray/70 text-sm mb-4">让我知道如何更好地鼓励你</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                "完成后的成就感",
                "朋友的鼓励和陪伴",
                "给自己一点小奖励",
                "学到新知识和技能",
                "看到具体的进步数据",
                "与他人分享成果",
              ].map((motivation) => (
                <button
                  key={motivation}
                  onClick={() => handleChoiceToggle("motivationTypes", motivation)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all text-sm ${
                    userProfile.motivationTypes.includes(motivation)
                      ? "border-sage-green bg-sage-light text-sage-green"
                      : "border-light-gray bg-white text-soft-gray hover:border-sage-green/50"
                  }`}
                >
                  {motivation}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 pt-4">
        {canProceed() && (
          <div className="text-center mb-4">
            <p className="text-soft-gray text-sm">太棒了！接下来让我们一起设置你的专属挑战任务 🎯</p>
          </div>
        )}
        <button
          onClick={handleContinueToChallengeTasks}
          disabled={!canProceed()}
          className={`w-full text-white py-4 rounded-2xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            canProceed() ? "bg-sage-green hover:bg-sage-green/90 shadow-soft" : "bg-light-gray"
          }`}
        >
          继续设置挑战任务 →
        </button>
      </footer>
    </div>
  )
}
