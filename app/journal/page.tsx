"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Plus, Calendar, Tag } from "lucide-react"
import { reflectionJournal, type JournalEntry, type ReflectionPrompt } from "@/lib/reflection-journal"

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [prompts, setPrompts] = useState<ReflectionPrompt[]>([])
  const [journalStats, setJournalStats] = useState({
    totalEntries: 0,
    streakDays: 0,
    averageMood: 3,
    averageProductivity: 3,
    mostUsedTags: [] as string[],
  })

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: 3 as 1 | 2 | 3 | 4 | 5,
    energy: 3 as 1 | 2 | 3 | 4 | 5,
    productivity: 3 as 1 | 2 | 3 | 4 | 5,
    tags: [] as string[],
    achievements: [] as string[],
    challenges: [] as string[],
    learnings: [] as string[],
    gratitude: [] as string[],
    tomorrowGoals: [] as string[],
  })

  const [currentTagInput, setCurrentTagInput] = useState("")
  const [currentAchievement, setCurrentAchievement] = useState("")
  const [currentGratitude, setCurrentGratitude] = useState("")
  const [currentGoal, setCurrentGoal] = useState("")

  useEffect(() => {
    // 加载日记数据
    const loadData = () => {
      const allEntries = reflectionJournal.getAllEntries()
      setEntries(allEntries)

      const stats = reflectionJournal.getJournalStats()
      setJournalStats(stats)

      const dailyPrompts = reflectionJournal.getReflectionPrompts("daily")
      setPrompts(dailyPrompts)
    }

    loadData()
  }, [])

  const handleSaveEntry = () => {
    if (!newEntry.content.trim()) return

    const entryData = {
      ...newEntry,
      date: selectedDate,
    }

    reflectionJournal.saveEntry(entryData)

    // 重新加载数据
    const allEntries = reflectionJournal.getAllEntries()
    setEntries(allEntries)

    const stats = reflectionJournal.getJournalStats()
    setJournalStats(stats)

    // 重置表单
    setNewEntry({
      title: "",
      content: "",
      mood: 3,
      energy: 3,
      productivity: 3,
      tags: [],
      achievements: [],
      challenges: [],
      learnings: [],
      gratitude: [],
      tomorrowGoals: [],
    })
    setShowAddEntry(false)
  }

  const handleDeleteEntry = (entryId: string) => {
    if (confirm("确定要删除这篇日记吗？")) {
      reflectionJournal.deleteEntry(entryId)
      const allEntries = reflectionJournal.getAllEntries()
      setEntries(allEntries)

      const stats = reflectionJournal.getJournalStats()
      setJournalStats(stats)
    }
  }

  const addTag = () => {
    if (currentTagInput.trim() && !newEntry.tags.includes(currentTagInput.trim())) {
      setNewEntry((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTagInput.trim()],
      }))
      setCurrentTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewEntry((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addAchievement = () => {
    if (currentAchievement.trim()) {
      setNewEntry((prev) => ({
        ...prev,
        achievements: [...prev.achievements, currentAchievement.trim()],
      }))
      setCurrentAchievement("")
    }
  }

  const addGratitude = () => {
    if (currentGratitude.trim()) {
      setNewEntry((prev) => ({
        ...prev,
        gratitude: [...prev.gratitude, currentGratitude.trim()],
      }))
      setCurrentGratitude("")
    }
  }

  const addGoal = () => {
    if (currentGoal.trim()) {
      setNewEntry((prev) => ({
        ...prev,
        tomorrowGoals: [...prev.tomorrowGoals, currentGoal.trim()],
      }))
      setCurrentGoal("")
    }
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = { 1: "😢", 2: "😕", 3: "😐", 4: "😊", 5: "😄" }
    return emojis[mood as keyof typeof emojis]
  }

  const journalEntriesData = [
    {
      id: 1,
      date: "2024-01-15",
      title: "今天的小胜利",
      preview: "完成了竞品分析的第一步，虽然只是列出问题，但感觉很有成就感...",
      mood: "😊",
      tags: ["工作", "成就感"],
    },
    {
      id: 2,
      date: "2024-01-14",
      title: "新的开始",
      preview: "决定开始使用这个应用来管理我的任务，希望能够改变拖延的习惯...",
      mood: "🤔",
      tags: ["反思", "目标"],
    },
  ]

  const journalEntries = [
    {
      id: 1,
      title: "竞品分析报告复盘",
      date: "3天前",
      content:
        "这次任务让我意识到我有完美主义倾向，总想一次做到最好，导致迟迟不敢开始。拆解任务后，发现其实可以循序渐进...",
      tags: ["完美主义", "任务拆解", "工作"],
    },
    {
      id: 2,
      title: "克服求助障碍",
      date: "1周前",
      content:
        "今天终于鼓起勇气向主管请教了项目中遇到的问题，没想到他非常乐意帮助。我一直担心显得自己能力不足，但实际上...",
      tags: ["自我怀疑", "沟通", "突破"],
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-soft-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="ml-3 text-xl font-bold text-gray-800">成长日志</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowAddEntry(true)}
              className="px-4 py-2 bg-coral-400 text-white rounded-full text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              写新日志
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">记录你的成长轨迹</h2>
          <p className="text-gray-500">每一次反思都是进步的开始</p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
          <h3 className="font-semibold text-gray-800 mb-3">本周回顾</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sage-500">{journalStats.totalEntries}</div>
              <div className="text-xs text-gray-500">记录天数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-coral-500">{getMoodEmoji(journalStats.averageMood)}</div>
              <div className="text-xs text-gray-500">平均心情</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-green">{journalStats.averageProductivity}</div>
              <div className="text-xs text-gray-500">完成任务</div>
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600/60 mb-2">还没有写过日记</p>
            <p className="text-sm text-gray-600/50 mb-4">开始记录你的成长历程吧</p>
            <button
              onClick={() => setShowAddEntry(true)}
              className="bg-brand-green text-white px-6 py-2 rounded-full hover:bg-brand-green/90 transition-colors"
            >
              写第一篇日记
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-20">
            {entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl p-5 shadow-soft-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">{entry.title}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{entry.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.content}</p>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inspiration */}
        <div className="bg-gradient-to-r from-coral-100 to-sage-100 rounded-2xl p-5">
          <div className="flex items-start">
            <Heart className="w-6 h-6 text-brand-coral mt-1 mr-3" />
            <div>
              <h3 className="font-semibold text-brand-green mb-2">今日感悟</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                "每一个微小的进步，都是向更好的自己迈进的一步。记录下来，让成长看得见。"
              </p>
            </div>
          </div>
        </div>

        {/* 写日记弹窗 */}
        {showAddEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white p-4 border-b border-light-gray">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-soft-gray">写日记</h3>
                  <button
                    onClick={() => setShowAddEntry(false)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* 日期选择 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">日期</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                  />
                </div>

                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">标题（可选）</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="今天的主题..."
                    className="w-full p-3 border border-light-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                  />
                </div>

                {/* 心情、精力、效率 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-soft-gray mb-2">心情</label>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setNewEntry((prev) => ({ ...prev, mood: mood as any }))}
                          className={`text-2xl p-1 rounded-lg transition-all ${
                            newEntry.mood === mood ? "bg-yellow-100 scale-110" : "hover:bg-gray-100"
                          }`}
                        >
                          {getMoodEmoji(mood)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-gray mb-2">精力</label>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((energy) => (
                        <button
                          key={energy}
                          onClick={() => setNewEntry((prev) => ({ ...prev, energy: energy as any }))}
                          className={`w-4 h-6 rounded-sm transition-all ${
                            energy <= newEntry.energy ? "bg-gentle-blue" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-gray mb-2">效率</label>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((productivity) => (
                        <button
                          key={productivity}
                          onClick={() => setNewEntry((prev) => ({ ...prev, productivity: productivity as any }))}
                          className={`w-4 h-6 rounded-sm transition-all ${
                            productivity <= newEntry.productivity ? "bg-sunrise-coral" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 主要内容 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">今天的反思</label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="写下你今天的想法、感受和收获..."
                    className="w-full p-3 border border-light-gray rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                  />
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">标签</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentTagInput}
                      onChange={(e) => setCurrentTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      placeholder="添加标签..."
                      className="flex-1 p-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-sage-green text-white rounded-lg text-sm hover:bg-sage-green/90 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  {newEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {newEntry.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => removeTag(tag)}
                          className="text-xs px-2 py-1 bg-sage-light text-sage-green rounded-full cursor-pointer hover:bg-sage-green hover:text-white transition-colors"
                        >
                          #{tag} ×
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 今日成就 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">今日成就</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentAchievement}
                      onChange={(e) => setCurrentAchievement(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                      placeholder="记录你的成就..."
                      className="flex-1 p-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                    <button
                      onClick={addAchievement}
                      className="px-3 py-2 bg-sunrise-coral text-white rounded-lg text-sm hover:bg-sunrise-coral/90 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  {newEntry.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {newEntry.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm text-soft-gray flex items-start gap-2">
                          <span className="text-sunrise-coral mt-0.5">🏆</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 感恩 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">感恩的事</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentGratitude}
                      onChange={(e) => setCurrentGratitude(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addGratitude()}
                      placeholder="感恩什么..."
                      className="flex-1 p-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                    <button
                      onClick={addGratitude}
                      className="px-3 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  {newEntry.gratitude.length > 0 && (
                    <ul className="space-y-1">
                      {newEntry.gratitude.map((item, index) => (
                        <li key={index} className="text-sm text-soft-gray flex items-start gap-2">
                          <Heart className="w-3 h-3 text-pink-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 明日目标 */}
                <div>
                  <label className="block text-sm font-medium text-soft-gray mb-1">明日目标</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentGoal}
                      onChange={(e) => setCurrentGoal(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addGoal()}
                      placeholder="明天想做什么..."
                      className="flex-1 p-2 border border-light-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-green/50"
                    />
                    <button
                      onClick={addGoal}
                      className="px-3 py-2 bg-gentle-blue text-white rounded-lg text-sm hover:bg-gentle-blue/90 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  {newEntry.tomorrowGoals.length > 0 && (
                    <ul className="space-y-1">
                      {newEntry.tomorrowGoals.map((goal, index) => (
                        <li key={index} className="text-sm text-soft-gray flex items-start gap-2">
                          <Heart className="w-3 h-3 text-gentle-blue mt-0.5" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 反思提示 */}
                {prompts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-soft-gray mb-2">💡 反思提示</h4>
                    <div className="space-y-2">
                      {prompts.slice(0, 3).map((prompt) => (
                        <div key={prompt.id} className="bg-gentle-blue/10 rounded-lg p-3">
                          <p className="text-sm text-soft-gray">{prompt.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t border-light-gray">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEntry}
                    disabled={!newEntry.content.trim()}
                    className="flex-1 bg-sage-green text-white py-3 rounded-xl font-medium hover:bg-sage-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    保存日记
                  </button>
                  <button
                    onClick={() => setShowAddEntry(false)}
                    className="px-4 py-3 border border-light-gray rounded-xl text-soft-gray hover:bg-light-gray transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/challenges" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs mt-1">挑战</span>
          </Link>
          <div className="relative -mt-8">
            <Link
              href="/task-breakdown"
              className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center shadow-lg"
            >
              <Plus className="w-6 h-6 text-white" />
            </Link>
          </div>
          <Link href="/journal" className="flex flex-col items-center text-coral-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs mt-1">日志</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
