"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

type Todo = {
  id: string
  title: string
  description?: string
  completed: boolean
  deadlineDate?: string // YYYY-MM-DD
  note?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "todos"

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Todo[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function todayYmd() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function tomorrowYmd() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function normalize(str?: string) {
  if (!str) return ""
  return str
    .toLowerCase()
    .replace(/[\s\t\n\r]/g, "")
    .replace(/[【】[\]（）()<>《》"'“”、，,。.!！?？~\-—]/g, "")
    .trim()
}

/**
 * 初始化时，对未完成且已过期的任务：自动把 deadline 改为明天，并在 note 标注
 */
function autoRollOverOverdue(todos: Todo[]): Todo[] {
  const today = todayYmd()
  let changed = false
  const next = todos.map((t) => {
    if (!t.completed && t.deadlineDate && t.deadlineDate < today) {
      changed = true
      const newNote = (t.note ? t.note + "；" : "") + "已重新为你改到明天"
      return { ...t, deadlineDate: tomorrowYmd(), note: newNote, updatedAt: new Date().toISOString() }
    }
    return t
  })
  if (changed) saveTodos(next)
  return next
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newDeadline, setNewDeadline] = useState<string>("")

  // 首次加载
  useEffect(() => {
    const initial = autoRollOverOverdue(loadTodos())
    setTodos(initial)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setTodos(autoRollOverOverdue(loadTodos()))
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const pending = useMemo(() => todos.filter((t) => !t.completed), [todos])
  const done = useMemo(() => todos.filter((t) => t.completed), [todos])

  function addTodo() {
    if (!newTitle.trim()) return
    const now = new Date().toISOString()
    const item: Todo = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      completed: false,
      deadlineDate: newDeadline || undefined,
      note: undefined,
      createdAt: now,
      updatedAt: now,
    }
    const next = [item, ...todos]
    setTodos(next)
    saveTodos(next)
    setNewTitle("")
    setNewDesc("")
    setNewDeadline("")
    setShowForm(false)
  }

  function toggleTodo(id: string, checked: boolean) {
    const next = todos.map((t) => (t.id === id ? { ...t, completed: checked, updatedAt: new Date().toISOString() } : t))
    setTodos(next)
    saveTodos(next)
  }

  function removeCompleted() {
    const next = todos.filter((t) => !t.completed)
    setTodos(next)
    saveTodos(next)
  }

  function removeOne(id: string) {
    const next = todos.filter((t) => t.id !== id)
    setTodos(next)
    saveTodos(next)
  }

  // 检查是否需要渲染描述：标题和描述完全一致时不渲染
  function shouldShowDescription(title?: string, desc?: string) {
    return !!desc && normalize(desc) !== normalize(title)
  }

  return (
    <div className="min-h-screen bg-momentum-cream">
      <main className="mx-auto max-w-3xl px-4 py-6 mobile-nav-spacing mobile-spacing">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-momentum-forest">待办清单</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              className="h-9 px-3 text-sm touch-feedback bg-momentum-coral hover:bg-momentum-coral-dark text-white"
              onClick={() => setShowForm((v) => !v)}
            >
              <Plus className="mr-1 h-4 w-4" />
              添加待办
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3 text-sm touch-feedback border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10"
              onClick={removeCompleted}
              disabled={done.length === 0}
            >
              清除已完成
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-6 border-momentum-sage-light/30 bg-white">
            <CardHeader className="py-4 border-b border-momentum-sage-light/20">
              <CardTitle className="text-sm font-medium text-momentum-forest">新增待办</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm text-momentum-sage-dark">标题</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：写 README"
                  className="h-10 text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-momentum-sage-dark">描述（可选）</label>
                <Textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="补充细节"
                  className="min-h-[80px] text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-momentum-sage-dark">截止日期（可选）</label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="h-10 text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10"
                  onClick={() => setShowForm(false)}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-sm bg-momentum-coral hover:bg-momentum-coral-dark text-white"
                  onClick={addTodo}
                  disabled={!newTitle.trim()}
                >
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="space-y-6">
          <div>
            <h2 className="mb-4 text-base font-semibold text-momentum-forest">待完成（{pending.length}）</h2>
            <ul className="space-y-3">
              {pending.map((t) => (
                <li key={t.id} className="rounded-lg border border-momentum-sage-light/30 bg-white p-4 shadow-sm mobile-card touch-feedback hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex flex-1 cursor-pointer items-start gap-3">
                      <Checkbox
                        checked={t.completed}
                        onCheckedChange={(v) => toggleTodo(t.id, Boolean(v))}
                        className="mt-0.5 border-momentum-sage-light data-[state=checked]:bg-momentum-coral data-[state=checked]:border-momentum-coral"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-momentum-forest">{t.title}</div>
                        {shouldShowDescription(t.title, t.description) && (
                          <div className="mt-1 text-sm text-momentum-sage-dark">{t.description}</div>
                        )}
                        {(t.deadlineDate || t.note) && (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {t.deadlineDate && (
                              <span className="rounded-full bg-momentum-sage-light/20 px-2 py-1 text-xs text-momentum-sage-dark">
                                截止：{t.deadlineDate}
                              </span>
                            )}
                            {t.note && (
                              <span className="rounded-full bg-momentum-coral/10 px-2 py-1 text-xs text-momentum-coral">
                                {t.note}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-momentum-sage-dark hover:text-momentum-forest hover:bg-momentum-sage-light/10"
                      onClick={() => removeOne(t.id)}
                      aria-label="删除"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </div>
                </li>
              ))}
              {pending.length === 0 && (
                <li className="text-center py-8 text-sm text-momentum-muted">
                  暂无待完成任务
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-base font-semibold text-momentum-forest">已完成（{done.length}）</h2>
            <ul className="space-y-3">
              {done.map((t) => (
                <li key={t.id} className="rounded-lg border border-momentum-sage-light/30 bg-white p-4 opacity-60">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex flex-1 cursor-pointer items-start gap-3">
                      <Checkbox
                        checked={t.completed}
                        onCheckedChange={(v) => toggleTodo(t.id, Boolean(v))}
                        className="mt-0.5 border-momentum-sage-light data-[state=checked]:bg-momentum-coral data-[state=checked]:border-momentum-coral"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium line-through text-momentum-sage-dark">{t.title}</div>
                        {shouldShowDescription(t.title, t.description) && (
                          <div className="mt-1 text-sm line-through text-momentum-muted">{t.description}</div>
                        )}
                        {t.deadlineDate && (
                          <div className="mt-2">
                            <span className="rounded-full bg-momentum-sage-light/20 px-2 py-1 text-xs text-momentum-sage-dark line-through">
                              截止：{t.deadlineDate}
                            </span>
                          </div>
                        )}
                      </div>
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-momentum-sage-dark hover:text-momentum-forest hover:bg-momentum-sage-light/10"
                      onClick={() => removeOne(t.id)}
                      aria-label="删除"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">删除</span>
                    </Button>
                  </div>
                </li>
              ))}
              {done.length === 0 && (
                <li className="text-center py-8 text-sm text-momentum-muted">
                  暂无已完成任务
                </li>
              )}
            </ul>
          </div>
        </section>

        <BottomNavigation />
      </main>
    </div>
  )
}
