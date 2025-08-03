"use client"

import { useState } from "react"
import { WarmIcons } from "./custom-icons"
import type { JournalEntry } from "@/lib/reflection-journal"

interface ReflectionCardProps {
  entry: JournalEntry
  onEdit?: (entry: JournalEntry) => void
  onDelete?: (entryId: string) => void
}

export function ReflectionCard({ entry, onEdit, onDelete }: ReflectionCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const getMoodEmoji = (mood: number) => {
    const emojis = { 1: "😢", 2: "😕", 3: "😐", 4: "😊", 5: "😄" }
    return emojis[mood as keyof typeof emojis]
  }

  const getMoodColor = (mood: number) => {
    const colors = {
      1: "text-red-500 bg-red-50",
      2: "text-orange-500 bg-orange-50",
      3: "text-yellow-500 bg-yellow-50",
      4: "text-green-500 bg-green-50",
      5: "text-emerald-500 bg-emerald-50",
    }
    return colors[mood as keyof typeof colors]
  }

  const getEnergyBars = (energy: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`w-2 h-4 rounded-sm ${i < energy ? "bg-gentle-blue" : "bg-gray-200"}`}></div>
    ))
  }

  const getProductivityBars = (productivity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`w-2 h-4 rounded-sm ${i < productivity ? "bg-sunrise-coral" : "bg-gray-200"}`}></div>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + "..."
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-hover transition-all duration-300">
      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <WarmIcons.Calendar className="text-soft-gray/60" size={16} />
          <span className="text-sm text-soft-gray/80">{formatDate(entry.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(entry)}
              className="p-1 text-soft-gray/60 hover:text-sage-green hover:bg-sage-light rounded-full transition-colors"
            >
              <WarmIcons.Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1 text-soft-gray/60 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <WarmIcons.Trash size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 标题 */}
      {entry.title && <h3 className="font-semibold text-soft-gray mb-2">{entry.title}</h3>}

      {/* 情绪、精力、效率指标 */}
      <div className="flex items-center gap-6 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-2xl p-1 rounded-lg ${getMoodColor(entry.mood)}`}>{getMoodEmoji(entry.mood)}</span>
          <span className="text-xs text-soft-gray/60">心情</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">{getEnergyBars(entry.energy)}</div>
          <WarmIcons.Energy className="text-gentle-blue" size={12} />
          <span className="text-xs text-soft-gray/60">精力</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">{getProductivityBars(entry.productivity)}</div>
          <WarmIcons.Target className="text-sunrise-coral" size={12} />
          <span className="text-xs text-soft-gray/60">效率</span>
        </div>
      </div>

      {/* 内容 */}
      <div className="mb-3">
        <p className="text-sm text-soft-gray leading-relaxed">
          {showFullContent ? entry.content : truncateContent(entry.content)}
        </p>
        {entry.content.length > 150 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-xs text-sage-green hover:underline mt-1"
          >
            {showFullContent ? "收起" : "展开"}
          </button>
        )}
      </div>

      {/* 标签 */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {entry.tags.map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-sage-light text-sage-green rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 成就和挑战 */}
      <div className="space-y-2">
        {entry.achievements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-soft-gray mb-1 flex items-center gap-1">🏆 今日成就</h4>
            <ul className="space-y-1">
              {entry.achievements.slice(0, 2).map((achievement, index) => (
                <li key={index} className="text-xs text-soft-gray/70 flex items-start gap-1">
                  <span className="text-sage-green mt-0.5">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
              {entry.achievements.length > 2 && (
                <li className="text-xs text-soft-gray/50">还有 {entry.achievements.length - 2} 项成就...</li>
              )}
            </ul>
          </div>
        )}

        {entry.gratitude.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-soft-gray mb-1 flex items-center gap-1">
              <WarmIcons.Heart className="text-pink-500" size={12} />
              感恩
            </h4>
            <ul className="space-y-1">
              {entry.gratitude.slice(0, 2).map((item, index) => (
                <li key={index} className="text-xs text-soft-gray/70 flex items-start gap-1">
                  <span className="text-pink-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {entry.gratitude.length > 2 && (
                <li className="text-xs text-soft-gray/50">还有 {entry.gratitude.length - 2} 项感恩...</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 明日目标 */}
      {entry.tomorrowGoals.length > 0 && (
        <div className="mt-3 pt-3 border-t border-light-gray">
          <h4 className="text-xs font-semibold text-soft-gray mb-1">明日目标</h4>
          <div className="flex flex-wrap gap-1">
            {entry.tomorrowGoals.slice(0, 3).map((goal, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-gentle-blue/20 text-gentle-blue rounded-full">
                {goal}
              </span>
            ))}
            {entry.tomorrowGoals.length > 3 && (
              <span className="text-xs text-soft-gray/50">+{entry.tomorrowGoals.length - 3}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
