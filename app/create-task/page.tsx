"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Lightbulb, Clock, Target, Zap } from "lucide-react"
import { XiaoMAvatar } from "@/components/xiao-m-avatar"
import { taskAnalyzer, type DecomposedTask } from "@/lib/task-analyzer"

export default function CreateTaskPage() {
  const [step, setStep] = useState(1)
  const [taskData, setTaskData] = useState({
    description: "",
    urgency: "medium" as "low" | "medium" | "high",
    timeAvailable: 60,
    experience: "medium" as "beginner" | "medium" | "expert",
  })
  const [decomposedTask, setDecomposedTask] = useState<DecomposedTask | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!taskData.description.trim()) return

    setIsAnalyzing(true)

    // 模拟分析过程
    setTimeout(() => {
      const result = taskAnalyzer.decomposeTask(taskData.description, {
        urgency: taskData.urgency,
        timeAvailable: taskData.timeAvailable,
        experience: taskData.experience,
      })
      setDecomposedTask(result)
      setIsAnalyzing(false)
      setStep(3)
    }, 2000)
  }

  const handleCreateActionPlan = () => {
    if (!decomposedTask) return

    // 保存到localStorage
    const actionPlan = {
      id: Date.now().toString(),
      title: decomposedTask.originalTask,
      steps: decomposedTask.steps.map((step, index) => ({
        id: index + 1,
        text: `${step.title}: ${step.description}`,
        completed: false,
        timeEstimate: step.timeEstimate,
        difficulty: step.difficulty,
        tips: step.tips,
      })),
      analysis: decomposedTask.analysis,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("currentActionPlan", JSON.stringify(actionPlan))

    // 跳转到行动计划页面
    window.location.href = "/actions"
  }

  if (step === 1) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
        <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
          <Link href="/chat" className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-soft-gray" />
          </Link>
          <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">任务拆解向导</h1>
          <div className="w-6"></div>
        </header>

        <main className="flex-grow p-4">
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
            <div className="flex items-start gap-3 mb-4">
              <XiaoMAvatar mood="thinking" size="md" />
              <div className="flex-grow">
                <div className="bg-sage-light rounded-2xl rounded-tl-sm p-3">
                  <p className="text-soft-gray text-sm leading-relaxed">
                    告诉我你想要完成什么任务吧！我会帮你把它分解成容易完成的小步骤 😊
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-soft-gray mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                描述你的任务
              </label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="例如：完成竞品分析报告、学习React框架、整理房间..."
                className="w-full p-4 border border-light-gray rounded-2xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-sage-green/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-soft-gray mb-2">
                  <Zap className="w-4 h-4 inline mr-1" />
                  紧急程度
                </label>
                <select
                  value={taskData.urgency}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, urgency: e.target.value as any }))}
                  className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                >
                  <option value="low">不急</option>
                  <option value="medium">一般</option>
                  <option value="high">很急</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-gray mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  可用时间
                </label>
                <select
                  value={taskData.timeAvailable}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, timeAvailable: Number(e.target.value) }))}
                  className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                >
                  <option value={30}>30分钟</option>
                  <option value={60}>1小时</option>
                  <option value={120}>2小时</option>
                  <option value={240}>半天</option>
                  <option value={480}>一整天</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-soft-gray mb-2">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                你的经验水平
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "beginner", label: "新手", desc: "第一次做" },
                  { value: "medium", label: "一般", desc: "有些经验" },
                  { value: "expert", label: "熟练", desc: "很有经验" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTaskData((prev) => ({ ...prev, experience: option.value as any }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      taskData.experience === option.value
                        ? "border-sage-green bg-sage-light"
                        : "border-light-gray hover:border-sage-green/50"
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-soft-gray/60">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4">
          <button
            onClick={() => setStep(2)}
            disabled={!taskData.description.trim()}
            className="w-full bg-sage-green text-white py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开始智能分析 ✨
          </button>
        </footer>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
        <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
          <button onClick={() => setStep(1)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-soft-gray" />
          </button>
          <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">确认信息</h1>
          <div className="w-6"></div>
        </header>

        <main className="flex-grow p-4">
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
            <div className="flex items-start gap-3 mb-4">
              <XiaoMAvatar mood="thinking" size="md" />
              <div className="flex-grow">
                <div className="bg-sage-light rounded-2xl rounded-tl-sm p-3">
                  <p className="text-soft-gray text-sm leading-relaxed">
                    让我确认一下信息，然后为你制定最合适的行动计划！
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <h3 className="font-semibold text-soft-gray mb-3">任务信息</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-soft-gray/60">任务描述：</span>
                  <p className="text-soft-gray font-medium">{taskData.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-soft-gray/60">紧急程度</div>
                    <div className="font-medium text-soft-gray">
                      {taskData.urgency === "low" ? "不急" : taskData.urgency === "medium" ? "一般" : "很急"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-soft-gray/60">可用时间</div>
                    <div className="font-medium text-soft-gray">
                      {taskData.timeAvailable >= 480
                        ? "一整天"
                        : taskData.timeAvailable >= 240
                          ? "半天"
                          : taskData.timeAvailable >= 120
                            ? `${taskData.timeAvailable / 60}小时`
                            : `${taskData.timeAvailable}分钟`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-soft-gray/60">经验水平</div>
                    <div className="font-medium text-soft-gray">
                      {taskData.experience === "beginner" ? "新手" : taskData.experience === "medium" ? "一般" : "熟练"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-sage-green text-white py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? "小M正在分析中..." : "确认并生成计划 🚀"}
          </button>
        </footer>
      </div>
    )
  }

  if (step === 3 && decomposedTask) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-warm-off-white font-sans flex flex-col">
        <header className="p-4 flex items-center sticky top-0 bg-warm-off-white/80 backdrop-blur-sm z-10 border-b border-light-gray">
          <button onClick={() => setStep(2)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-soft-gray" />
          </button>
          <h1 className="text-lg font-semibold text-soft-gray text-center flex-grow">智能拆解结果</h1>
          <div className="w-6"></div>
        </header>

        <main className="flex-grow p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-6">
            <div className="flex items-start gap-3 mb-4">
              <XiaoMAvatar mood="happy" size="md" />
              <div className="flex-grow">
                <div className="bg-sage-light rounded-2xl rounded-tl-sm p-3">
                  <p className="text-soft-gray text-sm leading-relaxed">
                    太棒了！我已经为你制定了一个详细的行动计划。这样你就不会感到无从下手了 ✨
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 任务分析结果 */}
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-4">
            <h3 className="font-semibold text-soft-gray mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              任务分析
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-sage-light rounded-xl p-3">
                <div className="text-soft-gray/60 text-xs">任务类型</div>
                <div className="font-medium text-soft-gray">{decomposedTask.analysis.category}</div>
              </div>
              <div className="bg-sage-light rounded-xl p-3">
                <div className="text-soft-gray/60 text-xs">复杂程度</div>
                <div className="font-medium text-soft-gray">
                  {decomposedTask.analysis.complexity === "simple"
                    ? "简单"
                    : decomposedTask.analysis.complexity === "medium"
                      ? "中等"
                      : "复杂"}
                </div>
              </div>
              <div className="bg-sage-light rounded-xl p-3">
                <div className="text-soft-gray/60 text-xs">预计时间</div>
                <div className="font-medium text-soft-gray">{Math.round(decomposedTask.totalTime / 60)}小时</div>
              </div>
              <div className="bg-sage-light rounded-xl p-3">
                <div className="text-soft-gray/60 text-xs">难度等级</div>
                <div className="font-medium text-soft-gray">{"⭐".repeat(decomposedTask.analysis.difficulty)}</div>
              </div>
            </div>
          </div>

          {/* 拆解步骤 */}
          <div className="bg-white rounded-2xl p-4 shadow-soft mb-4">
            <h3 className="font-semibold text-soft-gray mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              行动步骤 ({decomposedTask.steps.length}步)
            </h3>
            <div className="space-y-3">
              {decomposedTask.steps.map((step, index) => (
                <div key={step.id} className="border border-light-gray rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-sage-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-soft-gray text-sm">{step.title}</h4>
                      <p className="text-xs text-soft-gray/70 mt-1">{step.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-soft-gray/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.timeEstimate}分钟
                        </span>
                        <span>难度: {"⭐".repeat(step.difficulty)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 小贴士 */}
          {decomposedTask.suggestions.length > 0 && (
            <div className="bg-gentle-blue/10 rounded-2xl p-4 mb-4">
              <h3 className="font-semibold text-soft-gray mb-2 flex items-center">💡 小M的建议</h3>
              <ul className="space-y-1 text-sm text-soft-gray">
                {decomposedTask.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gentle-blue mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        <footer className="p-4">
          <button
            onClick={handleCreateActionPlan}
            className="w-full bg-sage-green text-white py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors"
          >
            创建行动计划 🎯
          </button>
        </footer>
      </div>
    )
  }

  return null
}
