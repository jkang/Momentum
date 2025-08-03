"use client"

import { useState } from "react"
import { ArrowLeft, Monitor, Smartphone, Tablet, RefreshCw, FileText, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const prototypes = [
  {
    id: "welcome-newuser",
    title: "新用户欢迎页",
    description: "新用户首次使用的引导流程",
    path: "/welcome-newuser",
    status: "完成",
  },
  {
    id: "challenge-tasks",
    title: "挑战任务设置",
    description: "用户设置和管理挑战任务",
    path: "/challenge-tasks",
    status: "完成",
  },
  {
    id: "home",
    title: "主页",
    description: "用户的主要操作界面",
    path: "/",
    status: "完成",
  },
  {
    id: "chat",
    title: "对话页面",
    description: "与AI助手的对话界面",
    path: "/chat",
    status: "开发中",
  },
  {
    id: "challenges",
    title: "挑战列表",
    description: "查看所有挑战的列表页面",
    path: "/challenges",
    status: "开发中",
  },
]

export default function PrototypesPage() {
  const [selectedDevice, setSelectedDevice] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [currentPrototype, setCurrentPrototype] = useState(prototypes[0])
  const [refreshKey, setRefreshKey] = useState(0)

  const getDeviceStyles = () => {
    switch (selectedDevice) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
          className: "bg-black rounded-[2.5rem] p-2",
        }
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
          className: "bg-gray-800 rounded-xl p-3",
        }
      case "desktop":
        return {
          width: "1200px",
          height: "800px",
          className: "bg-gray-900 rounded-lg p-1",
        }
    }
  }

  const deviceStyle = getDeviceStyles()

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 头部导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回首页
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">原型展示</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/prd">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                >
                  <FileText className="w-4 h-4" />
                  查看PRD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">原型列表</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prototypes.map((prototype) => (
                  <div
                    key={prototype.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentPrototype.id === prototype.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPrototype(prototype)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm">{prototype.title}</h3>
                      <Badge variant={prototype.status === "完成" ? "default" : "secondary"} className="text-xs">
                        {prototype.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{prototype.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 设备选择 */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">设备预览</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedDevice} onValueChange={(value) => setSelectedDevice(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mobile" className="text-xs">
                      <Smartphone className="w-4 h-4 mr-1" />
                      手机
                    </TabsTrigger>
                    <TabsTrigger value="tablet" className="text-xs">
                      <Tablet className="w-4 h-4 mr-1" />
                      平板
                    </TabsTrigger>
                    <TabsTrigger value="desktop" className="text-xs">
                      <Monitor className="w-4 h-4 mr-1" />
                      桌面
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  刷新预览
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右侧预览区域 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {currentPrototype.title}
                    <Badge variant="outline">{selectedDevice}</Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    {deviceStyle.width} × {deviceStyle.height}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div
                    className={deviceStyle.className}
                    style={{ width: deviceStyle.width, height: deviceStyle.height }}
                  >
                    <div className="w-full h-full bg-white rounded-[2rem] lg:rounded-lg overflow-hidden shadow-inner">
                      <iframe
                        key={`${currentPrototype.id}-${selectedDevice}-${refreshKey}`}
                        src={currentPrototype.path}
                        className="w-full h-full border-0"
                        title={currentPrototype.title}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
