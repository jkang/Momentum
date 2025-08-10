"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, BookOpen, Target, CheckCircle2, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// 教程元数据
const TUTORIAL_META = {
  github: {
    title: "GitHub 入门教程",
    description: "从零开始学习 GitHub，掌握代码版本管理的基础技能",
    duration: "15-30 分钟",
    difficulty: "入门",
    tags: ["版本控制", "协作", "开源"],
    objectives: ["创建仓库", "提交更改", "开分支", "发起 PR"]
  },
  v0: {
    title: "v0 快速开发教程",
    description: "用 v0 从提示到上线，快速构建现代化 Web 应用",
    duration: "30-45 分钟",
    difficulty: "中级",
    tags: ["AI 开发", "Next.js", "快速原型"],
    objectives: ["生成代码", "本地运行", "修复问题", "部署上线"]
  },
  vercel: {
    title: "Vercel 部署教程",
    description: "学习使用 Vercel 平台快速部署前端项目",
    duration: "10-20 分钟",
    difficulty: "入门",
    tags: ["部署", "托管", "CI/CD"],
    objectives: ["连接 GitHub", "自动部署", "环境变量", "自定义域名"]
  },
  cursor: {
    title: "Cursor AI 编程教程",
    description: "掌握 Cursor AI 编辑器，提升编程效率",
    duration: "20-30 分钟",
    difficulty: "入门",
    tags: ["AI 编程", "效率工具", "代码生成"],
    objectives: ["安装配置", "AI 对话", "代码生成", "项目实战"]
  }
}

export default function TutorialPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug || "github"
  const [content, setContent] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const meta = TUTORIAL_META[slug as keyof typeof TUTORIAL_META]

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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 自定义 Markdown 组件
  const components = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-momentum-forest mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold text-momentum-forest mt-8 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-momentum-sage-dark mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 mb-4 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-2 mb-4 ml-4 list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-700 leading-relaxed flex items-start">
        <span className="text-momentum-coral mr-2 mt-1.5 text-xs">●</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      const codeString = String(children).replace(/\n$/, '')
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`

      if (!inline && codeString) {
        return (
          <Card className="my-6 overflow-hidden border-momentum-sage-light/30">
            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-momentum-sage-light/30">
              <span className="text-sm font-medium text-momentum-sage-dark">
                {language || '代码'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(codeString, codeId)}
                className="h-8 px-2 text-momentum-sage-dark hover:text-momentum-forest"
              >
                {copiedCode === codeId ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardContent className="p-0">
              <pre className="p-4 overflow-x-auto bg-white">
                <code className="text-sm text-gray-800 font-mono" {...props}>
                  {children}
                </code>
              </pre>
            </CardContent>
          </Card>
        )
      }

      return (
        <code className="bg-momentum-sage-light/20 text-momentum-forest px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
    blockquote: ({ children }: any) => (
      <Card className="my-6 border-l-4 border-momentum-coral bg-momentum-coral/5">
        <CardContent className="p-4">
          <div className="text-momentum-forest">{children}</div>
        </CardContent>
      </Card>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-momentum-coral hover:text-momentum-coral-dark underline decoration-2 underline-offset-2 inline-flex items-center gap-1"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-momentum-cream">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-momentum-sage-light/30 rounded w-1/3"></div>
            <div className="h-4 bg-momentum-sage-light/30 rounded w-2/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-momentum-sage-light/30 rounded"></div>
              <div className="h-4 bg-momentum-sage-light/30 rounded w-5/6"></div>
              <div className="h-4 bg-momentum-sage-light/30 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-momentum-cream">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => router.back()} variant="outline">
                返回上一页
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-momentum-cream">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-momentum-sage-light/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-momentum-sage-dark hover:text-momentum-forest"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-momentum-coral" />
              <span className="font-medium text-momentum-forest">教程中心</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 教程头部信息 */}
        {meta && (
          <Card className="mb-8 border-momentum-sage-light/30 bg-gradient-to-r from-momentum-sage-light/10 to-momentum-coral/10">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-momentum-forest mb-3">
                    {meta.title}
                  </h1>
                  <p className="text-lg text-momentum-sage-dark mb-4 leading-relaxed">
                    {meta.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {meta.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-momentum-sage-light/20 text-momentum-forest">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="lg:w-80">
                  <Card className="bg-white/80 backdrop-blur-sm border-momentum-sage-light/30">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-momentum-coral" />
                        <div>
                          <div className="font-medium text-momentum-forest">预计时长</div>
                          <div className="text-sm text-momentum-sage-dark">{meta.duration}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-momentum-coral" />
                        <div>
                          <div className="font-medium text-momentum-forest">难度等级</div>
                          <div className="text-sm text-momentum-sage-dark">{meta.difficulty}</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="font-medium text-momentum-forest mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-momentum-coral" />
                          学习目标
                        </div>
                        <ul className="space-y-1">
                          {meta.objectives.map((objective, index) => (
                            <li key={index} className="text-sm text-momentum-sage-dark flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-momentum-coral rounded-full"></span>
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 教程内容 */}
        <Card className="border-momentum-sage-light/30 bg-white">
          <CardContent className="p-4 md:p-8">
            <article className="tutorial-content max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </article>
          </CardContent>
        </Card>

        {/* 底部行动区域 */}
        <Card className="mt-8 border-momentum-coral/30 bg-gradient-to-r from-momentum-coral/5 to-momentum-sage-light/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-momentum-forest mb-3">
              学完了？来实践一下！
            </h3>
            <p className="text-momentum-sage-dark mb-4">
              回到聊天页面，对小M说"帮我加到待办"，我会为你生成具体的练习步骤。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/chat')}
                className="bg-momentum-coral hover:bg-momentum-coral-dark text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                开始实践
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10"
              >
                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
