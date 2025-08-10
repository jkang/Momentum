"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SplashScreen() {
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    // 检查用户是否已完成引导
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")

    if (hasCompletedOnboarding) {
      router.push("/")
    } else {
      router.push("/welcome-newuser")
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-end pb-16 px-8"
      style={{
        backgroundImage: "url('/splash-background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#f5f3f0",
      }}
    >
      {showButton && (
        <div className="animate-fade-in">
          <Button
            onClick={handleStart}
            className="w-full bg-sage-green hover:bg-sage-dark text-white py-4 rounded-2xl font-semibold text-lg shadow-lg"
          >
            开始
          </Button>
        </div>
      )}
    </div>
  )
}
