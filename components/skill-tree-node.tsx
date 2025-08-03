"use client"

import { useState } from "react"
import { Lock, Check, Star } from "lucide-react"
import { skillTree, type SkillNode } from "@/lib/skill-tree"

interface SkillTreeNodeProps {
  skill: SkillNode
  onUnlock?: (skillId: string) => void
}

export function SkillTreeNode({ skill, onUnlock }: SkillTreeNodeProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleUnlock = () => {
    const success = skillTree.unlockSkill(skill.id)
    if (success && onUnlock) {
      onUnlock(skill.id)
    }
  }

  const { canUnlock, progress, missingConditions } = skillTree.checkSkillUnlockConditions(skill.id)

  const getTierColor = (tier: number) => {
    const colors = {
      1: "border-gray-300 bg-gray-50",
      2: "border-blue-300 bg-blue-50",
      3: "border-purple-300 bg-purple-50",
      4: "border-orange-300 bg-orange-50",
      5: "border-red-300 bg-red-50",
    }
    return colors[tier as keyof typeof colors] || colors[1]
  }

  const getTierLabel = (tier: number) => {
    const labels = { 1: "基础", 2: "进阶", 3: "高级", 4: "专家", 5: "大师" }
    return labels[tier as keyof typeof labels] || "基础"
  }

  return (
    <div
      className={`relative w-32 h-32 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        skill.isUnlocked
          ? "border-sage-green bg-sage-light shadow-lg"
          : canUnlock
            ? "border-sunrise-coral bg-sunrise-coral/10 hover:shadow-md"
            : getTierColor(skill.tier)
      }`}
      onClick={() => setShowDetails(true)}
      style={{
        position: "absolute",
        left: `${skill.position.x}px`,
        top: `${skill.position.y}px`,
      }}
    >
      {/* 技能图标 */}
      <div className="absolute top-2 left-2 right-2 flex justify-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            skill.isUnlocked
              ? "bg-sage-green text-white"
              : canUnlock
                ? "bg-sunrise-coral text-white"
                : "bg-gray-200 text-gray-500"
          }`}
        >
          {skill.isUnlocked ? <Check className="w-6 h-6" /> : canUnlock ? skill.icon : <Lock className="w-6 h-6" />}
        </div>
      </div>

      {/* 技能名称 */}
      <div className="absolute bottom-8 left-2 right-2 text-center">
        <h4 className={`text-xs font-semibold ${skill.isUnlocked ? "text-sage-green" : "text-soft-gray"}`}>
          {skill.name}
        </h4>
      </div>

      {/* 层级标识 */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
        <span className="text-xs px-2 py-1 rounded-full bg-white/80 text-soft-gray font-medium">
          {getTierLabel(skill.tier)}
        </span>
      </div>

      {/* 进度条（未解锁时显示） */}
      {!skill.isUnlocked && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
          <div className="h-full bg-sunrise-coral transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* 解锁按钮 */}
      {canUnlock && !skill.isUnlocked && (
        <div className="absolute -top-2 -right-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleUnlock()
            }}
            className="w-6 h-6 bg-sunrise-coral text-white rounded-full flex items-center justify-center hover:bg-sunrise-coral/90 transition-colors"
          >
            <Star className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 详情弹窗 */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-soft-gray">{skill.name}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="text-center mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 ${
                  skill.isUnlocked
                    ? "bg-sage-green text-white"
                    : canUnlock
                      ? "bg-sunrise-coral text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {skill.isUnlocked ? (
                  <Check className="w-8 h-8" />
                ) : canUnlock ? (
                  skill.icon
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${getTierColor(skill.tier)} font-medium`}>
                {getTierLabel(skill.tier)}技能
              </span>
            </div>

            <p className="text-sm text-soft-gray/70 mb-4 text-center">{skill.description}</p>

            {/* 解锁条件 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-soft-gray mb-2">解锁条件:</h4>
              <div className="space-y-2">
                {skill.unlockConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        !missingConditions.includes(condition.description)
                          ? "bg-sage-green text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {!missingConditions.includes(condition.description) ? (
                        <Check className="w-2 h-2" />
                      ) : (
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-soft-gray">{condition.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 技能效果 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-soft-gray mb-2">技能效果:</h4>
              <ul className="space-y-1">
                {skill.benefits.map((benefit, index) => (
                  <li key={index} className="text-xs text-soft-gray/70 flex items-start gap-2">
                    <span className="text-sage-green mt-0.5">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 进度显示 */}
            {!skill.isUnlocked && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-soft-gray/60 mb-1">
                  <span>解锁进度</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-light-gray rounded-full h-2">
                  <div
                    className="bg-sunrise-coral h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-2">
              {canUnlock && !skill.isUnlocked && (
                <button
                  onClick={handleUnlock}
                  className="flex-1 bg-sunrise-coral text-white py-2 rounded-xl font-medium hover:bg-sunrise-coral/90 transition-colors"
                >
                  解锁技能
                </button>
              )}
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 bg-light-gray text-soft-gray py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {skill.isUnlocked ? "已掌握" : "关闭"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
