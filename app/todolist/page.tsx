"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Sparkles, Loader2 } from "lucide-react"
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

type ParsedTodo = {
  title: string
  description?: string
  deadlineDate?: string
  note?: string
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

  // 智能添加相关状态
  const [showSmartAdd, setShowSmartAdd] = useState(false)
  const [smartText, setSmartText] = useState("")
  const [isParsingTodos, setIsParsingTodos] = useState(false)
  const [parsedTodos, setParsedTodos] = useState<ParsedTodo[]>([])
  const [parseError, setParseError] = useState<string | null>(null)

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

  // 智能解析待办事项
  async function parseTodos() {
    if (!smartText.trim()) return

    setIsParsingTodos(true)
    setParseError(null)

    try {
      const response = await fetch("/api/parse-todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: smartText }),
      })

      if (!response.ok) {
        throw new Error("解析失败")
      }

      const data = await response.json()
      setParsedTodos(data.todos || [])
    } catch (error) {
      console.error("Parse todos error:", error)
      setParseError("解析失败，请检查网络连接或稍后重试")
    } finally {
      setIsParsingTodos(false)
    }
  }

  // 批量添加解析出的待办事项
  function addParsedTodos() {
    if (parsedTodos.length === 0) return

    // 过滤掉标题为空的待办事项
    const validTodos = parsedTodos.filter(todo => todo.title.trim().length > 0)
    if (validTodos.length === 0) {
      setParseError("没有有效的待办事项可以添加")
      return
    }

    const now = new Date().toISOString()
    const newTodos = validTodos.map((parsed) => {
      const item: Todo = {
        id: crypto.randomUUID(),
        title: parsed.title.trim(),
        description: parsed.description?.trim() || undefined,
        completed: false,
        deadlineDate: parsed.deadlineDate,
        note: parsed.note?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      return item
    })

    const next = [...newTodos, ...todos]
    setTodos(next)
    saveTodos(next)

    // 清理状态
    setSmartText("")
    setParsedTodos([])
    setShowSmartAdd(false)
    setParseError(null)

    // 显示成功消息
    setCelebrationMessage(`🎉 成功添加 ${newTodos.length} 个待办事项！`)
    setTimeout(() => {
      setCelebrationMessage(null)
    }, 3000)
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
              onClick={() => setShowSmartAdd((v) => !v)}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              智能添加
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

        {showSmartAdd && (
          <Card className="mb-6 border-momentum-sage-light/30 bg-white">
            <CardHeader className="py-4 border-b border-momentum-sage-light/20">
              <CardTitle className="text-sm font-medium text-momentum-forest flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                智能添加待办
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm text-momentum-sage-dark">
                  粘贴聊天记录或待办文本
                </label>
                <Textarea
                  value={smartText}
                  onChange={(e) => {
                    setSmartText(e.target.value)
                    // 清除之前的错误和解析结果
                    if (parseError) setParseError(null)
                    if (parsedTodos.length > 0) setParsedTodos([])
                  }}
                  onKeyDown={(e) => {
                    // Ctrl/Cmd + Enter 快速解析
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      if (smartText.trim() && !isParsingTodos) {
                        parseTodos()
                      }
                    }
                  }}
                  placeholder="例如：&#10;1. 写项目文档&#10;2. 准备会议材料&#10;3. 15:00前完成代码审查&#10;4. 明天联系客户&#10;&#10;或直接粘贴聊天记录..."
                  className="min-h-[120px] text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                />
                <div className="text-xs text-momentum-sage-dark space-y-1">
                  <div>💡 支持多种格式：数字列表、符号列表、时间前缀等。AI会自动识别任务并提取时间信息。</div>
                  <div>⌨️ 快捷键：Ctrl/Cmd + Enter 快速解析</div>
                </div>
              </div>

              {parseError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{parseError}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10"
                  onClick={() => {
                    setShowSmartAdd(false)
                    setSmartText("")
                    setParsedTodos([])
                    setParseError(null)
                  }}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-sm bg-momentum-coral hover:bg-momentum-coral-dark text-white"
                  onClick={parseTodos}
                  disabled={!smartText.trim() || isParsingTodos}
                >
                  {isParsingTodos ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      解析中...
                    </>
                  ) : (
                    "AI解析"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {parsedTodos.length > 0 && (
          <Card className="mb-6 border-momentum-sage-light/30 bg-white">
            <CardHeader className="py-4 border-b border-momentum-sage-light/20">
              <CardTitle className="text-sm font-medium text-momentum-forest">
                解析结果（{parsedTodos.length} 个待办事项）
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                {parsedTodos.map((todo, index) => (
                  <div key={index} className="p-3 border border-momentum-sage-light/30 rounded-lg bg-momentum-sage-light/5">
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <label className="text-xs text-momentum-sage-dark">标题</label>
                        <Input
                          value={todo.title}
                          onChange={(e) => {
                            const updated = [...parsedTodos]
                            updated[index] = { ...updated[index], title: e.target.value }
                            setParsedTodos(updated)
                          }}
                          className="h-8 text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                        />
                      </div>
                      {todo.description && (
                        <div className="grid gap-1">
                          <label className="text-xs text-momentum-sage-dark">描述</label>
                          <Textarea
                            value={todo.description}
                            onChange={(e) => {
                              const updated = [...parsedTodos]
                              updated[index] = { ...updated[index], description: e.target.value }
                              setParsedTodos(updated)
                            }}
                            className="min-h-[60px] text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                          <label className="text-xs text-momentum-sage-dark">截止日期</label>
                          <Input
                            type="date"
                            value={todo.deadlineDate || ""}
                            onChange={(e) => {
                              const updated = [...parsedTodos]
                              updated[index] = { ...updated[index], deadlineDate: e.target.value || undefined }
                              setParsedTodos(updated)
                            }}
                            className="h-8 text-sm border-momentum-sage-light/30 focus:border-momentum-coral"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => {
                              const updated = parsedTodos.filter((_, i) => i !== index)
                              setParsedTodos(updated)
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-momentum-sage-light/20">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-sm border-momentum-sage-light text-momentum-sage-dark hover:bg-momentum-sage-light/10"
                  onClick={() => {
                    setParsedTodos([])
                    setSmartText("")
                  }}
                >
                  重新解析
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 text-sm bg-momentum-coral hover:bg-momentum-coral-dark text-white"
                  onClick={addParsedTodos}
                  disabled={parsedTodos.length === 0}
                >
                  添加到待办（{parsedTodos.length}）
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
                        <div className="w-1 h-1 rounded-full bg-momentum-coral"></div>
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
                      <div className="w-1 h-1 rounded-full bg-white"></div>
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
