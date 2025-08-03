"use client"

import { useState } from "react"
import {
  ChevronLeft,
  FileText,
  Lightbulb,
  Plus,
  Check,
  Home,
  CheckSquare,
  Book,
  User,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

interface ActionItem {
  id: number
  text: string
  completed: boolean
}

export default function CreateTaskListPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 1,
      text: "用10分钟，列出对报告的所有疑问（不求完美，目标是头脑风暴）",
      completed: false,
    },
    {
      id: 2,
      text: "安排15分钟与主管沟通，确认报告范围和期望（记住：提问是专业的表现，不是能力不足）",
      completed: false,
    },
    {
      id: 3,
      text: "创建一个简单的报告大纲，确定需要分析的关键维度",
      completed: false,
    },
    {
      id: 4,
      text: "为每个竞品分配30分钟，收集基本信息（使用番茄工作法，每30分钟休息5分钟）",
      completed: false,
    },
    {
      id: 5,
      text: "咨询产品部同事获取额外洞察（记住：团队合作是工作的一部分）",
      completed: false,
    },
    {
      id: 6,
      text: "创建比较表格，突出各竞品的优缺点",
      completed: false,
    },
    {
      id: 7,
      text: "撰写初稿（不求完美，目标是有一个可迭代的版本）",
      completed: false,
    },
    {
      id: 8,
      text: "请一位信任的同事审阅并提供反馈",
      completed: false,
    },
    {
      id: 9,
      text: "根据反馈修改并完善报告",
      completed: false,
    },
  ])

  const [reflection, setReflection] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const toggleActionItem = (id: number) => {
    setActionItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(
      "currentActionPlan",
      JSON.stringify({
        id: "competitive-analysis",
        title: "竞品分析报告",
        steps: actionItems.map((item) => ({
          id: item.id,
          text: item.text,
          completed: item.completed,
        })),
        reflection,
        createdAt: new Date().toISOString(),
      }),
    )

    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const phase1Items = actionItems.slice(0, 3)
  const phase2Items = actionItems.slice(3, 5)
  const phase3Items = actionItems.slice(5, 9)

  return (
    <div className="h-screen flex flex-col">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-16 inset-x-0 flex justify-center z-50">
          <div className="sage-500 text-white px-6 py-3 rounded-full shadow-soft-sm flex items-center">
            <Check className="w-4 h-4 mr-2" />
            <span>行动清单已保存</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white p-4 shadow-soft-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/task-breakdown"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 mr-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">行动清单</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSave}
              className="px-4 py-2 coral-400 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Mission Title Section */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full coral-400 flex items-center justify-center text-white mr-3">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">竞品分析报告</h2>
                <p className="text-gray-500 text-sm">周五截止</p>
              </div>
            </div>
            <p className="text-gray-600 mt-3">为周五会议准备一份竞品分析报告</p>
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="mb-6">
          <div className="sage-100 rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full sage-300 flex-shrink-0 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-700 mb-2">小M的建议</h3>
                <p className="text-gray-700 leading-relaxed">
                  我们已经讨论了你对这个任务的担忧。让我们把刚才的对话转化为具体的行动步骤，这样你就可以从最小的、最不具威胁性的任务开始，逐步建立信心。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action List Section */}
        <section className="mb-6">
          {/* Phase 1 */}
          <h3 className="font-semibold text-gray-800 mb-4">第一阶段：准备与规划</h3>
          <div className="mb-6">
            {phase1Items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-white p-4 rounded-xl mb-3 shadow-soft-xs transition-colors ${
                  item.completed ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleActionItem(item.id)}
                    className="w-4 h-4 text-coral-400 accent-coral-400"
                  />
                </div>
                <p className={`ml-4 transition-all ${item.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Phase 2 */}
          <h3 className="font-semibold text-gray-800 mb-4 mt-6">第二阶段：数据收集</h3>
          <div className="mb-6">
            {phase2Items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-white p-4 rounded-xl mb-3 shadow-soft-xs transition-colors ${
                  item.completed ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleActionItem(item.id)}
                    className="w-4 h-4 text-coral-400 accent-coral-400"
                  />
                </div>
                <p className={`ml-4 transition-all ${item.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Phase 3 */}
          <h3 className="font-semibold text-gray-800 mb-4 mt-6">第三阶段：分析与撰写</h3>
          <div className="mb-6">
            {phase3Items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center bg-white p-4 rounded-xl mb-3 shadow-soft-xs transition-colors ${
                  item.completed ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleActionItem(item.id)}
                    className="w-4 h-4 text-coral-400 accent-coral-400"
                  />
                </div>
                <p className={`ml-4 transition-all ${item.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Add New Action Item */}
          <div className="flex items-center mt-6">
            <button className="flex items-center text-gray-500 hover:text-coral-500 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              <span>添加自定义行动项</span>
            </button>
          </div>
        </section>

        {/* Reflection Section */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <h3 className="font-semibold text-gray-700 mb-3">行动后反思</h3>
            <p className="text-gray-600 text-sm mb-4">完成任务后，记得回来反思你的进步和学到的经验</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
              placeholder="完成后在这里记录你的感受和收获..."
              rows={3}
            />
          </div>
        </section>
      </main>

      {/* Chat FAB */}
      <div className="fixed bottom-20 right-4">
        <Link
          href="/chat"
          className="w-12 h-12 rounded-full sage-400 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center text-gray-400">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">首页</span>
          </Link>
          <Link href="/challenges" className="flex flex-col items-center text-coral-500">
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs mt-1">挑战</span>
          </Link>
          <div className="relative -mt-8">
            <Link
              href="/new-challenge"
              className="w-14 h-14 rounded-full coral-400 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-6 h-6 text-white" />
            </Link>
          </div>
          <Link href="/journal" className="flex flex-col items-center text-gray-400">
            <Book className="w-5 h-5" />
            <span className="text-xs mt-1">日志</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
