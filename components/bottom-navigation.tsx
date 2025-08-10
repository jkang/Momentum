"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, MessageCircle, TrendingUp, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "主页" },
  { href: "/challenges", icon: Target, label: "挑战" },
  { href: "/chat", icon: MessageCircle, label: "对话" },
  { href: "/growth", icon: TrendingUp, label: "成长" },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const [showDevTools, setShowDevTools] = useState(false)

  return (
    <>
      {/* Chat FAB */}
      <div className="fixed bottom-20 right-4 z-50">
        {showDevTools && (
          <div className="flex flex-col gap-2 mb-2">
            <Link href="/prototypes">
              <Button
                size="sm"
                className="bg-gentle-blue hover:bg-blue-600 text-white shadow-lg rounded-full w-12 h-12 p-0"
              >
                <Smartphone className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
        <Link href="/chat">
          <Button className="bg-sage-green hover:bg-sage-dark text-white shadow-lg rounded-full w-14 h-14 p-0">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-light-gray z-40">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-sage-green bg-sage-light"
                    : "text-soft-gray hover:text-sage-green hover:bg-sage-light/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
