"use client"

import { useState } from "react"
import { ArrowLeft, Monitor, Smartphone, Tablet, RefreshCw, FileText, Palette } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  const ge
