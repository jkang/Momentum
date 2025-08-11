"use client"

import Image from "next/image"
import AppHeader from "@/components/app-header"
import BottomNavigation from "@/components/bottom-navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-momentum-cream pb-16">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden border border-momentum-sage-light-20 bg-white">
            <Image
              src="/images/logo-momentum-small.png"
              alt="Momentum Logo"
              width={80}
              height={80}
              sizes="(max-width: 768px) 80px, 80px"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-semibold text-momentum-forest mb-2">关于 Momentum</h2>
          <p className="text-momentum-muted max-w-2xl mx-auto leading-relaxed text-sm">
            Momentum 是一款帮助你温柔告别拖延的 AI助手
          </p>
          <p className="text-momentum-muted max-w-2xl mx-auto leading-relaxed text-sm">
            我们用“更小的下一步”和“即时反馈”帮助你启动、坚持并完成关键任务。
          </p>
        </section>

        <section className="text-center space-y-3">
          <h3 className="text-lg font-medium text-momentum-forest">反馈与联系</h3>
          <p className="text-sm text-momentum-muted">扫码添加，告诉我们你的想法与建议：</p>
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-lg border border-momentum-sage-light-20">
              <Image
                src="/images/feedback-qr.png"
                alt="反馈二维码"
                width={220}
                height={220}
                className="w-[220px] h-[220px] object-contain"
                priority
              />
            </div>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}
