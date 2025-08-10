"use client"
import { motion } from "framer-motion"

export type LaunchVariant = 1 | 2 | 3

const COPY: Record<LaunchVariant, { title: string; subtitle: string }> = {
  1: {
    title: "懂你的 AI 心理伙伴",
    subtitle: "温暖陪伴，轻轻推你向前",
  },
  2: {
    title: "懂你心的 AI 成长伙伴",
    subtitle: "从今天开始，迈出属于你的第一步",
  },
  3: {
    title: "当你想开始，却不知从何开始",
    subtitle: "我在这里，和你一起走",
  },
}

function TreeOfLife({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Rising sun / coral */}
      <circle cx="100" cy="118" r="46" fill="#F28C78" opacity="0.4" />
      {/* Trunk */}
      <path d="M100 150c-14 0-22-8-22-18 0-10 9-16 22-16s22 6 22 16-8 18-22 18Z" fill="#7A9B7B" />
      {/* Branches */}
      <path d="M100 120c-20-12-30-30-30-50 8 16 20 24 30 28 10-4 22-12 30-28 0 20-10 38-30 50Z" fill="#7A9B7B" />
      {/* Leaves */}
      {[
        [60, 66],
        [75, 52],
        [90, 44],
        [110, 44],
        [125, 52],
        [140, 66],
        [68, 86],
        [82, 76],
        [118, 76],
        [132, 86],
        [100, 66],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={12} ry={18} fill="#7A9B7B" transform={`rotate(${(i - 5) * 6} ${x} ${y})`} />
      ))}
      {/* Coral heart at root */}
      <circle cx="100" cy="112" r="8" fill="#F28C78" />
    </svg>
  )
}

export default function LaunchScreen({
  variant = 1,
  onStart,
  title,
  subtitle,
}: {
  variant?: LaunchVariant
  onStart?: () => void
  title?: string
  subtitle?: string
}) {
  const copy = COPY[variant]

  return (
    <div className="min-h-screen w-full bg-[#F5EFE6] flex flex-col items-center justify-between text-[#45634E]">
      {/* Top brand lockup */}
      <header className="w-full max-w-screen-md px-6 pt-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="rounded-2xl bg-white/60 shadow-sm p-3">
            <TreeOfLife className="w-12 h-12" />
          </div>
          <div className="leading-tight">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">即刻行动</h1>
            <p className="text-sm md:text-base tracking-[0.25em] uppercase text-[#5E7D69]">Momentum</p>
          </div>
        </motion.div>
      </header>

      {/* Center illustration */}
      <main className="flex-1 w-full max-w-screen-md px-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full flex flex-col items-center"
        >
          {/* Soft hill background */}
          <div className="absolute inset-x-0 -bottom-6 mx-auto h-56 max-w-xl rounded-[48px] bg-gradient-to-t from-[#F8D7CC] to-transparent blur-2xl opacity-70" />
          <TreeOfLife className="w-56 h-56 md:w-64 md:h-64" />
          {/* Copy block */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">{title ?? copy.title}</h2>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-[#5E7D69]">{subtitle ?? copy.subtitle}</p>
          </div>
        </motion.div>
      </main>

      {/* CTA */}
      <footer className="w-full max-w-screen-md px-6 pb-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          onClick={onStart}
          className="w-full rounded-2xl py-4 md:py-5 text-white text-lg md:text-xl font-medium shadow-lg"
          style={{
            background: "linear-gradient(180deg, #F4A08F 0%, #F28C78 60%, #EF7A62 100%)",
          }}
          aria-label="开始使用"
        >
          开始使用
        </motion.button>
        <p className="mt-4 text-center text-xs md:text-sm text-[#6C8A76]">
          24/7 私密空间 · 无评判 · 为每一次小小进步鼓掌
        </p>
      </footer>
    </div>
  )
}
