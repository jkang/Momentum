import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export default function Logo({ size = "md", showText = false, className }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="即刻行动 Logo"
          width={96}
          height={96}
          className={cn(sizeClasses[size], "rounded-full object-contain")}
          priority
        />
      </div>
      {showText && <div className={cn("font-semibold text-brand-green", textSizeClasses[size])}>即刻行动</div>}
    </div>
  )
}
