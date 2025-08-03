"use client"

import { Lightbulb } from "lucide-react"

export function GentleReminder() {
  return (
    <section className="mt-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="bg-sage-100/70 rounded-2xl p-5">
        <div className="flex items-start text-left">
          <div className="w-10 h-10 rounded-full bg-sage-300 flex-shrink-0 flex items-center justify-center mt-1">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-brand-green">还记得"竞品分析报告"吗？</p>
            <p className="text-gray-700 leading-relaxed text-sm mt-1">
              我知道开启一个大任务会有点难。别担心，我们已经拆解好了第一步，只需要10分钟就能完成。要不要现在就行动？
            </p>
            <div className="mt-4">
              <button className="bg-sage-400 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-sage-500 transition-colors">
                开始第一步
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
