"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lightbulb, Target, Clock, Zap } from "lucide-react"

export default function CreateTaskPage() {
  const router = useRouter()
  const [task, setTask] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!task.trim()) return

    setIsAnalyzing(true)

    // 模拟AI分析过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setAnalysis({
      difficulty: "中等",
      estimatedTime: "2-3小时",
      breakdown: ["收集相关资料和信息", "制定详细的执行计划", "开始实际操作", "检查和完善结果"],
      tips: ["建议分成多个小步骤完成", "可以先从最简单的部分开始", "记得适时休息，保持专注"],
    })

    setIsAnalyzing(false)
  }

  const handleCreateTask = () => {
    // 这里可以保存任务到本地存储或发送到服务器
    console.log("创建任务:", { task, analysis })
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-bg font-sans">
      <header className="flex items-center p-4 bg-white border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">创建新任务</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-sage-light rounded-full mb-4">
            <Target className="w-8 h-8 text-sage-green" />
          </div>
          <h2 className="text-xl font-bold text-soft-gray mb-2">告诉我你想做什么</h2>
          <p className="text-soft-gray/70">小M会帮你分析任务，制定最佳执行方案</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：学习React框架、整理房间、准备面试..."
            className="w-full p-4 border border-light-gray rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-green/50 bg-white text-soft-gray min-h-[120px] resize-none"
          />

          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={!task.trim() || isAnalyzing}
              className="w-full bg-sage-green text-black py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  小M正在分析中...
                </div>
              ) : (
                "让小M分析一下 ✨"
              )}
            </button>
          )}
        </div>

        {analysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-sunrise-coral" />
                <h3 className="font-semibold text-soft-gray">小M的分析</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-sage-light rounded-xl">
                  <div className="text-sm text-soft-gray/70">难度等级</div>
                  <div className="font-semibold text-sage-green">{analysis.difficulty}</div>
                </div>
                <div className="text-center p-3 bg-gentle-blue/10 rounded-xl">
                  <div className="text-sm text-soft-gray/70">预估时间</div>
                  <div className="font-semibold text-gentle-blue">{analysis.estimatedTime}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-soft-gray mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    建议步骤
                  </h4>
                  <ul className="space-y-2">
                    {analysis.breakdown.map((step: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-soft-gray/80">
                        <span className="w-5 h-5 bg-sage-green text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-soft-gray mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    小贴士
                  </h4>
                  <ul className="space-y-1">
                    {analysis.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-soft-gray/80 flex items-start gap-2">
                        <span className="text-sunrise-coral mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateTask}
              className="w-full bg-sage-green text-black py-4 rounded-2xl font-semibold hover:bg-sage-green/90 transition-colors shadow-soft"
            >
              创建这个任务 🎯
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
