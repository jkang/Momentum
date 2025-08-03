"use client"

import { Clock, Target } from "lucide-react"

interface MissionCardProps {
  title: string
  progress: number
  nextStep?: string
  timeEstimate?: string
}

export function MissionCard({ title, progress, nextStep, timeEstimate }: MissionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="px-2 py-1 rounded-full text-xs bg-sage-100 text-sage-500">进行中</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-sage-500">{progress}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-sage-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Next Step */}
      {nextStep && (
        <div className="bg-sage-100/50 rounded-xl p-3 mb-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Target className="w-4 h-4 mr-1" />
            <span className="font-medium">下一步</span>
          </div>
          <p className="text-sm text-gray-800">{nextStep}</p>
          {timeEstimate && (
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Clock className="w-3 h-3 mr-1" />
              <span>预计 {timeEstimate}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button className="w-full bg-sage-400 text-white py-2 rounded-full font-medium hover:bg-sage-500 transition-colors">
        继续进行
      </button>
    </div>
  )
}
