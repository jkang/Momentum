"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useParams } from "next/navigation"

export default function TutorialPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug || "github"
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/tutorials/${slug}.md`)
      .then((r) => {
        if (!r.ok) throw new Error(`未找到教程：${slug}`)
        return r.text()
      })
      .then((text) => {
        if (mounted) {
          setContent(text)
          setError(null)
        }
      })
      .catch((e) => {
        if (mounted) setError(e.message || "加载失败")
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-momentum-muted">正在加载教程...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <article className="prose lg:prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </main>
  )
}
