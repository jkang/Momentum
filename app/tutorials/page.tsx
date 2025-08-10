"use client"

import Link from "next/link"
import { ArrowRight, Clock, Target, BookOpen, Code, Github, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 教程数据
const TUTORIALS = [
  {
    slug: "github",
    title: "GitHub 入门教程",
    description: "从零开始学习 GitHub，掌握代码版本管理的基础技能",
    duration: "15-30 分钟",
    difficulty: "入门",
    icon: Github,
    tags: ["版本控制", "协作", "开源"],
    color: "from-gray-500 to-gray-700",
    bgColor: "bg-gray-50",
    objectives: ["创建仓库", "提交更改", "开分支", "发起 PR"]
  },
  {
    slug: "v0",
    title: "v0 快速开发教程", 
    description: "用 v0 从提示到上线，快速构建现代化 Web 应用",
    duration: "30-45 分钟",
    difficulty: "中级",
    icon: Zap,
    tags: ["AI 开发", "Next.js", "快速原型"],
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
    objectives: ["生成代码", "本地运行", "修复问题", "部署上线"]
  },
  {
    slug: "vercel",
    title: "Vercel 部署教程",
    description: "学习使用 Vercel 平台快速部署前端项目",
    duration: "10-20 分钟", 
    difficulty: "入门",
    icon: Globe,
    tags: ["部署", "托管", "CI/CD"],
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
    objectives: ["连接 GitHub", "自动部署", "环境变量", "自定义域名"]
  },
  {
    slug: "cursor",
    title: "Cursor AI 编程教程",
    description: "掌握 Cursor AI 编辑器，提升编程效率",
    duration: "20-30 分钟",
    difficulty: "入门", 
    icon: Code,
    tags: ["AI 编程", "效率工具", "代码生成"],
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
    objectives: ["安装配置", "AI 对话", "代码生成", "项目实战"]
  }
]

const DIFFICULTY_COLORS = {
  "入门": "bg-green-100 text-green-800",
  "中级": "bg-yellow-100 text-yellow-800",
  "高级": "bg-red-100 text-red-800"
}

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-momentum-cream">
      {/* 页面头部 */}
      <div className="bg-white border-b border-momentum-sage-light/30">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-momentum-coral" />
              <h1 className="text-2xl md:text-3xl font-bold text-momentum-forest">教程中心</h1>
            </div>
            <p className="text-base md:text-lg text-momentum-sage-dark max-w-2xl mx-auto leading-relaxed">
              精选实用教程，助你快速掌握现代开发技能。从基础到进阶，循序渐进提升能力。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* 教程网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {TUTORIALS.map((tutorial) => {
            const Icon = tutorial.icon
            return (
              <Card
                key={tutorial.slug}
                className="group hover:shadow-lg transition-all duration-300 border-momentum-sage-light/30 overflow-hidden"
              >
                <CardHeader className={`${tutorial.bgColor} border-b border-momentum-sage-light/20 p-4 md:p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-br ${tutorial.color} text-white`}>
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg md:text-xl text-momentum-forest group-hover:text-momentum-coral transition-colors leading-tight">
                          {tutorial.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge
                            variant="secondary"
                            className={`${DIFFICULTY_COLORS[tutorial.difficulty as keyof typeof DIFFICULTY_COLORS]} text-xs`}
                          >
                            {tutorial.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs md:text-sm text-momentum-sage-dark">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 md:p-6">
                  <p className="text-sm md:text-base text-momentum-sage-dark mb-4 leading-relaxed">
                    {tutorial.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4">
                    {tutorial.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-momentum-sage-light text-momentum-sage-dark">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-momentum-coral" />
                      <span className="font-medium text-momentum-forest text-sm">学习目标</span>
                    </div>
                    <ul className="space-y-1">
                      {tutorial.objectives.map((objective, index) => (
                        <li key={index} className="text-xs md:text-sm text-momentum-sage-dark flex items-center gap-2">
                          <span className="w-1 h-1 bg-momentum-coral rounded-full flex-shrink-0"></span>
                          <span className="leading-relaxed">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/tutorials/${tutorial.slug}`}>
                    <Button className="w-full bg-momentum-coral hover:bg-momentum-coral-dark text-white group text-sm md:text-base">
                      开始学习
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 底部提示 */}
        <Card className="mt-8 md:mt-12 border-momentum-coral/30 bg-gradient-to-r from-momentum-coral/5 to-momentum-sage-light/5">
          <CardContent className="p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-momentum-forest mb-4">
              学习路径建议
            </h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-sm md:text-base text-momentum-sage-dark mb-6 leading-relaxed">
                建议按照 <strong>GitHub → Cursor → v0 → Vercel</strong> 的顺序学习，
                这样可以建立完整的现代开发工作流：版本控制 → AI 编程 → 快速开发 → 部署上线。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/chat">
                  <Button className="bg-momentum-coral hover:bg-momentum-coral-dark text-white text-sm md:text-base">
                    <BookOpen className="h-4 w-4 mr-2" />
                    与小M讨论学习计划
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10 text-sm md:text-base">
                    返回首页
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
