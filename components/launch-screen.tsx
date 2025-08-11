"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export type LaunchVariant = 1 | 2 | 3

const COPY: Record<LaunchVariant, { title: string; subtitle: string }> = {
  1: {
    title: "专业的拖延克服助手",
    subtitle: "要么行动，要么放下",
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
    <div className="min-h-screen w-full bg-momentum-cream flex flex-col items-center justify-between text-momentum-forest">
      {/* Top brand lockup */}
      <header className="w-full max-w-screen-md px-6 pt-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="rounded-2xl bg-white/60 shadow-sm p-3">
            <Image
              src="/images/logo-momentum.png"
              alt="Momentum Logo"
              width={48}
              height={48}
              priority
              sizes="(max-width: 768px) 48px, 48px"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="leading-tight">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">即刻行动小M</h1>
            <p className="text-sm md:text-base tracking-[0.25em] uppercase text-momentum-muted">Momentum</p>
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
          <div className="absolute inset-x-0 -bottom-6 mx-auto h-56 max-w-xl rounded-[48px] bg-gradient-to-t from-momentum-coral/20 to-transparent blur-2xl opacity-70" />
          <div className="w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
            <Image
              src="/images/logo-momentum.png"
              alt="Momentum Logo"
              width={256}
              height={256}
              priority
              sizes="(max-width: 768px) 224px, 256px"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Copy block */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">{title ?? copy.title}</h2>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-momentum-muted">{subtitle ?? copy.subtitle}</p>
          </div>
        </motion.div>
      </main>

      {/* CTA */}
      <footer className="w-full max-w-screen-md px-6 pb-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ translateY: -2 }}
          onClick={onStart}
          className="w-full momentum-button-primary rounded-2xl py-4 md:py-5 text-white text-lg md:text-xl font-medium shadow-lg"
          aria-label="开始使用"
        >
          开始使用
        </motion.button>
        <p className="mt-4 text-center text-xs md:text-sm text-momentum-muted">
          专业拖延克服 · 温暖陪伴 · 要么行动，要么放下
        </p>
      </footer>
    </div>
  )
}
