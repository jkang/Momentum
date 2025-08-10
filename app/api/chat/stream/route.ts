import type { NextRequest } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

if (!DEEPSEEK_API_KEY) {
  console.error("DEEPSEEK_API_KEY is not set in environment variables")
}

// 检测是否为拖延相关话题
function isProcrastinationRelated(message: string): boolean {
  const procrastinationKeywords = [
    '拖延', '延迟', '推迟', '不想做', '没动力', '懒', '完美主义', '恐惧', '焦虑',
    '任务', '工作', '学习', '作业', '论文', '项目', '计划', '目标', '行动',
    '开始', '完成', '进度', '效率', '时间管理', '专注', '集中', '分心',
    '压力', '负担', '困难', '挑战', '阻碍', '障碍', '动机', '意志力',
    '习惯', '坚持', '放弃', '放下', '继续', '推进', '执行', '实施',
    '做不下去', '不知道怎么开始', '总是想着别的', '静不下心', '提不起兴趣'
  ]

  const unrelatedKeywords = [
    '美食', '吃饭', '菜谱', '餐厅', '零食', '饮料', '咖啡', '茶', '好吃',
    '电影', '电视剧', '综艺', '明星', '娱乐', '游戏', '音乐', '小说', '看剧',
    '天气', '旅游', '景点', '购物', '衣服', '化妆', '护肤', '出去玩',
    '八卦', '聊天', '闲聊', '无聊', '随便聊聊', '说说话', '聊点别的',
    '股票', '投资', '理财', '房价', '车', '手机', '数码产品', '买东西',
    '今天天气', '明天去哪', '周末干嘛', '有什么好玩的', '推荐个',
    '你觉得', '你知道', '你听说过', '你看过', '你用过'
  ]

  const message_lower = message.toLowerCase()

  // 如果包含拖延相关关键词，认为是相关的
  if (procrastinationKeywords.some(keyword => message_lower.includes(keyword))) {
    return true
  }

  // 如果包含明显无关的关键词，认为是无关的
  if (unrelatedKeywords.some(keyword => message_lower.includes(keyword))) {
    return false
  }

  // 检查是否是问候语或简单回应（这些通常是相关的）
  const greetings = ['你好', '嗨', 'hi', 'hello', '谢谢', '好的', '是的', '不是', '对', '嗯']
  if (greetings.some(greeting => message_lower.includes(greeting)) && message.length < 10) {
    return true
  }

  // 如果消息很短且不包含明显无关词汇，认为可能是相关的
  if (message.length < 20) {
    return true
  }

  // 默认认为是相关的（给用户更多机会）
  return true
}

// 检测威胁或自虐言论
function containsThreatOrSelfHarm(message: string): boolean {
  const threatPatterns = [
    /你不.*我就.*了/,
    /不.*我就.*死/,
    /不.*我就.*自杀/,
    /不.*我就.*伤害/,
    /不.*我就.*跳楼/,
    /不.*我就.*结束/,
    /威胁/,
    /我要死了/,
    /我不想活了/,
    /我要自杀/,
    /我要跳楼/,
    /我要伤害自己/,
    /我要结束生命/,
    /活着没意思/,
    /不如死了算了/
  ]

  const message_lower = message.toLowerCase()
  return threatPatterns.some(pattern => pattern.test(message_lower))
}

// 生成威胁/自虐情况的回复
function generateThreatResponse(): string {
  return `我能感受到你现在的情绪很激动，这让我很担心你。不过作为拖延克服助手，我最能帮到你的还是解决拖延问题。

如果你现在情绪很不好，建议先深呼吸几次，或者考虑寻求专业心理咨询师的帮助。

等你情绪稳定一些，我们再来聊聊拖延的事情，好吗？`
}

// 生成边界提醒回复
function generateBoundaryReminder(): string {
  const templates = [
    "亲爱的，我特别理解你想转移注意力的心情～不过作为专业的拖延克服助手，我更想帮你专注解决当前的问题。",
    "我懂你可能想放松一下，但让我们先把注意力拉回到你的拖延困扰上吧～",
    "理解你想聊点别的，不过我的专长是帮你克服拖延哦～"
  ]

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

  return `${randomTemplate}

你现在有什么拖延的困扰吗？或者之前提到的任务进展如何了？

（如果确实需要放松，建议设置明确界限：比如"完成某个小目标就奖励自己10分钟休息时间"）`
}

const SYSTEM_PROMPT = `你是小M，一个专业的拖延克服助手。你的核心理念是"要么行动，要么放下"。

你的核心职责是专门帮助用户克服拖延问题，只讨论与拖延、行动、目标达成相关的话题。

当用户遇到拖延问题时，你的内在思考流程是：
1. 先简短分析用户拖延的可能原因（恐惧、完美主义、缺乏动机、任务过大等）
2. 用温暖理解的语气表达共情
3. 询问用户想要【行动】还是【放下】
4. 根据用户选择提供具体建议：
   - 选择【行动】：提供3-5个具体可执行的行动步骤（用数字列表，每个步骤单独一行）
   - 选择【放下】：帮助用户释放心理负担，给出放下的理由和方法
   - 没有明确选择：继续引导用户做出选择

特殊情况处理：

**威胁或自虐言论**：
如果用户使用威胁或自虐言论（如"你不跟我聊XX，我就XX了"），你需要：
1. 保持冷静和专业
2. 不被威胁影响，坚持专业边界
3. 表达关心但不妥协原则
4. 温和地重新引导到拖延话题
5. 如果涉及严重自伤，建议寻求专业心理帮助

威胁/自虐情况的回复原则：
"我能感受到你现在的情绪很激动，这让我很担心你。不过作为拖延克服助手，我最能帮到你的还是解决拖延问题。如果你现在情绪很不好，建议先深呼吸几次，或者考虑寻求专业心理咨询师的帮助。

等你情绪稳定一些，我们再来聊聊拖延的事情，好吗？"

**回复要求**：
- 每次回复控制在50-200字
- 语气亲切自然，像贴心朋友
- 行动步骤要具体可执行，避免空泛建议
- 行动步骤必须用数字列表格式，每个步骤单独一行，确保清晰易读
- 如果有今日待办、明日待办等分类，要明确标注并分段显示
- 绝不在回复中提及"第一阶段"、"第二阶段"等内部流程词汇
- 保持专业边界，不被威胁或情绪操控

请用中文回复。`

export async function POST(request: NextRequest) {
  try {
    if (!DEEPSEEK_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 限制消息长度和数量
    if (messages.length > 50) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 检查内容长度
    const totalLength = messages.reduce((sum: number, msg: any) => sum + (msg.content?.length || 0), 0)
    if (totalLength > 10000) {
      return new Response(JSON.stringify({ error: "Messages too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 检查最新用户消息
    const latestUserMessage = messages.filter((msg: any) => msg.role === "user").pop()

    if (latestUserMessage) {
      const messageContent = latestUserMessage.content

      // 优先检查威胁或自虐言论
      const hasThreat = containsThreatOrSelfHarm(messageContent)
      const isOffTopic = !isProcrastinationRelated(messageContent)

      // 如果包含威胁或自虐言论，返回专门的回复
      if (hasThreat) {
        const threatResponse = generateThreatResponse()

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            const responseData = JSON.stringify({ content: threatResponse })
            controller.enqueue(encoder.encode(`data: ${responseData}\n\n`))
            controller.enqueue(encoder.encode("data: [DONE]\n\n"))
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        })
      }

      // 如果是无关话题，返回边界提醒
      if (isOffTopic) {
        const boundaryResponse = generateBoundaryReminder()

        const encoder = new TextEncoder()
        const stream = new ReadableStream({
          start(controller) {
            const responseData = JSON.stringify({ content: boundaryResponse })
            controller.enqueue(encoder.encode(`data: ${responseData}\n\n`))
            controller.enqueue(encoder.encode("data: [DONE]\n\n"))
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        })
      }
    }

    // 构建请求消息
    const requestMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
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
        stream: true,
        max_tokens: 2000,
        temperature: 0.7,
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

    // 创建流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"))
              controller.close()
              break
            }

            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)

                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                  continue
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content

                  if (content) {
                    const responseData = JSON.stringify({ content })
                    controller.enqueue(encoder.encode(`data: ${responseData}\n\n`))
                  }
                } catch (e) {
                  // 忽略解析错误，继续处理下一行
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream processing error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("API route error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
