"use client"

import { useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-soft-bg flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-coral-200/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-sage-200/40 rounded-full blur-3xl"></div>
      <div className="relative text-center px-8">
        <div className="animate-plant-grow">
          <img
            className="w-48 h-48 mx-auto mb-8"
            src="/placeholder.svg?height=192&width=192&text=小树苗"
            alt="minimalist illustration of a small, vibrant green sapling sprouting from a mound of earth, soft pastel background, symbolizing growth and new beginnings, gentle and encouraging style"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h1 className="text-4xl font-extrabold text-[#4A5568]">即刻行动</h1>
          <p className="mt-4 text-lg text-gray-500">从今天起，和拖延温柔告别</p>
        </div>
      </div>
      <div className="absolute bottom-10 text-xs text-gray-400">你的朋友 小M</div>
    </div>
  )
}
