"use client"

import { useEffect, useState } from "react"

export function MomentumTree() {
  const [treeStage, setTreeStage] = useState(1)

  useEffect(() => {
    // 根据用户完成的任务数量决定树的成长阶段
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]")
    const taskCount = completedTasks.length

    if (taskCount >= 20) setTreeStage(4)
    else if (taskCount >= 10) setTreeStage(3)
    else if (taskCount >= 5) setTreeStage(2)
    else setTreeStage(1)
  }, [])

  const getTreeImage = () => {
    switch (treeStage) {
      case 1:
        return "/placeholder.svg?height=120&width=120&text=小树苗"
      case 2:
        return "/placeholder.svg?height=140&width=140&text=成长中的树"
      case 3:
        return "/placeholder.svg?height=160&width=160&text=茂盛的树"
      case 4:
        return "/placeholder.svg?height=180&width=180&text=参天大树"
      default:
        return "/placeholder.svg?height=120&width=120&text=小树苗"
    }
  }

  const getTreeDescription = () => {
    switch (treeStage) {
      case 1:
        return "刚刚发芽的小树苗，充满希望"
      case 2:
        return "正在茁壮成长，枝叶渐丰"
      case 3:
        return "枝繁叶茂，生机勃勃"
      case 4:
        return "参天大树，成就非凡"
      default:
        return "刚刚发芽的小树苗，充满希望"
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img src={getTreeImage() || "/placeholder.svg"} alt="成长之树" className="animate-plant-grow" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-30"></div>
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center max-w-xs">{getTreeDescription()}</p>
    </div>
  )
}
