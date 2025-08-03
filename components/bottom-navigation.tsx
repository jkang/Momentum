"use client"

import { Home, Target, MessageCircle, BarChart3, User, Wrench } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Target, label: "挑战", href: "/challenges" },
  { icon: MessageCircle, label: "对话", href: "/chat" },
  { icon: BarChart3, label: "成长", href: "/growth" },
  { icon: User, label: "我的", href: "/profile" },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const [showDevTools, setShowDevTools] = useState(false)

  // 在开发工具页面不显示底部导航
  if (pathname === "/prototypes" || pathname === "/prd") {
    return null
  }

  return (
    <>
      {/* 开发工具FAB */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          {showDevTools && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-2 space-y-2 min-w-[120px]">
              <Link href="/prototypes">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-blue-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  原型展示
                </Button>
              </Link>
              <Link href="/prd">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-amber-600">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  PRD文档
                </Button>
              </Link>
            </div>
          )}
          <Button
            onClick={() => setShowDevTools(!showDevTools)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            size="sm"
          >
            <Wrench className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-sage-green bg-sage-light"
                    : "text-soft-gray hover:text-sage-green hover:bg-sage-light/50"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
