"use client"

import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, MessageSquare, CheckSquare, Info } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [todoCount, setTodoCount] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [clickingTab, setClickingTab] = useState<string | null>(null)

  // 防抖导航处理函数
  const handleNavigation = useCallback((href: string, tabId: string) => {
    if (isNavigating) return // 防止重复点击

    setIsNavigating(true)
    setClickingTab(tabId)

    // 添加视觉反馈延迟
    setTimeout(() => {
      router.push(href)
      setIsNavigating(false)
      setClickingTab(null)
    }, 150) // 150ms 的反馈延迟
  }, [isNavigating, router])

  // 异步化 localStorage 操作
  useEffect(() => {
    const readCount = () => {
      // 使用 setTimeout 将 localStorage 操作移到下一个事件循环
      setTimeout(() => {
        try {
          const todos = JSON.parse(localStorage.getItem("momentum-todos") || "[]")
          setTodoCount((todos || []).filter((t: any) => !t.completed).length)
        } catch {
          setTodoCount(0)
        }
      }, 0)
    }
    readCount()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "momentum-todos") {
        // 异步处理 storage 事件
        setTimeout(() => readCount(), 0)
      }
    }
    window.addEventListener("storage", onStorage)
    const onCustom = () => setTimeout(() => readCount(), 0)
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
          paddingBottom: `calc(6px + var(--safe-area-inset-bottom))`
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          const isClicking = clickingTab === item.href
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href, item.href)}
              disabled={isNavigating}
              data-clickable="true"
              className={`relative flex flex-col items-center min-w-[60px] min-h-[48px] px-2 py-1 rounded-lg touch-feedback transition-all duration-200 ${
                active
                  ? "text-momentum-sage bg-momentum-sage-light-20"
                  : "text-momentum-muted hover:text-momentum-forest hover:bg-momentum-sage-light-10"
              } ${
                isClicking ? 'scale-95 bg-momentum-sage-light-10' : ''
              } ${
                isNavigating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform duration-150 ${
                isClicking ? 'scale-90' : ''
              }`} />
              {/* 角标 */}
              {item.href === "/todolist" && todoCount > 0 && (
                <span className="absolute -top-1 right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-momentum-coral text-white text-[11px] leading-[20px] text-center border-2 border-white shadow-sm">
                  {todoCount > 99 ? "99+" : todoCount}
                </span>
              )}
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
