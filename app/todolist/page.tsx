"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ArrowLeft, Check, Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface TodoItem {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: Date
  priority: "high" | "medium" | "low"
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
  })

  // 加载待办事项
  useEffect(() => {
    try {
      const saved = localStorage.getItem("momentum-todos")
      if (saved) {
        const parsed: TodoItem[] = JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }))
        setTodos(parsed)
      }
    } catch (e) {
      console.error("Failed to load todos:", e)
    }
  }, [])

  // 持久化
  const saveTodos = (next: TodoItem[]) => {
    try {
      localStorage.setItem("momentum-todos", JSON.stringify(next))
      setTodos(next)
    } catch (e) {
      console.error("Failed to save todos:", e)
    }
  }

  // 添加
  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return
    const todo: TodoItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      completed: false,
      createdAt: new Date(),
      priority: newTodo.priority,
    }
    saveTodos([todo, ...todos])
    setNewTodo({ title: "", description: "", priority: "medium" })
    setShowAddForm(false)
  }

  // 切换完成
  const toggleComplete = (id: string, checked: boolean) => {
    const next = todos.map((t) => (t.id === id ? { ...t, completed: checked } : t))
    saveTodos(next)
  }

  // 删除
  const deleteTodo = (id: string) => {
    const next = todos.filter((t) => t.id !== id)
    saveTodos(next)
  }

  // UI 辅助
  const getPriorityBadge = (p: TodoItem["priority"]) => {
    switch (p) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  const getPriorityText = (p: TodoItem["priority"]) =>
    p === "high" ? "高优先级" : p === "low" ? "低优先级" : "中优先级"

  const completed = todos.filter((t) => t.completed)
  const pending = todos.filter((t) => !t.completed)

  return (
    <div className="min-h-screen bg-momentum-cream">
      {/* 顶部 */}
      <div className="bg-momentum-white border-b border-momentum-sage-light-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-momentum-sage hover:text-momentum-forest"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
              <div>
                <h1 className="text-base md:text-lg font-semibold text-momentum-forest">我的待办清单</h1>
                <p className="text-xs md:text-sm text-momentum-muted">
                  {pending.length} 个待完成，{completed.length} 个已完成
                </p>
              </div>
            </div>

            <Button onClick={() => setShowAddForm((s) => !s)} className="momentum-button-primary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加待办
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
        {/* 添加表单 */}
        {showAddForm && (
          <Card className="border-momentum-sage-light-20">
            <CardHeader className="py-3">
              <CardTitle className="text-momentum-forest text-base">添加新的待办事项</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <label className="block text-sm font-medium text-momentum-forest mb-1">标题 *</label>
                <Input
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="输入待办事项标题..."
                  className="border-momentum-sage-light-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-momentum-forest mb-1">详细描述</label>
                <Textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="输入详细描述..."
                  className="border-momentum-sage-light-20"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-momentum-forest mb-1">优先级</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-momentum-sage-light-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-momentum-sage/20"
                >
                  <option value="low">低优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="high">高优先级</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddTodo} className="momentum-button-primary">
                  添加
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-momentum-sage-light text-momentum-sage hover:bg-momentum-sage-light-20"
                >
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 列表 */}
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-momentum-sage-light-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-momentum-sage" />
            </div>
            <h3 className="text-base font-medium text-momentum-forest mb-2">还没有待办事项</h3>
            <p className="text-sm text-momentum-muted mb-4">与小M对话后，说“帮我加到待办”来自动添加行动步骤</p>
            <Button onClick={() => (window.location.href = "/")} className="momentum-button-primary">
              返回聊天开始添加
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 待完成 */}
            {pending.length > 0 && (
              <div>
                <h2 className="text-base font-medium text-momentum-forest mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-momentum-coral" />
                  待完成 ({pending.length})
                </h2>
                <div className="space-y-2.5">
                  {pending.map((todo) => (
                    <Card
                      key={todo.id}
                      className="border-momentum-sage-light-20 hover:shadow-momentum-card transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={(v) => toggleComplete(todo.id, Boolean(v))}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-momentum-forest leading-snug truncate">
                                  {todo.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getPriorityBadge(todo.priority)}>
                                    {getPriorityText(todo.priority)}
                                  </Badge>
                                  <span className="text-[11px] text-momentum-muted">
                                    {todo.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-7 h-7"
                                aria-label="删除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 已完成 */}
            {completed.length > 0 && (
              <div>
                <h2 className="text-base font-medium text-momentum-forest mb-2 flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  已完成 ({completed.length})
                </h2>
                <div className="space-y-2.5">
                  {completed.map((todo) => (
                    <Card key={todo.id} className="border-momentum-sage-light-20 bg-green-50/50">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={(v) => toggleComplete(todo.id, Boolean(v))}
                            className="mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-momentum-forest line-through opacity-70 leading-snug truncate">
                                  {todo.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="bg-green-100 text-green-800 border-green-200">已完成</Badge>
                                  <span className="text-[11px] text-momentum-muted">
                                    {todo.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-7 h-7"
                                aria-label="删除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
