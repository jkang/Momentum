"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, CheckSquare, Info } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()
  const [todoCount, setTodoCount] = useState(0)
  useEffect(() => {
    const readCount = () => {
      try {
        const todos = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
        setTodoCount((todos || []).filter((t: any) => !t.completed).length)
      } catch {
        setTodoCount(0)
      }
    }
    readCount()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "momentum-todos") readCount()
    }
    window.addEventListener("storage", onStorage)
    const onCustom = () => readCount()
    window.addEventListener("todos:updated", onCustom as any)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("todos:updated", onCustom as any)
    }
  }, [])

  const items = [
    { href: "/", label: "主页", icon: Home },
    { href: "/chat", label: "对话", icon: MessageSquare },
    { href: "/todolist", label: "待办", icon: CheckSquare },
    { href: "/about", label: "关于", icon: Info },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-light-gray px-6 pt-2 pb-3">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center w-16 ${
                active ? "text-momentum-sage" : "text-soft-gray/60"
              } hover:text-momentum-forest transition-colors`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              {/* 角标 */}
              {item.href === "/todolist" && todoCount > 0 && (
                <span className="absolute -top-1 left-7 min-w-[18px] h-[18px] px-1 rounded-full bg-momentum-sage text-white text-[10px] leading-[18px] text-center border border-white">
                  {todoCount > 99 ? "99+" : todoCount}
                </span>
              )}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
