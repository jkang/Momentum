"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, BookOpen, Calendar, Star, Trophy } from "lucide-react"
import Link from "next/link"

interface GrowthEntry {
  id: string
  date: Date
  title: string
  content: string
  mood: "great" | "good" | "okay" | "challenging"
  achievements: string[]
  learnings: string[]
}

export default function GrowthPage() {
  const [entries, setEntries] = useState<GrowthEntry[]>([])
  const [userName, setUserName] = useState("思慧")
  const [showNewEntry, setShowNewEntry] = useState(false)

  useEffect(() => {
    // 获取用户名
    const userProfile = localStorage.getItem("userProfile")
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile)
        if (profile.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error("解析用户档案失败:", error)
      }
    }

    // 模拟成长日志数据
    const mockEntries: GrowthEntry[] = [
      {
        id: "1",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天
        title: "论文写作的突破",
        content:
          "今天终于克服了对论文最后一章的恐惧，写了整整2小时。虽然只完成了一小部分，但感觉找到了节奏。小M的建议真的很有用，把大任务拆解成小步骤确实降低了心理压力。",
        mood: "great",
        achievements: ["连续专注2小时", "完成论文大纲"],
        learnings: ["拆解任务能有效减少焦虑", "专注环境很重要"],
      },
      {
        id: "2",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
        title: "晨间例行公事的开始",
        content: "第一次尝试7点起床，虽然有点困难，但成功了！做了简单的伸展运动和冥想。感觉一整天的精神状态都比较好。",
        mood: "good",
        achievements: ["成功早起", "完成晨间运动"],
        learnings: ["早起确实能提升一天的状态", "简单的运动就很有效果"],
      },
      {
        id: "3",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
        title: "整理房间的意外收获",
        content:
          "本来只是想简单整理一下书桌，结果越整理越有动力，把整个房间都收拾了一遍。找到了很多以前的笔记和书籍，还发现了一些遗忘的小物件。整洁的环境真的让人心情愉悦。",
        mood: "great",
        achievements: ["完成房间整理", "重新发现旧物品"],
        learnings: ["环境整洁影响心情", "行动会带来意外的收获"],
      },
    ]

    setEntries(mockEntries)
  }, [])

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "great":
        return "😊"
      case "good":
        return "🙂"
      case "okay":
        return "😐"
      case "challenging":
        return "😔"
      default:
        return "🙂"
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "great":
        return "text-sage-green bg-sage-light"
      case "good":
        return "text-gentle-blue bg-gentle-blue/10"
      case "okay":
        return "text-sunrise-coral bg-sunrise-coral/10"
      case "challenging":
        return "text-soft-gray bg-light-gray"
      default:
        return "text-soft-gray bg-light-gray"
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "今天"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨天"
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-warm-off-white">
      {/* Header */}
      <header className="bg-warm-off-white/80 backdrop-blur-sm p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-soft-gray/60 hover:bg-light-gray/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-soft-gray">成长日志</h1>
          <button
            onClick={() => setShowNewEntry(true)}
            className="w-10 h-10 rounded-full bg-sage-green flex items-center justify-center text-white hover:bg-sage-green/90"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Welcome Message */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-sage-light to-gentle-blue/10 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray mb-1">{userName}的成长足迹</p>
                <p className="text-soft-gray/80 text-sm leading-relaxed">
                  记录每一个成长的瞬间，见证自己的蜕变。你已经写下了 {entries.length} 篇成长日志。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Entries */}
        <section className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-5 shadow-soft">
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-3">
                    <Calendar className="w-4 h-4 text-soft-gray/60 mr-1" />
                    <span className="text-sm text-soft-gray/70">{formatDate(entry.date)}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                    {getMoodEmoji(entry.mood)}
                  </span>
                </div>
              </div>

              {/* Entry Title */}
              <h3 className="font-bold text-soft-gray mb-3">{entry.title}</h3>

              {/* Entry Content */}
              <p className="text-soft-gray/80 text-sm leading-relaxed mb-4">{entry.content}</p>

              {/* Achievements */}
              {entry.achievements.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-4 h-4 text-sunrise-coral mr-2" />
                    <span className="text-sm font-semibold text-soft-gray">今日成就</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sunrise-coral/10 text-sunrise-coral rounded-full text-xs"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learnings */}
              {entry.learnings.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-gentle-blue mr-2" />
                    <span className="text-sm font-semibold text-soft-gray">收获感悟</span>
                  </div>
                  <div className="space-y-1">
                    {entry.learnings.map((learning, index) => (
                      <p key={index} className="text-xs text-soft-gray/70 pl-4 border-l-2 border-gentle-blue/20">
                        {learning}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-sage-green" />
            </div>
            <p className="text-soft-gray/70 mb-4">还没有成长日志</p>
            <p className="text-soft-gray/60 text-sm mb-6">记录你的成长瞬间，见证自己的蜕变</p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="bg-sage-green text-white px-6 py-3 rounded-2xl font-medium hover:bg-sage-green/90 transition-colors"
            >
              写下第一篇日志
            </button>
          </div>
        )}

        {/* Encouragement */}
        <section className="mt-8 mb-6">
          <div className="bg-sage-light/70 rounded-2xl p-5">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-green flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-lg">🌱</div>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-soft-gray mb-2">小M的话</p>
                <p className="text-soft-gray/80 text-sm leading-relaxed">
                  {userName}，每一次的记录都是对自己成长的见证。不管是大的突破还是小的进步，都值得被记住和庆祝。
                  继续保持这个好习惯，未来的你会感谢现在努力记录的自己。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        {/* Chat FAB */}
        <div className="absolute bottom-20 right-4 z-10">
          <Link
            href="/chat"
            className="w-16 h-16 rounded-full bg-sage-green flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform hover:bg-sage-green/90"
          >
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </Link>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white/80 backdrop-blur-lg border-t border-light-gray px-6 pt-2 pb-4 rounded-t-2xl">
          <div className="flex justify-around items-center">
            <Link href="/" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs mt-1">主页</span>
            </Link>
            <Link href="/actions" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1">行动</span>
            </Link>
            <Link href="/insights" className="flex flex-col items-center text-soft-gray/60 w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span className="text-xs mt-1">洞察</span>
            </Link>
            <Link href="/growth" className="flex flex-col items-center text-sage-green w-16">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="text-xs mt-1 font-semibold">成长</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
