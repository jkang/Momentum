"use client"

import {
  Trophy,
  Flame,
  Clock,
  Star,
  Crown,
  Plus,
  Target,
  CheckCircle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Lightbulb,
  BookOpen,
  Users,
  MessageCircle,
  Settings,
  BarChart3,
  Gift,
} from "lucide-react"

interface IconProps {
  className?: string
  size?: number
}

// 温暖柔和的自定义图标组件
export const WarmIcons = {
  // 温暖的奖杯图标
  Trophy,

  // 柔和的闪电图标（连击）
  Streak: Flame,

  // 温暖的时钟图标
  Clock,

  // 温暖的星星图标
  Star,

  // 温暖的皇冠图标
  Crown,

  // 温暖的加号图标
  Plus,

  // 温暖的目标图标
  Target,

  // 温暖的勾选圆圈图标
  CheckCircle,

  // 温暖的日历图标
  Calendar,

  // 温暖的上升趋势图标
  TrendingUp,

  // 温暖的奖状图标
  Award,

  // 温暖的zap图标
  Zap,

  // 温暖的心形图标
  Heart,

  // 温暖的灯泡图标
  Lightbulb,

  // 温暖的打开书籍图标
  BookOpen,

  // 温暖的用户图标
  Users,

  // 温暖的消息圆圈图标
  MessageCircle,

  // 温暖的设置图标
  Settings,

  // 温暖的柱状图图标
  BarChart3,

  // 温暖的礼物图标
  Gift,
}
