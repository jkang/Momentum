"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Logo } from "./logo"

export default function AppHeader() {
  const [todoCount, setTodoCount] = useState(0)

  useEffect(() => {
    try {
      const todos = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
      setTodoCount(todos.filter((t: any) => !t.completed).length)
    } catch {
      setTodoCount(0)
    }
  }, [])

  return (
    <div className="bg-momentum-white shadow-sm border-b border-momentum-sage-light-20">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo />
          <div>
            <h1 className="text-lg font-semibold text-momentum-forest">小M助手</h1>
            <p className="text-sm text-momentum-muted">要么行动，要么放下</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="inline-flex items-center h-9 px-3 rounded-md border border-momentum-sage-light-20 text-momentum-sage hover:text-momentum-forest hover:bg-momentum-sage-light-10 transition-colors text-sm"
          >
            聊天历史
          </Link>
        </div>
      </div>
    </div>
  )
}
