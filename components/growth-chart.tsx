"use client"

import { useEffect, useRef } from "react"

interface GrowthChartProps {
  data: Array<{ date: string; value: number; label?: string }>
  title: string
  color?: string
  height?: number
}

export function GrowthChart({ data, title, color = "#B2B8A3", height = 200 }: GrowthChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布尺寸
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // 清空画布
    ctx.clearRect(0, 0, rect.width, height)

    // 计算绘图区域
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = height - padding * 2

    // 找出数据范围
    const maxValue = Math.max(...data.map((d) => d.value))
    const minValue = Math.min(...data.map((d) => d.value))
    const valueRange = maxValue - minValue || 1

    // 绘制网格线
    ctx.strokeStyle = "#E5E5E5"
    ctx.lineWidth = 1

    // 水平网格线
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // 垂直网格线
    const stepX = chartWidth / (data.length - 1 || 1)
    for (let i = 0; i < data.length; i += Math.ceil(data.length / 6)) {
      const x = padding + stepX * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()
    }

    // 绘制数据线
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // 绘制数据点
    ctx.fillStyle = color
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // 绘制渐变填充
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, color + "40") // 40% opacity
    gradient.addColorStop(1, color + "00") // 0% opacity

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(padding, padding + chartHeight)
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight
      ctx.lineTo(x, y)
    })
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.closePath()
    ctx.fill()

    // 绘制Y轴标签
    ctx.fillStyle = "#666"
    ctx.font = "12px Inter"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 4; i++) {
      const value = minValue + (valueRange / 4) * (4 - i)
      const y = padding + (chartHeight / 4) * i
      ctx.fillText(value.toFixed(0), padding - 10, y)
    }

    // 绘制X轴标签（显示部分日期）
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter(
      (i, index, arr) => arr.indexOf(i) === index,
    )

    labelIndices.forEach((index) => {
      if (index < data.length) {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * index
        const date = new Date(data[index].date)
        const label = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
        ctx.fillText(label, x, padding + chartHeight + 10)
      }
    })
  }, [data, color, height])

  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      <h3 className="font-semibold text-soft-gray mb-4">{title}</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: `${height}px` }}
          onMouseMove={(e) => {
            // 可以添加鼠标悬停显示数值的功能
          }}
        />
      </div>
    </div>
  )
}
