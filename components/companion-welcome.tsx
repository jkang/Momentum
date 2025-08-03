"use client"

export function CompanionWelcome() {
  return (
    <section className="flex flex-col items-center justify-center pt-8 pb-12 animate-slide-up">
      <div className="relative mb-6">
        <img
          className="w-48 h-48"
          src="/placeholder.svg?height=192&width=192&text=成长的小树"
          alt="A vibrant green sapling with several healthy leaves, depicted in a minimalist, friendly illustration style, symbolizing growth and progress for a habit-building app. The plant should look slightly more mature than a brand new sprout."
        />
      </div>
      <h2 className="text-2xl font-bold text-brand-green">你的成长，我都看在眼里</h2>
      <p className="mt-2 text-gray-500 max-w-xs mx-auto">
        每一个微小的进步，都是一次了不起的胜利。今天，我们从哪里开始呢？
      </p>
    </section>
  )
}
