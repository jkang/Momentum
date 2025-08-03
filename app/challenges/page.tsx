"use client"

import { useState } from "react"
import { ChevronRight, Zap, Bell } from "lucide-react"
import Link from "next/link"

export default function ChallengesPage() {
  const [challenges] = useState([
    {
      id: 1,
      title: "竞品分析报告",
      description: "为周五会议准备一份竞品分析报告",
      deadline: "周五截止",
      progress: 0,
      status: "未开始",
      statusColor: "coral",
    },
    {
      id: 2,
      title: "用户调研整理",
      description: "整理上周收集的用户反馈并提出改进建议",
      deadline: "进行中",
      progress: 65,
      status: "已完成 3/5 步骤",
      statusColor: "sage",
    },
    {
      id: 3,
      title: "学习 UI 设计基础",
      description: "完成 Figma 入门课程的第一单元",
      deadline: "个人成长",
      progress: 30,
      status: "已完成 1/3 单元",
      statusColor: "gray",
    },
  ])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-soft-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-coral-400 flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-800">即刻行动</h1>
          </div>
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="ml-2 w-10 h-10 rounded-full bg-sage-400 flex items-center justify-center text-white">
              <span className="text-sm font-medium">思</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Greeting Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">你好，思慧！</h2>
          <p className="text-gray-600">周一下午好，今天感觉如何？</p>
        </section>

        {/* Daily Progress Section */}
        <section className="mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">今日进度</h3>
              <span className="text-sm text-coral-500">43%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-coral-400 h-2 rounded-full" style={{ width: "43%" }}></div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-500">已完成 3 项任务</span>
              <span className="text-gray-500">剩余 4 项</span>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">我的挑战</h3>
            <button className="text-sm text-coral-500 flex items-center">
              查看全部 <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          {/* Challenge Cards */}
          <div>
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white rounded-2xl p-5 shadow-soft-sm mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">{challenge.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      challenge.statusColor === "coral"
                        ? "bg-coral-100 text-coral-500"
                        : challenge.statusColor === "sage"
                          ? "bg-sage-100 text-sage-500"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {challenge.deadline}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2 mb-4">{challenge.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      challenge.statusColor === "coral"
                        ? "bg-coral-400"
                        : challenge.statusColor === "sage"
                          ? "bg-sage-400"
                          : "bg-gray-400"
                    }`}
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{challenge.status}</span>
                  <Link
                    href={challenge.progress === 0 ? "/task-breakdown" : "/action-list"}
                    className={`text-sm font-medium ${
                      challenge.statusColor === "coral"
                        ? "text-coral-500"
                        : challenge.statusColor === "sage"
                          ? "text-sage-500"
                          : "text-gray-500"
                    }`}
                  >
                    {challenge.progress === 0 ? "开始行动" : "继续"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">小M的洞察</h3>
          <div className="bg-sage-100 rounded-2xl p-5 shadow-soft-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sage-300 flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-700 leading-relaxed">
                  我注意到你有一个新的竞品分析任务还没开始。这类任务常常让人感到压力，但拆解后会变得简单很多。需要我帮你一起思考如何着手吗？
                </p>
                <div className="mt-4 flex">
                  <Link
                    href="/task-breakdown"
                    className="bg-sage-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-sage-500 transition-colors"
                  >
                    是的，帮我拆解
                  </Link>
                  <button className="ml-3 text-gray-600 px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                    稍后再说
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
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
          <Link href="/challenges" className="flex flex-col items-center text-coral-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs mt-1">挑战</span>
          </Link>
          <div className="relative -mt-8">
            <Link
              href="/task-breakdown"
              className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center shadow-lg hover:bg-coral-500 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
          <Link href="/journal" className="flex flex-col items-center text-gray-400">
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

      {/* Chat FAB */}
      <div className="fixed bottom-20 right-4">
        <Link
          href="/chat"
          className="w-12 h-12 rounded-full bg-sage-400 flex items-center justify-center shadow-lg hover:bg-sage-500 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
