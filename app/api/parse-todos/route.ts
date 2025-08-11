import type { NextRequest } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

if (!DEEPSEEK_API_KEY) {
  console.error("DEEPSEEK_API_KEY is not set in environment variables")
}

export interface ParsedTodo {
  title: string
  description?: string
  deadlineDate?: string // YYYY-MM-DD format
  note?: string
}

const PARSE_SYSTEM_PROMPT = `你是一个专业的待办事项解析助手。你的任务是从用户提供的文本中提取出待办事项，并将其转换为结构化的JSON格式。

解析规则：
1. 识别文本中的任务项目，支持多种格式：
   - 数字列表：1. 任务、2. 任务
   - 符号列表：- 任务、• 任务、* 任务
   - 复选框：[] 任务、[ ] 任务
   - 时间前缀：15:00前 任务、早上10点 任务、晚饭后 任务
   - 普通文本中的动作词：写、做、完成、准备等

2. 对每个任务提取以下信息：
   - title: 任务的简洁标题（必需）
   - description: 任务的详细描述（可选，如果有补充说明）
   - deadlineDate: 截止日期，格式为YYYY-MM-DD（可选，从时间描述中推断）
   - note: 备注信息（可选）

3. 时间解析规则：
   - "今天"、"今日" → 今天的日期
   - "明天"、"明日" → 明天的日期
   - "下周一"、"周三" → 对应的具体日期
   - "15:00前"、"晚饭后" → 今天的日期
   - 具体日期如"12月25日" → 转换为YYYY-MM-DD格式

4. 过滤规则：
   - 忽略明显的分析性文字（包含"因为"、"所以"、"建议"等）
   - 忽略标题性文字（"今日任务"、"步骤"等）
   - 任务长度应在3-80字符之间
   - 最多返回10个任务

请严格按照以下JSON格式返回结果，不要包含任何其他文字：
{
  "todos": [
    {
      "title": "任务标题",
      "description": "任务描述（可选）",
      "deadlineDate": "2024-01-01（可选）",
      "note": "备注（可选）"
    }
  ]
}

如果没有找到任何待办事项，返回：
{
  "todos": []
}`

export async function POST(request: NextRequest) {
  try {
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Invalid text input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 构建请求消息
    const requestMessages = [
      { role: "system", content: PARSE_SYSTEM_PROMPT },
      { role: "user", content: `请解析以下文本中的待办事项：\n\n${text}` },
    ]

    // 调用DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: requestMessages,
        max_tokens: 2000,
        temperature: 0.3, // 较低的温度以获得更一致的结果
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DeepSeek API error:", response.status, errorText)
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    try {
      // 尝试解析AI返回的JSON
      const parsed = JSON.parse(content)
      
      // 验证返回格式
      if (!parsed.todos || !Array.isArray(parsed.todos)) {
        throw new Error("Invalid response format")
      }

      // 验证每个待办事项的格式
      const validTodos = parsed.todos.filter((todo: any) => {
        return todo && typeof todo.title === "string" && todo.title.trim().length > 0
      }).map((todo: any) => ({
        title: todo.title.trim(),
        description: todo.description ? todo.description.trim() : undefined,
        deadlineDate: todo.deadlineDate || undefined,
        note: todo.note ? todo.note.trim() : undefined,
      }))

      return new Response(JSON.stringify({ todos: validTodos }), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, "Content:", content)
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error) {
    console.error("Parse todos API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
