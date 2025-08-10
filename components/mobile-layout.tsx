"use client"

import { useEffect, useState } from "react"
import BottomNavigation from "./bottom-navigation"
import { useKeyboardHeight, useSafeArea } from "./mobile-enhancements"

interface MobileLayoutProps {
  children: React.ReactNode
  showBottomNav?: boolean
  className?: string
}

export default function MobileLayout({ 
  children, 
  showBottomNav = true, 
  className = "" 
}: MobileLayoutProps) {
  const keyboardHeight = useKeyboardHeight()
  const safeArea = useSafeArea()
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    setIsKeyboardOpen(keyboardHeight > 0)
  }, [keyboardHeight])

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* 主要内容区域 */}
      <div 
        className="relative"
        style={{
          paddingBottom: showBottomNav && !isKeyboardOpen 
            ? `calc(var(--mobile-nav-height) + var(--safe-area-inset-bottom))` 
            : "0",
          marginBottom: isKeyboardOpen ? `${keyboardHeight}px` : "0",
        }}
      >
        {children}
      </div>

      {/* 底部导航栏 */}
      {showBottomNav && !isKeyboardOpen && <BottomNavigation />}
    </div>
  )
}

interface MobilePageProps {
  children: React.ReactNode
  title?: string
  showHeader?: boolean
  showBottomNav?: boolean
  className?: string
  onRefresh?: () => Promise<void> | void
}

export function MobilePage({ 
  children, 
  title, 
  showHeader = false, 
  showBottomNav = true,
  className = "",
  onRefresh
}: MobilePageProps) {
  return (
    <MobileLayout showBottomNav={showBottomNav} className={className}>
      {showHeader && title && (
        <header className="bg-white border-b border-momentum-sage-light-20 safe-top">
          <div className="max-w-4xl mx-auto px-4 py-4 mobile-spacing">
            <h1 className="text-lg font-semibold text-momentum-forest">{title}</h1>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </MobileLayout>
  )
}

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  swipeable?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function MobileCard({ 
  children, 
  className = "", 
  onClick,
  swipeable = false,
  onSwipeLeft,
  onSwipeRight
}: MobileCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeable) return
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !swipeable) return
    setCurrentX(e.touches[0].clientX - startX)
  }

  const handleTouchEnd = () => {
    if (!isDragging || !swipeable) return

    const threshold = 100
    if (Math.abs(currentX) > threshold) {
      if (currentX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (currentX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setCurrentX(0)
    setIsDragging(false)
  }

  return (
    <div
      className={`bg-white rounded-lg border border-momentum-sage-light-20 p-4 shadow-sm transition-all duration-200 touch-feedback ${className}`}
      style={{
        transform: isDragging && swipeable ? `translateX(${currentX}px)` : "translateX(0)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface MobileButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export function MobileButton({ 
  children, 
  onClick, 
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  fullWidth = false
}: MobileButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 touch-feedback rounded-lg disabled:opacity-50 disabled:pointer-events-none"
  
  const variantClasses = {
    primary: "bg-momentum-coral text-white hover:bg-momentum-coral-dark",
    secondary: "bg-momentum-sage-light-20 text-momentum-sage-dark hover:bg-momentum-sage-light-30",
    outline: "border border-momentum-sage-light-20 text-momentum-sage hover:bg-momentum-sage-light-10"
  }
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-12 px-6 text-lg"
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

interface MobileInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number"
  disabled?: boolean
  className?: string
  onEnter?: () => void
}

export function MobileInput({ 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  disabled = false,
  className = "",
  onEnter
}: MobileInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          onEnter()
        }
      }}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full h-11 px-4 text-base bg-white border border-momentum-sage-light-20 rounded-lg focus:border-momentum-sage focus:ring-2 focus:ring-momentum-sage/20 transition-colors ${className}`}
    />
  )
}
