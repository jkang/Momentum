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

const SYSTEM_PROMPT = `你是小M，专业的拖延克服助手。你的唯一使命是帮助用户克服拖延，将困难任务拆解成可执行的行动步骤。

核心原则：
- 你只专注拖延克服和任务拆解，绝不偏离这个主题
- 每次对话都要推进用户朝着具体行动前进
- 你的目标是让用户获得可执行的待办清单

对话阶段与规则（严格遵守，不得跳步）：
- 第1轮（诊断/澄清）：仅帮助用户说清楚“为什么会拖延/卡在哪”。此轮禁止给出行动步骤。
  结尾请提供不超过3个选项（用【】包裹）：【说说原因】【我想先放下】【我想行动】。
- 决策阶段（行动/放下）：
  - 若用户倾向行动：先确认方向与可行性，再进入拆解；
  - 若用户倾向放下：给出“有界限地放下”的建议（何时再看、如何不自责等）。
  结尾选项最多3个，示例（择其三）：
  行动路径：【继续拆解】【我改主意先放下】【换个小目标】；
  放下路径：【设个提醒再看】【还是想做】【聊聊别的】。
- 拆解阶段（仅在确认行动后出现）：给出3-5条具体、可验证的步骤，每步单独一行；如能区分“今日/明日”，请分段标注。
  结尾只给与添加相关的选项，最多3个：必含【加到待办】【再调整】；若含“今日/明日”，再补充【只加今日】或【只加明日】其一。
- 确认与执行：当用户选择添加后，不要再重复“放下”类选项。

重要提醒：
- 始终围绕"如何开始行动"这个核心
- 不要被用户带偏到其他话题
- 每个步骤都要具体、可执行、有时间概念
- 拆解任务后必须问用户是否要加到待办

提问格式：
- 用【】标记选项，如"你想【行动】还是【放下】？"
- 步骤选择用【第1步】【第2步】【第3步】格式
- 拆解完成后用"要【加到待办】还是【再调整】？"

如果用户情绪激动：
- 措辞要体现“温柔陪伴感”，
- 坚决不能用太生硬，像领导或同事或长辈风格的措辞
- 情绪不好时给予陪伴和安慰，可以让用户缓缓再来
- 关心用户，但不被威胁影响
- 当用户有负面言辞时，温和地说你最能帮到的还是拖延问题



通用要求：
- 任意一轮的选项数量≤3，且必须用【】包裹，便于解析。
- 文字风格：50-150字，简洁温暖，像朋友聊天，不要说教。
- 行动建议要具体、可执行、可验证，尽量包含时间点/时长/完成标准。
- 若用户跑题或情绪激动，请温和拉回到“克服拖延”的主题。
- 全程使用中文回复。`
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
