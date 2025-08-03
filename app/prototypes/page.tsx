"use client"

import { useState } from "react"
import { ArrowLeft, Smartphone, RefreshCw, Monitor, Tablet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const prototypes = [
  { id: "welcome", name: "欢迎页面", file: "welcome.html" },
  { id: "welcome-newuser", name: "新用户引导", file: "welcome-newuser.html" },
  { id: "challenge-tasks", name: "挑战任务设置", file: "challenge-tasks.html" },
  { id: "chat", name: "AI对话页面", file: "chat.html" },
  { id: "actionlist", name: "行动清单", file: "actionlist.html" },
  { id: "checkprogress", name: "进度检查", file: "checkprogress.html" },
  { id: "growth", name: "成长记录", file: "growth.html" },
  { id: "profile", name: "个人设置", file: "profile.html" },
]

export default function PrototypesPage() {
  const [selectedPrototype, setSelectedPrototype] = useState("welcome")
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("mobile")
  const [refreshKey, setRefreshKey] = useState(0)

  const currentPrototype = prototypes.find((p) => p.id === selectedPrototype)

  const getDeviceStyles = () => {
    switch (deviceType) {
      case "mobile":
        return {
          width: "375px",
          height: "812px",
          borderRadius: "36px",
          padding: "8px",
          background: "linear-gradient(145deg, #1f1f1f, #2d2d2d)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
          borderRadius: "20px",
          padding: "12px",
          background: "linear-gradient(145deg, #1f1f1f, #2d2d2d)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }
      case "desktop":
        return {
          width: "1200px",
          height: "800px",
          borderRadius: "8px",
          padding: "0px",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }
    }
  }

  const getIframeStyles = () => {
    const deviceStyles = getDeviceStyles()
    return {
      width: deviceType === "mobile" ? "359px" : deviceType === "tablet" ? "744px" : "1200px",
      height: deviceType === "mobile" ? "796px" : deviceType === "tablet" ? "1000px" : "800px",
      borderRadius: deviceType === "desktop" ? "8px" : "28px",
      border: "none",
      background: "#ffffff",
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-warm-off-white">
      {/* Header */}
      <div className="bg-white shadow-soft sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-soft-gray hover:text-sage-green">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sage-green" />
                <h1 className="text-xl font-semibold text-brand-green">原型展示</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sage-green border-sage-green">
                HTML 原型
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="shadow-soft mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-brand-green">原型控制面板</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-soft-gray">选择原型:</label>
                <Select value={selectedPrototype} onValueChange={setSelectedPrototype}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {prototypes.map((prototype) => (
                      <SelectItem key={prototype.id} value={prototype.id}>
                        {prototype.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-soft-gray">设备类型:</label>
                <div className="flex items-center gap-1 bg-light-gray rounded-lg p-1">
                  <Button
                    variant={deviceType === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceType("mobile")}
                    className={deviceType === "mobile" ? "bg-sage-green hover:bg-sage-dark" : ""}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={deviceType === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceType("tablet")}
                    className={deviceType === "tablet" ? "bg-sage-green hover:bg-sage-dark" : ""}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={deviceType === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceType("desktop")}
                    className={deviceType === "desktop" ? "bg-sage-green hover:bg-sage-dark" : ""}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="border-sage-green text-sage-green hover:bg-sage-light bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prototype Display */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Device Frame */}
            <div style={getDeviceStyles()} className="relative">
              {/* Screen */}
              <div className="w-full h-full bg-white rounded-[28px] overflow-hidden relative">
                {/* Status Bar (for mobile) */}
                {deviceType === "mobile" && (
                  <div className="absolute top-0 left-0 right-0 h-11 bg-black rounded-t-[28px] flex items-center justify-between px-6 text-white text-sm z-10">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <iframe
                  key={`${selectedPrototype}-${deviceType}-${refreshKey}`}
                  src={`/docs/${currentPrototype?.file}`}
                  style={getIframeStyles()}
                  className="absolute top-0 left-0"
                  title={currentPrototype?.name}
                />
              </div>

              {/* Home Indicator (for mobile) */}
              {deviceType === "mobile" && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
              )}
            </div>

            {/* Device Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="bg-sage-light text-sage-dark">
                {currentPrototype?.name} -{" "}
                {deviceType === "mobile" ? "手机" : deviceType === "tablet" ? "平板" : "桌面"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Prototype List */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-brand-green mb-6">所有原型页面</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {prototypes.map((prototype) => (
              <Card
                key={prototype.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-gentle ${
                  selectedPrototype === prototype.id ? "ring-2 ring-sage-green bg-sage-light" : "hover:bg-sage-light/50"
                }`}
                onClick={() => setSelectedPrototype(prototype.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-green rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-brand-green">{prototype.name}</h3>
                      <p className="text-sm text-soft-gray">{prototype.file}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
