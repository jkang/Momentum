"use client"

import { useState, useEffect } from "react"

interface XiaoMAvatarProps {
  mood?: "happy" | "caring" | "thinking" | "celebrating"
  size?: "sm" | "md" | "lg"
}

export function XiaoMAvatar({ mood = "happy", size = "md" }: XiaoMAvatarProps) {
  const [currentMood, setCurrentMood] = useState(mood)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const moodEmojis = {
    happy: "😊",
    caring: "🤗",
    thinking: "🤔",
    celebrating: "🎉",
  }

  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-sage-green to-gentle-blue flex items-center justify-center shadow-soft transition-all duration-300 hover:scale-105`}
    >
      <span className="text-lg">{moodEmojis[currentMood]}</span>
    </div>
  )
}
