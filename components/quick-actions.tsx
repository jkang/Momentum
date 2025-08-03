"use client"

import { Rocket, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/new-challenge"
          className="bg-white rounded-2xl p-5 shadow-soft-sm text-center flex flex-col items-center justify-center hover:shadow-soft-sm transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-coral-100 flex items-center justify-center mb-3">
            <Rocket className="w-6 h-6 text-brand-coral" />
          </div>
          <h3 className="font-bold text-gray-800">开启新挑战</h3>
          <p className="text-xs text-gray-500 mt-1">拆解一个新挑战</p>
        </Link>

        <Link
          href="/challenges"
          className="bg-white rounded-2xl p-5 shadow-soft-sm text-center flex flex-col items-center justify-center hover:shadow-soft-sm transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-sage-500" />
          </div>
          <h3 className="font-bold text-gray-800">继续进行中</h3>
          <p className="text-xs text-gray-500 mt-1">完成下一步</p>
        </Link>
      </div>
    </section>
  )
}
