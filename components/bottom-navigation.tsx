"use client"

import { Home, CheckSquare, BookOpen, User, Plus, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { id: "home", icon: Home, label: "首页", href: "/" },
    { id: "challenges", icon: CheckSquare, label: "挑战", href: "/challenges" },
    { id: "journal", icon: BookOpen, label: "日志", href: "/journal" },
    { id: "profile", icon: User, label: "我的", href: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0">
      {/* Chat FAB */}
      <div className="fixed bottom-20 right-4">
        <Link
          href="/chat"
          className="w-12 h-12 rounded-full bg-sage-400 flex items-center justify-center shadow-lg hover:bg-sage-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center transition-colors ${
                  isActive ? "text-coral-500" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}

          {/* Center FAB */}
          <div className="relative -mt-8">
            <Link
              href="/new-challenge"
              className="w-14 h-14 rounded-full bg-coral-400 flex items-center justify-center shadow-lg hover:bg-coral-500 transition-colors"
            >
              <Plus className="w-6 h-6 text-white" />
            </Link>
          </div>

          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center transition-colors ${
                  isActive ? "text-coral-500" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
