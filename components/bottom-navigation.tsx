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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-momentum-sage-light-20 safe-x">
      <div
        className="max-w-4xl mx-auto flex justify-around items-center px-4 pt-2"
        style={{
          paddingBottom: `calc(12px + var(--safe-area-inset-bottom))`
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center min-w-[60px] min-h-[48px] px-2 py-1 rounded-lg touch-feedback transition-all duration-200 ${
                active
                  ? "text-momentum-sage bg-momentum-sage-light-20"
                  : "text-momentum-muted hover:text-momentum-forest hover:bg-momentum-sage-light-10"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              {/* 角标 */}
              {item.href === "/todolist" && todoCount > 0 && (
                <span className="absolute -top-1 right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-momentum-coral text-white text-[11px] leading-[20px] text-center border-2 border-white shadow-sm">
                  {todoCount > 99 ? "99+" : todoCount}
                </span>
              )}
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
