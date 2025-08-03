"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  type: "ai" | "user"
  content: string
  timestamp: Date
  isTemplate?: boolean
}

export default function TaskBreakdownPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-soft-xs">
        <div className="flex items-center">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-3 text-xl font-bold text-gray-800">任务拆解</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-coral-400 to-coral-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl">🚀</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">开始新的挑战</h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            让小M帮你把复杂的任务分解成简单的步骤，一步一步实现目标。
          </p>
          <Link
            href="/chat"
            className="bg-coral-400 text-white px-8 py-3 rounded-full font-medium hover:bg-coral-500 transition-colors inline-block"
          >
            与小M对话
          </Link>
        </div>
      </main>
    </div>
  )
}
