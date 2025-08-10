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
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-sm font-semibold text-sage-dark">待办清单</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-7 px-2 text-xs" onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            添加待办
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs"
            onClick={removeCompleted}
            disabled={done.length === 0}
          >
            清除已完成
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-soft-gray">新增待办</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <label className="text-xs text-soft-gray">标题</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例如：写 README"
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-soft-gray">描述（可选）</label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="补充细节"
                className="min-h-[72px] text-sm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-soft-gray">截止日期（可选）</label>
              <Input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" className="h-7 px-3 text-xs" onClick={() => setShowForm(false)}>
                取消
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs" onClick={addTodo} disabled={!newTitle.trim()}>
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="space-y-6">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-sage-dark">待完成（{pending.length}）</h2>
          <ul className="space-y-3">
            {pending.map((t) => (
              <li key={t.id} className="rounded-lg border border-light-gray bg-white p-3 shadow-gentle">
                <div className="flex items-start justify-between gap-3">
                  <label className="flex flex-1 cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={(v) => toggleTodo(t.id, Boolean(v))}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-[15px] font-medium text-gray-700">{t.title}</div>
                      {shouldShowDescription(t.title, t.description) && (
                        <div className="mt-1 text-sm text-gray-500">{t.description}</div>
                      )}
                      {(t.deadlineDate || t.note) && (
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {t.deadlineDate && (
                            <span className="rounded bg-sage-light px-2 py-0.5 text-[11px] text-sage-dark">
                              截止：{t.deadlineDate}
                            </span>
                          )}
                          {t.note && (
                            <span className="rounded bg-[#eff6ff] px-2 py-0.5 text-[11px] text-[#1e40af]">
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
                    className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => removeOne(t.id)}
                    aria-label="删除"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">删除</span>
                  </Button>
                </div>
              </li>
            ))}
            {pending.length === 0 && <li className="text-center text-xs text-gray-500">暂无待完成任务</li>}
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-sage-dark">已完成（{done.length}）</h2>
          <ul className="space-y-3">
            {done.map((t) => (
              <li key={t.id} className="rounded-lg border border-light-gray bg-white p-3 opacity-70">
                <div className="flex items-start justify-between gap-3">
                  <label className="flex flex-1 cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={(v) => toggleTodo(t.id, Boolean(v))}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-[15px] font-medium line-through">{t.title}</div>
                      {shouldShowDescription(t.title, t.description) && (
                        <div className="mt-1 text-sm line-through">{t.description}</div>
                      )}
                      {t.deadlineDate && (
                        <div className="mt-1">
                          <span className="rounded bg-sage-light px-2 py-0.5 text-[11px] text-sage-dark">
                            截止：{t.deadlineDate}
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => removeOne(t.id)}
                    aria-label="删除"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">删除</span>
                  </Button>
                </div>
              </li>
            ))}
            {done.length === 0 && <li className="text-center text-xs text-gray-400">暂无已完成任务</li>}
          </ul>
        </div>
      </section>
    </main>
  )
}
