"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"
import { recordTaskCompletion } from "@/lib/celebration"

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

const STORAGE_KEY = "momentum-todos"

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
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null)

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

    // 如果是完成任务（从未完成变为完成），显示庆祝消息
    if (checked) {
      const celebration = recordTaskCompletion()
      setCelebrationMessage(celebration)

      // 3秒后自动隐藏庆祝消息
      setTimeout(() => {
        setCelebrationMessage(null)
      }, 3000)
    }
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
        {/* 庆祝消息 */}
        {celebrationMessage && (
          <div className="mb-4 p-4 bg-gradient-to-r from-momentum-coral/10 to-momentum-sage/10 border border-momentum-coral/30 rounded-lg text-center animate-bounce">
            <p className="text-momentum-forest font-medium">{celebrationMessage}</p>
          </div>
        )}

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
            <ul className="space-y-2">
              {pending.map((t) => (
                <li key={t.id} className="group relative">
                  <div className="flex items-start gap-3 py-3 px-1 hover:bg-momentum-sage-light/5 rounded-lg transition-colors">
                    <button
                      onClick={() => toggleTodo(t.id, !t.completed)}
                      className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-momentum-sage-light hover:border-momentum-coral flex items-center justify-center group-hover:scale-110 transition-all"
                    >
                      {t.completed && (
                        <div className="w-3 h-3 rounded-full bg-momentum-coral"></div>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-momentum-forest leading-relaxed">
                        {t.title}
                      </div>
                      {shouldShowDescription(t.title, t.description) && (
                        <div className="mt-1 text-sm text-momentum-muted leading-relaxed">
                          {t.description}
                        </div>
                      )}
                      {(t.deadlineDate || t.note) && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {t.deadlineDate && (
                            <span className="inline-flex items-center gap-1 text-xs text-momentum-sage-dark">
                              <span className="w-1 h-1 bg-momentum-sage-dark rounded-full"></span>
                              截止 {t.deadlineDate}
                            </span>
                          )}
                          {t.note && (
                            <span className="inline-flex items-center gap-1 text-xs text-momentum-coral">
                              <span className="w-1 h-1 bg-momentum-coral rounded-full"></span>
                              {t.note}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-momentum-sage-dark hover:text-momentum-forest hover:bg-momentum-sage-light/20 transition-all"
                      onClick={() => removeOne(t.id)}
                      aria-label="删除"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 分隔线 */}
                  <div className="ml-8 border-b border-momentum-sage-light/20 last:border-b-0"></div>
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
            <ul className="space-y-2">
              {done.map((t) => (
                <li key={t.id} className="group relative opacity-60">
                  <div className="flex items-start gap-3 py-3 px-1 hover:bg-momentum-sage-light/5 rounded-lg transition-colors">
                    <button
                      onClick={() => toggleTodo(t.id, !t.completed)}
                      className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 border-momentum-coral bg-momentum-coral flex items-center justify-center group-hover:scale-110 transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-momentum-sage-dark line-through leading-relaxed">
                        {t.title}
                      </div>
                      {shouldShowDescription(t.title, t.description) && (
                        <div className="mt-1 text-sm text-momentum-muted line-through leading-relaxed">
                          {t.description}
                        </div>
                      )}
                      {t.deadlineDate && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-momentum-sage-dark line-through">
                            <span className="w-1 h-1 bg-momentum-sage-dark rounded-full"></span>
                            截止 {t.deadlineDate}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-momentum-sage-dark hover:text-momentum-forest hover:bg-momentum-sage-light/20 transition-all"
                      onClick={() => removeOne(t.id)}
                      aria-label="删除"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 分隔线 */}
                  <div className="ml-8 border-b border-momentum-sage-light/20 last:border-b-0"></div>
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
