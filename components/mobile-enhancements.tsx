"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  threshold?: number
}

export function PullToRefresh({ onRefresh, children, threshold = 80 }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    let touchStartY = 0
    let scrollTop = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      scrollTop = window.scrollY
      setStartY(touchStartY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollTop > 0) return // 不在顶部时不触发

      // 检查是否点击在可点击元素上，避免拦截按钮点击
      const target = e.target as Element
      if (target.closest('a, button, [role="button"], input, textarea, select, .quick-select-card, .touch-feedback, [data-clickable]')) {
        return // 不拦截交互元素的触摸事件
      }

      const touchY = e.touches[0].clientY
      const distance = touchY - touchStartY

      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })
    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onRefresh, threshold, pullDistance, isRefreshing])

  return (
    <div className="relative">
      {/* 下拉刷新指示器 */}
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-momentum-sage-light-20 transition-all duration-200"
          style={{
            height: `${pullDistance}px`,
            transform: `translateY(-${pullDistance}px)`,
          }}
        >
          <div className="flex items-center gap-2 text-momentum-sage">
            <RefreshCw
              className={`w-5 h-5 ${
                isRefreshing || pullDistance >= threshold ? "animate-spin" : ""
              }`}
            />
            <span className="text-sm">
              {isRefreshing
                ? "刷新中..."
                : pullDistance >= threshold
                ? "松开刷新"
                : "下拉刷新"}
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, className = "" }: SwipeableCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX - startX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

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
      className={`transition-transform duration-200 ${className}`}
      style={{
        transform: isDragging ? `translateX(${currentX}px)` : "translateX(0)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

interface TouchFeedbackProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function TouchFeedback({ children, className = "", onClick }: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      className={`transition-transform duration-100 ${
        isPressed ? "scale-95" : "scale-100"
      } ${className}`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// 移动端键盘适配Hook
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (visualViewport) {
        const keyboardHeight = window.innerHeight - visualViewport.height
        setKeyboardHeight(keyboardHeight > 0 ? keyboardHeight : 0)
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      return () => {
        window.visualViewport?.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return keyboardHeight
}

// 移动端安全区域检测Hook
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(style.getPropertyValue("--safe-area-inset-top") || "0"),
        bottom: parseInt(style.getPropertyValue("--safe-area-inset-bottom") || "0"),
        left: parseInt(style.getPropertyValue("--safe-area-inset-left") || "0"),
        right: parseInt(style.getPropertyValue("--safe-area-inset-right") || "0"),
      })
    }

    updateSafeArea()
    window.addEventListener("resize", updateSafeArea)
    return () => window.removeEventListener("resize", updateSafeArea)
  }, [])

  return safeArea
}
