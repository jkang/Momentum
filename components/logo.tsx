"use client"

import Image from "next/image"

export type LogoProps = {
  size?: number
  className?: string
  showText?: boolean
}

export function Logo({ size = 40, className = "", showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <Image
          src="/images/logo-momentum-small.png"
          alt="Momentum Logo"
          width={size}
          height={size}
          priority
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="text-lg font-semibold text-momentum-forest">小M助手</div>
          <div className="text-sm text-momentum-muted">要么行动，要么放下</div>
        </div>
      )}
    </div>
  )
}

export default Logo
