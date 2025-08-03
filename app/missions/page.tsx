"use client"

import { ArrowLeft, Plus, Clock, Target } from "lucide-react"
import Link from "next/link"

export default function MissionsPage() {
  const missions = [
    {
      id: 1,
      title: "竞品分析报告",
      progress: 43,
      nextStep: "列出对报告的所有疑问",
      timeEstimate: "10分钟",
      status: "进行中",
    },
    {
      id: 2,
      title: "Q3产品发布计划",
      progress: 75,
      nextStep: "完善发布时间线",
      timeEstimate: "15分钟",
      status: "进行中",
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-soft-bg">
      {/* Header */}
      <header className="bg-soft-bg/80 backdrop-blur-sm p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="p-2 -ml-2">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="ml-2 text-xl font-bold text-brand-green">我的使命</h1>
          </div>
          <Link
            href="/new-mission"
            className="w-10 h-10 rounded-full bg-sage-400 flex items-center justify-center text-white hover:bg-sage-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{mission.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      mission.status === "进行中" ? "bg-coral-100 text-brand-coral" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {mission.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-sage-500">{mission.progress}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-sage-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mission.progress}%` }}
              ></div>
            </div>

            {/* Next Step */}
            <div className="bg-sage-100/50 rounded-xl p-3 mb-3">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Target className="w-4 h-4 mr-1" />
                <span className="font-medium">下一步</span>
              </div>
              <p className="text-sm text-gray-800">{mission.nextStep}</p>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                <span>预计 {mission.timeEstimate}</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-sage-400 text-white py-2 rounded-full font-medium hover:bg-sage-500 transition-colors">
              继续进行
            </button>
          </div>
        ))}

        {/* Empty State or Add New Mission */}
        <div className="bg-white/50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-brand-coral" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">开启新使命</h3>
          <p className="text-sm text-gray-500 mb-4">每个大目标都从小步骤开始</p>
          <Link
            href="/new-mission"
            className="bg-sage-400 text-white px-6 py-2 rounded-full font-medium hover:bg-sage-500 transition-colors inline-block"
          >
            创建使命
          </Link>
        </div>
      </main>
    </div>
  )
}
