"use client"

import { ArrowLeft, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Logo } from "./logo"

interface HeaderProps {
  title?: string
  showBack?: boolean
  showSettings?: boolean
  showLogo?: boolean
  onBack?: () => void
}

export function Header({ title, showBack = false, showSettings = false, showLogo = false, onBack }: HeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {showLogo && <Logo size="sm" />}

        {title && <h1 className="text-lg font-semibold text-gray-800">{title}</h1>}
      </div>

      {showSettings && (
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </header>
  )
}
