"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

export default function PRDPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/prd.md")
      .then((res) => {
        if (!res.ok) {
          throw new Error("无法加载PRD文档")
        }
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/prototypes">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回原型
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">产品需求文档</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Momentum - 个人成长助手 PRD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">加载文档中...</span>
              </div>
            )}

            {error && (
              <div className="p-8 text-center">
                <div className="text-red-600 mb-2">加载失败</div>
                <div className="text-gray-500 text-sm">{error}</div>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                  重新加载
                </Button>
              </div>
            )}

            {content && !loading && (
              <div className="prose prose-lg max-w-none p-8">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-600 leading-relaxed mb-4">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
                    ),
                    table: ({ children }) => (
                      <table className="w-full border-collapse border border-gray-300 my-4">{children}</table>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
