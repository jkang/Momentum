"use client"

import { Bell } from "lucide-react"

export function Header() {
  return (
    <header className="bg-soft-bg/80 backdrop-blur-sm p-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center">
            <span className="text-brand-green font-bold text-lg">思</span>
          </div>
          <h1 className="ml-3 text-xl font-bold text-brand-green">你好, 思慧</h1>
        </div>
        <div className="flex items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200/50">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
