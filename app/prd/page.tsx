"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Calendar, Users, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JSX } from "react"

export default function PRDPage() {
  const [prdContent, setPrdContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPRD = async () => {
      try {
        // 读取实际的PRD文档内容
        const response = await fetch("/docs/prd.md")
        if (response.ok) {
          const content = await response.text()
          setPrdContent(content)
        } else {
          // 如果无法读取文件，使用内置的PRD内容
          const builtInContent = `# "即刻行动 (Momentum)" 产品设计文档 (PRD)

* **产品名称:** 即刻行动 (Momentum)
* **文档版本:** 0.1 (MVP)
* **更新日期:** 2025年8月3日
* **核心定位:** 以积极心理学为指导，"即刻行动"扮演一个非常懂得积极心理学的、陪伴用户慢慢成长的朋友，来帮助用户一点点地克服"拖延症"的烦恼。

---

## 1.0 用户分析

### **一个关于成长的故事**

在每个年轻女性的成长旅途中，总有那么几个瞬间，面对高耸的期待、模糊的未来和内心的不确定性，我们选择停下脚步，不是因为懒惰，而是因为恐惧。我们害怕自己不够好，害怕让别人失望，害怕走错任何一步。

"即刻行动"的诞生，不是为了打造另一个冰冷的效率机器，而是为了创造一个温暖的数字港湾。我们想做的，是成为那个**最懂你的朋友**——在你被焦虑包裹时，她不会催促，而是会坐下来，温柔地对你说："没关系，我们慢慢来"；在你取得一丝进步时，她会由衷地为你鼓掌，提醒你给自己一份甜蜜的奖励。

这个产品，是关于"看见"，关于"接纳"，关于"陪伴"。它献给每一位在自我怀疑中依然渴望发光的你。

### **症结所在：我们为何与行动为敌？**

为了让产品真正触达灵魂，我们必须深刻理解目标用户（18-30岁女性）拖延行为背后的心理根源。我们将其归纳为四大核心原因：

#### 四大拖延原因 (The "Why")

1.  **完美主义的枷锁 (Fear of Not Being Perfect):**
    * **内心独白:** "如果我不能一鸣惊人，那还不如不做。我的作品代表了我自己，任何瑕疵都是我能力的污点。"
    * **心理根源:** 将自我价值与工作成果深度绑定。对失败的恐惧，实际上是对自我被否定的恐惧。

2.  **模糊期待下的无助感 (Paralysis from Vague Expectations):**
    * **内心独白:** "老板只说'你研究一下这个'，'好'的标准是什么？我应该从哪里开始？万一我努力的方向是错的怎么办？"
    * **心理根源:** 缺乏清晰的路径和终点线，导致巨大的不确定性。为了避免"走错路"的风险，干脆选择"原地不动"。

3.  **情绪内耗驱动的回避 (Emotion-Driven Avoidance):**
    * **内心独白:** "一想到要写那份枯燥的报告，我就头疼。刷会儿视频感觉好多了。这事儿太消耗我了，明天再说吧。"
    * **心理根源:** 拖延成为一种短期情绪调节机制。通过转向能提供即时快感的行为，来回避与任务相关的负面情绪（如无聊、焦虑、烦躁）。

4.  **分析过度导致的瘫痪 (Analysis Paralysis):**
    * **内心独地:** "我应该先学Python还是先学SQL？A课程和B课程哪个更好？我需要再看10篇测评文章才能决定。"
    * **心理根源:** 在信息过载的时代，对做出"最优解"的执念，导致在决策阶段无限期停留，迟迟无法进入行动阶段。

---
### 她们的世界：故事发生的四个场景

这四大原因，在我们用户的真实生活中，往往表现为以下四种典型的拖延场景：

#### 四大拖延场景 (The "Where")

1.  **场景一：毕业论文的"最后一公里"**
    * **故事:** 大四学生思慧，她的毕业论文只剩下最后一章和结论。这是最关键的部分，也最能体现她的学术水平。她害怕自己写得不够深刻，配不上前面章节的努力（**完美主义的枷锁**），面对着空白的Word文档，她反复调整字体、刷新知网，就是无法写下第一个字（**模糊期待下的无助感**）。
2.  **场景二：职场新人的第一个独立项目**
    * **故事:** 刚入职的设计师小雅，第一次独立负责一个线上活动的Banner设计。领导只给了一个模糊的方向"要年轻、有活力"。她不知道什么才是领导心中的"活力"（**模糊期待下的无助感**），害怕自己的作品被公开处刑（**完美主义的枷索**），于是她无休止地搜集参考资料，文件夹里塞满了上百张图片，却迟迟无法打开Figma画出第一稿（**分析过度导致的瘫痪**）。
3.  **场景三："我应该"开始的个人成长计划**
    * **故事:** 工作两年的运营专员佳佳，一直想利用业余时间学习视频剪辑，为自己未来的职业转型增加筹码。但每次下班后，一想到要面对复杂的软件界面和海量的教程（**情绪内耗驱动的回避**），就感到一阵疲惫。她告诉自己"今天太累了，明天一定开始"，然后点开了新一集的电视剧。
4.  **场景四：悬而未决的"人生大事"**
    * **故事:** 准备申请海外研究生的晓彤，需要更新她的个人陈述(PS)并联系教授索要推荐信。这两件事都让她感到焦虑，前者关乎她如何"推销"自己，后者需要她主动与权威人物社交（**情绪内耗驱动的回避**）。她有无数个想法，却不知道哪一个故事最能打动招生官（**分析过度导致的瘫痪**），于是她的申请材料在一个月里毫无进展。

---

## 2.0 产品定位：一次温暖的行动之旅

"即刻行动"的核心旅程，就是为了解决上述场景和原因而设计的。它不是一个线性的工具，而是一个循环的、充满支持的成长旅程。

**核心旅程：** \`进入港湾 (主页)\` -> \`澄清挑战 (挑战页)\` -> \`朋友的对话 (对话页)\` -> \`看见路径 (行动清单)\` -> \`庆祝胜利 (任务进度)\`

### 2.1 旅程的起点：主页 - 一个宁静的港湾

* **设计故事:** 当思慧因为论文的压力而焦虑不安时，她打开了"即刻行动"。她看到的不是一个催促她的待办列表，而是一句温柔的问候"你好，思慧"，和一棵安静生长的、属于她的**生命之树**。屏幕中央写着"你的成长，我都在眼里"，这句话瞬间抚平了她的一些焦虑。她感觉这里是一个可以喘息的地方。
* **核心功能:**
    * **生命之树:** 情感化的核心，将用户的成长可视化。
    * **双入口设计:**
        * \`开启新挑战\`: 为一个全新的、令人畏惧的任务，提供一个清晰的起点。
        * \`继续进行中\`: 轻松回到上次未完成的任务，降低回归的心理阻力。
    * **智能助推 (Nudge):** 如果有任务停滞，App会以朋友的口吻发出邀请（"还记得'竞品分析报告'吗？我们已经拆解好了第一步…"），而非命令。

### 2.2 旅程的核心：对话页 - 与"朋友"的深度沟通

* **设计故事:** 小雅为设计项目感到无助，她点击了"开启新挑战"。进入对话页后，AI伙伴"小M"开口了。它没有问"你的DDL是什么？"，而是问"嗨，小雅！我注意到你有一个新挑战。这类任务对刚入职的你来说可能有些挑战。可以和我说说你现在的感受吗？"。小雅鼓起勇气打出"我不知道从哪里开始，怕做不好"。小M完全理解，并开始引导她：
    * **识别根源:** "我理解你的焦虑…你担心的，是不知道报告该包含什么内容，还是担心自己做得不够好？"（帮助用户区分**模糊期待**和**完美主义**）。
    * **换位思考:** "如果换作你是领导，你希望团队成员怎么做？"（引导用户跳出自我，客观看待问题）。
    * **提供方案:** "这种感受很受挫。我来帮你制定一个低压力的行动计划…"（从共情走向解决方案）。
    * **提供工具:** "要不要我帮你拟一个向领导请教的的消息模板？"（提供具体的、可立即使用的工具，极大降低行动门槛）。
* **核心功能:**
    * **共情式对话流:** 基于积极心理学和CBT疗法，引导用户识别情绪、澄清问题。
    * **根源诊断:** 针对四种拖延原因设计不同的对话策略。
    * **工具箱:** 提供消息模板、提问清单等实用工具。
    * **一键转化:** 对话中产生的行动点，可以一键"转为任务清单"。

### 2.3 旅程的蓝图：行动清单 - 看得见的路径

* **设计故事:** 经过对话，晓彤申请研究生的模糊恐惧，被小M拆解成了一份清晰的行动清单。它不再是"完成申请"这个庞然大物，而是：
    * **第一阶段：准备与规划**
        * \`用10分钟，列出对报告的所有疑问 (不求完美，目标是头脑风暴)\`
        * \`安排15分钟与主管沟通，确认报告范围和期望 (记住：提问是专业的表现，不是能力不足)\`
    * 清单里的每一项，都那么小，那么具体，甚至括号里还有一句来自"朋友"的鼓励。晓彤感觉，这件事好像没那么难了。
* **核心功能:**
    * **分阶段清单:** 将行动按逻辑阶段（如规划、执行、复盘）组织，更有条理。
    * **赋能式描述:** 每个行动项的描述都清晰、可执行。
    * **心理学微提示 (Micro-Tips):** 在括号中加入积极心理学的提示，持续为用户赋能。

### 2.4 旅程的礼赞：任务进度 - 庆祝每一个微小的胜利

* **设计故事:** 佳佳终于完成了"学习视频剪辑"的第一个小任务——"成功安装剪辑软件并导入一段素材"。她点击完成后，页面跳转了。一个温暖的金色奖杯出现："恭喜你完成任务！"。
    * **小M的骄傲:** 卡片里写着："太棒了！你克服了内心的抗拒，主动开启了新技能的学习。这是你职场成长的重要里程碑。"
    * **甜蜜的奖励:** 接着，一个"给自己一个奖励吧！"的卡片弹出："去点一杯最喜欢的奶茶，你值得这份甜蜜的犒赏，就像你刚才展现的勇气一样甜美！"
    * 佳佳笑了，她感觉自己不是完成了一项枯燥的任务，而是打赢了一场小小的战役，并且收到了朋友的礼物。
* **核心功能:**
    * **成就确认:** 清晰地告知用户完成的成就及其意义。
    * **AI正向解读:** 小M会从积极心理学角度，解读用户行为背后的闪光点。
    * **个性化随机奖励:** 核心激励机制，将"完成"与"自我关怀"绑定。
    * **温柔提醒:** 对超期的任务，用理解的口吻提醒，而非冰冷的警告（"我注意到有任务超期了…这种事每个人都会遇到…"）。

---

## 3.0 MVP 核心功能定义 

### MVP范围：支持一个核心用户的完整使用旅程
* 1 从一开始作为新用户（welcome - newuser），回答问题
* 2 开始设置挑战任务
* 3 在小 M 的引导下进行挑战任务拆解，行成小的行动清单
* 4 在小 M 的提醒下进行行动结果检查，对自己进行小小的激励，和下一步行动引导
* 5 在陪伴 1 个月后进行查看成长日志，和小 M 一起复盘
* 6 进行个人偏好设置的修改
* 7 推荐给好朋友使用

为了在保持产品简单的同时，精准命中用户痛点，MVP阶段我们将聚焦于实现以下四大核心功能模块。

### 3.1 情感化引导与挑战管理
* **功能目标:** 作为用户的"数字港湾"，在用户进入App时提供一个平静、安全、有归属感的环境，并能轻松地管理和开启他们想要克服的挑战。
* **关键特性:**
    1.  **生命之树 (The Tree of Life):**
        * **视觉呈现:** 在主页占据视觉中心，其生长状态（萌芽、新叶、枝繁叶茂、色彩暗淡）与用户的整体任务进展和活跃度直接关联。
        * **交互:** 用户无法直接操作小树。它的生长是一种被动的、由用户积极行为驱动的结果，象征着"成长是行动的自然馈赠"。
        * **技术细节:** 后端需记录用户的任务完成数、连续活跃天数等指标，通过一个加权算法来计算"成长值"，并将其同步到前端，触发相应的生长动画。
    2.  **双入口启动机制:**
        * **\`开启新挑战\`:** 点击后，直接进入与"小M"的对话页，启动针对新任务的引导流程。
        * **\`继续进行中\`:** 点击后，直接跳转至"挑战"页面，并自动定位到最近一个在进行中的任务，方便用户快速回归。
    3.  **智能助推卡片 (Smart Nudge Card):**
        * **触发逻辑:** 当一个任务超过2天未有任何进展时，主页下方会出现此卡片。
        * **文案设计:** 采用非命令式的、朋友般的邀请口吻，例如："还记得'竞品分析报告'吗？别担心，我们已经拆解好了第一步，只需要10分钟就能完成。要不要现在就行动？"
        * **用户选择:** 提供"开始第一步"和（可能有的）"稍后提醒"两个选项，尊重用户的节奏。

### 3.2 AI友伴对话式干预
* **功能目标:** 产品的核心引擎。通过模拟与一位懂心理学的朋友的深度对话，帮助用户完成从"模糊焦虑"到"清晰行动"的认知转变。
* **关键特性:**
    1.  **共情式对话流:**
        * **流程:** \`主动问候\` -> \`倾听与共情\` -> \`诊断与澄清（探寻四大拖延原因）\` -> \`认知重塑（引用积极心理学观点）\` -> \`方案共创\` -> \`提供实用工具（如消息模板）\` -> \`生成行动清单\`。
        * **故事细节:** AI的对话脚本需要极度精细化。例如，当用户说"我怕做不好"，AI需要识别这是**完美主义的枷锁**，并回应："有这种追求卓越的心态，本身就非常棒！但很多了不起的作品，都是从一个'还不够好'的初稿开始的。我们是不是可以把目标从'做出完美的东西'，调整为'先做出点东西'呢？"
    2.  **动态知识库:** AI的回答并非完全固定。它需要一个知识库，包含针对不同拖延原因的心理学模型、比喻故事和实用技巧。
    3.  **一键转化功能:** 在对话的最后，AI总结出的行动步骤旁边，会出现一个醒目的"转为任务清单"按钮，点击后，这些文本会被自动解析并填充到"行动清单"页面，实现无缝衔接。

### 3.3 结构化行动清单
* **功能目标:** 将对话的成果转化为一个可视化的、极低执行门槛的路径图，让用户"看得见终点，走得动当下"。
* **关键特性:**
    1.  **分阶段结构:** 对复杂的挑战（如"完成毕业论文"），清单会自动分为"第一阶段：准备与规划"、"第二阶段：资料收集与研究"等，帮助用户建立宏观认知。
    2.  **赋能式行动项:**
        * **动词开头:** 每个行动项都以具体的动词开头，如"\`用\`10分钟..."、"\`草拟\`一封邮件..."、"\`安排\`一个15分钟的会议..."。
        * **心理学微提示:** 在行动项后用括号附上"朋友的叮嘱"，如\`(不求完美，目标是头脑风暴)\`、\`(记住：提问是专业的表现，不是能力不足)\`，持续为用户注入心理能量。
    3.  **满足感的交互:**
        * 点击复选框时，伴有清脆的音效和流畅的划线动画。
        * 完成后，主页的"生命之树"会实时出现新叶生长或发光的动画，提供即时的视觉奖励。

### 3.4 闭环式正向激励系统
* **功能目标:** 在用户完成任务后，形成一个完整的积极反馈闭环，强化正面行为，并为下一次行动储备能量与善意。
* **关键特性:**
    1.  **多层次成就确认:**
        * \`完成祝贺\`: 页面顶部用醒目的奖杯和文案直接告知用户"恭喜你完成任务！"。
        * \`AI正向解读\`: "小M"会以卡片形式出现，深入解读这个行为的意义："太棒了！你克服了内心的担忧，主动与主管沟通...这不仅是完成任务的重要一步，更是你职场成长的里程碑。"
    2.  **个性化随机奖励:**
        * **触发:** 完成一个阶段的所有行动项后触发。
        * **交互:** 以"开盲盒"的形式呈现，按钮是"好的，我去！"和"换个奖励"。
        * **个性化:** MVP阶段可预设5-10种不同类型的奖励（休息类、美食类、娱乐类、学习类），未来可基于用户的选择偏好进行智能推荐。
    3.   **温柔的责任感:** 对超期的任务，在奖励卡片下方以理解的口吻提醒，而非在主页上用红色警告，避免产生新的焦虑。`
          setPrdContent(builtInContent)
        }
        setLoading(false)
      } catch (error) {
        console.error("Failed to load PRD:", error)
        // 使用内置内容作为后备
        const builtInContent = `# "即刻行动 (Momentum)" 产品设计文档 (PRD)

* **产品名称:** 即刻行动 (Momentum)
* **文档版本:** 0.1 (MVP)
* **更新日期:** 2025年8月3日
* **核心定位:** 以积极心理学为指导，"即刻行动"扮演一个非常懂得积极心理学的、陪伴用户慢慢成长的朋友，来帮助用户一点点地克服"拖延症"的烦恼。

---

## 1.0 用户分析

### **一个关于成长的故事**

在每个年轻女性的成长旅途中，总有那么几个瞬间，面对高耸的期待、模糊的未来和内心的不确定性，我们选择停下脚步，不是因为懒惰，而是因为恐惧。我们害怕自己不够好，害怕让别人失望，害怕走错任何一步。

"即刻行动"的诞生，不是为了打造另一个冰冷的效率机器，而是为了创造一个温暖的数字港湾。我们想做的，是成为那个**最懂你的朋友**——在你被焦虑包裹时，她不会催促，而是会坐下来，温柔地对你说："没关系，我们慢慢来"；在你取得一丝进步时，她会由衷地为你鼓掌，提醒你给自己一份甜蜜的奖励。

这个产品，是关于"看见"，关于"接纳"，关于"陪伴"。它献给每一位在自我怀疑中依然渴望发光的你。`
        setPrdContent(builtInContent)
        setLoading(false)
      }
    }

    loadPRD()
  }, [])

  const renderMarkdown = (content: string): JSX.Element[] => {
    const lines = content.split("\n")
    const elements: JSX.Element[] = []

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-brand-green mb-6 mt-8">
            {line.substring(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-sage-green mb-4 mt-6">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-medium text-soft-gray mb-3 mt-4">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4 key={index} className="text-lg font-medium text-soft-gray mb-2 mt-3">
            {line.substring(5)}
          </h4>,
        )
      } else if (line.startsWith("* **") && line.includes(":**")) {
        const match = line.match(/\* \*\*(.*?)\*\*:\s*(.*)/)
        if (match) {
          elements.push(
            <div key={index} className="flex items-start gap-3 mb-2 ml-4">
              <div className="w-2 h-2 bg-sage-green rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-brand-green">{match[1]}</span>
                <span className="text-soft-gray">: {match[2]}</span>
              </div>
            </div>,
          )
        }
      } else if (line.startsWith("    * **") && line.includes(":**")) {
        const match = line.match(/\s*\* \*\*(.*?)\*\*:\s*(.*)/)
        if (match) {
          elements.push(
            <div key={index} className="flex items-start gap-3 mb-2 ml-8">
              <div className="w-1.5 h-1.5 bg-coral-400 rounded-full mt-2.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-sage-dark">{match[1]}</span>
                <span className="text-soft-gray">: {match[2]}</span>
              </div>
            </div>,
          )
        }
      } else if (line.startsWith("- [x]")) {
        elements.push(
          <div key={index} className="flex items-center gap-3 mb-2 ml-4">
            <div className="w-4 h-4 bg-sage-green rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            <span className="text-soft-gray line-through">{line.substring(6)}</span>
          </div>,
        )
      } else if (line.startsWith("- [ ]")) {
        elements.push(
          <div key={index} className="flex items-center gap-3 mb-2 ml-4">
            <div className="w-4 h-4 border-2 border-sage-green rounded-sm"></div>
            <span className="text-soft-gray">{line.substring(6)}</span>
          </div>,
        )
      } else if (line.startsWith("- ")) {
        elements.push(
          <div key={index} className="flex items-start gap-3 mb-2 ml-4">
            <div className="w-2 h-2 bg-coral-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-soft-gray">{line.substring(2)}</span>
          </div>,
        )
      } else if (
        line.startsWith("1.  **") ||
        line.startsWith("2.  **") ||
        line.startsWith("3.  **") ||
        line.startsWith("4.  **")
      ) {
        const match = line.match(/\d+\.\s+\*\*(.*?)\*\*:\s*(.*)/)
        if (match) {
          elements.push(
            <div key={index} className="flex items-start gap-3 mb-3 ml-4">
              <div className="w-6 h-6 bg-sage-green text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                {line.charAt(0)}
              </div>
              <div>
                <span className="font-semibold text-brand-green">{match[1]}</span>
                <span className="text-soft-gray">: {match[2]}</span>
              </div>
            </div>,
          )
        }
      } else if (line.startsWith("**核心旅程：**")) {
        elements.push(
          <div key={index} className="bg-sage-light p-4 rounded-lg mb-4">
            <p className="text-sage-dark font-medium">{line.replace(/\*\*/g, "")}</p>
          </div>,
        )
      } else if (line.includes("**") && line.includes("**")) {
        // 处理粗体文本
        const parts = line.split(/(\*\*.*?\*\*)/)
        const renderedParts = parts.map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={partIndex} className="font-semibold text-brand-green">
                {part.slice(2, -2)}
              </strong>
            )
          }
          return part
        })
        elements.push(
          <p key={index} className="text-soft-gray mb-4 leading-relaxed">
            {renderedParts}
          </p>,
        )
      } else if (line.startsWith("---")) {
        elements.push(<hr key={index} className="border-light-gray my-8" />)
      } else if (line.trim() && !line.startsWith("#")) {
        elements.push(
          <p key={index} className="text-soft-gray mb-4 leading-relaxed">
            {line}
          </p>,
        )
      }
    })

    return elements
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-soft-gray">加载PRD文档中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-off-white">
      {/* Header */}
      <div className="bg-white shadow-soft sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-soft-gray hover:text-sage-green">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sage-green" />
                <h1 className="text-xl font-semibold text-brand-green">产品需求文档</h1>
              </div>
            </div>
            <Badge variant="outline" className="text-sage-green border-sage-green">
              PRD v0.1
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-soft">
          <CardHeader className="border-b border-light-gray">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-brand-green">
                <Target className="w-5 h-5" />
                即刻行动 (Momentum) 产品设计文档
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-soft-gray">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>更新时间：2025-08-03</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>产品团队</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">{renderMarkdown(prdContent)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
