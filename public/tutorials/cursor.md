# 用 Cursor 从 0 到 1 搭建并上线一个 Next.js 待办清单项目

目标：使用 Cursor（AI 编辑器）#45;#45; 从创建项目、开发、修复错误、到提交 GitHub 的全流程实操。完成后你将得到一个可本地运行并已推送到 GitHub 的 Todo App。

适用读者：对前端略有基础或愿意跟着命令走的小白。

先决条件
- Node.js >= 18，建议 20
- 包管理器任选：pnpm/npm/yarn（下文以 pnpm 为例）
- Git 与 GitHub 账号
- 安装 Cursor：https://cursor.com

第 0 步：准备工作
1. 检查版本
   - node -v
   - pnpm -v
   - git --version
2. 登录 GitHub（浏览器或 gh CLI 均可）

第 1 步：创建 Next.js 项目（TypeScript #43; Tailwind）
\`\`\`bash
# 创建项目
pnpm dlx create-next-app@latest todo-pro \
  --ts --eslint --tailwind --app --use-pnpm --src-dir=false --import-alias "@/*"

cd todo-pro

# 启动开发服务器（首次验证脚手架无误）
pnpm dev
# 浏览器访问 http://localhost:3000
\`\`\`

第 2 步：用 Cursor 打开项目并给出“首轮提示词”
1. 打开 Cursor，File → Open Folder → 选择 todo-pro 目录
2. 在左侧文件树选中 app/page.tsx，按下 Cmd/Ctrl #43; K 打开聊天
3. 复制以下“首轮提示词”，粘贴到 Cursor 对话框并发送：

首轮提示词（直接粘贴给 Cursor）
\`\`\`
目标：把 app/page.tsx 改造成一个最小可用的待办清单（Todo）页面。

边界条件：
- 使用 Next.js App Router（已存在）
- 页面为客户端组件，记得加 'use client'
- 只用 Tailwind，不引入额外 UI 库
- 功能：添加、勾选完成、删除、持久化到 localStorage
- 至少包含：输入框、添加按钮、任务列表、空态文案
- 代码必须完整可运行，避免伪代码

产出：
1) 完整的 app/page.tsx
2) 新增一个组件 components/todo-item.tsx（如需）
3) 如需样式，直接内联 Tailwind 类
\`\`\`

4. 点击 Cursor 生成的修改，Review diff → Apply

第 3 步：再次运行并验证
\`\`\`bash
pnpm dev
# 访问 http://localhost:3000
# 试试添加和勾选任务，刷新页面确认 localStorage 持久化
\`\`\`

第 4 步：构建生产版本与本地预览
\`\`\`bash
pnpm build
pnpm start
# 访问 http://localhost:3000，确认构建通过
\`\`\`

第 5 步：演示一个真实的编译错误与修复套路
制造一个常见错误：忘记 'use client'
1. 在 app/page.tsx 顶部故意删除 'use client'
2. 运行 pnpm dev，你会在终端/浏览器看到报错（在 Server Component 中使用了 useState/useEffect）

用 Cursor 修复
- 选中文件 app/page.tsx
- Cmd/Ctrl #43; L 选中报错的代码后发指令：
\`\`\`
出现报错：该组件使用了 useState，但缺少 'use client'。请在文件首行补上，并解释为什么必须加。
\`\`\`
- 点击 Apply，重启 dev，错误应消失

常见报错速查
- ESLint/TypeScript 类型不匹配：把光标放在报错位置，Cmd/Ctrl #43; I 询问“Explain this error”，再用“Fix this”自动修复
- 路径别名失效：确认 tsconfig.json 中 compilerOptions.paths 存在 "@/*"；导入写成 import x from "@/..." 即可
- Tailwind 类名不生效：确认 app/globals.css 已引入；tailwind.config.js 的 content 覆盖 app 和 components

第 6 步：为页面补一轮产品打磨（示例提示词）
\`\`\`
为 Todo 页面添加顶部栏（标题“Todo Pro” #43; 统计未完成任务数），
任务项支持双击编辑，编辑时按 Enter 保存，Esc 取消。注意无障碍属性与键盘操作。
写出完整代码改动，并说明你对可访问性的处理。
\`\`\`
- 让 Cursor Apply 多文件改动；若涉及大量文件，使用右上角 Agent“Apply”批量修改，Review 再确认

第 7 步：添加简单测试（可选）
- 新建 tests/basic.spec.ts，写 1～2 条 Playwright 测试
- 让 Cursor 生成 playwright.config.ts，并在 package.json 增加脚本
- 运行 npx playwright test 进行本地回归

第 8 步：初始化 Git 并提交到 GitHub
命令行方式
\`\`\`bash
# 在项目根目录
git init
git add -A
git commit -m "feat: bootstrap Next.js todo app"

# 在 GitHub 新建一个空仓库（例如 todo-pro）
# 复制仓库地址后：
git branch -M main
git remote add origin https://github.com/<你的用户名>/todo-pro.git
git push -u origin main
\`\`\`

直接用 Cursor 集成（可选）
- 左侧 Source Control 面板 → Publish to GitHub
- 选择组织/仓库名 → Confirm
- 首次可能需要登录 GitHub 授权

第 9 步：持续迭代的“安全提示词范式”
- 说明目标 #43; 验收条件（可运行/可回退）
- 限定边界（不新增外部依赖；或允许新增但需给出原因）
- 要求给出“完整可运行代码”而不是片段
- 让 Cursor 分批提交改动，并在每步后本地跑一次 pnpm dev 验证
- 大改动前创建 Git 分支：git checkout -b feat/x

恭喜！你已经会用 Cursor 驱动一个完整的 Next.js 小项目：从搭建、到修错、再到推送 GitHub。接下来你可以让 Cursor 继续增加 API 路由、接数据库或做部署流水线。

术语小词典（Cursor/前端常用）
--------------------------------
- Node.js：运行 JavaScript 的“后端程序”。就像浏览器外的一台发动机，负责执行构建与开发服务器命令。
- 包管理器（pnpm/npm/yarn）：下载与管理第三方库的工具。你可以理解为“应用商店命令行版”。本教程以 pnpm 为例。
- Next.js：在 React 之上提供路由、数据获取与构建优化的框架，可做 SSR/静态站点与全栈应用。
- App Router：Next.js 15 默认的文件夹式路由系统，基于 app/ 目录，支持服务端组件等新能力 [^3]。
- 开发服务器（dev server）：本地实时预览环境，保存代码会自动热更新。命令一般为 pnpm dev。
- 构建（build）：把源码打包成可上线的高性能产物，检查类型错误与潜在问题。命令一般为 pnpm build。
- 生产预览（start）：使用构建产物启动本地服务，接近线上表现。命令一般为 pnpm start。
- 客户端组件（'use client'）：在浏览器运行的 React 组件，可用 useState 等 Hook；文件首行需要写 'use client'。
- 服务端组件（RSC）：默认在服务器渲染的组件，不可用浏览器专属 API；适合数据获取与首屏性能优化。
- Tailwind CSS：原子化样式库，用类名快速堆叠样式，避免手写大量 CSS。
- ESLint：代码“语法检查器”，像语文老师挑错；TypeScript：在 JS 上加“类型提示”的安全网。
- localStorage：浏览器内的小型键值存储，适合做“轻量持久化”，刷新页面仍能保留数据。
- Git：版本控制工具，记录每次更改的“快照”；commit 是一次保存，branch 是一条并行开发支线。
- GitHub：基于 Git 的远程仓库托管平台；remote origin 是你的云端仓库地址；push 是把本地提交推到云端。
- Pull Request（PR）：把“我的分支更改”提给主分支审核的流程，便于代码评审与自动测试。
- EADDRINUSE 3000：端口被占用的报错；换个端口如 pnpm dev --port 3001 即可。
- 光标工作流（Cursor）：
  - Cmd/Ctrl + K：对当前文件或选定上下文进行“聊天”式改造
  - Cmd/Ctrl + L：对选中文本发即时指令，适合“修一个点”
  - Explain this / Fix this：先解释再修复，可控性更高
- 最小化复现：遇到报错时，把问题缩小到最少几行代码/一个文件，发给 AI 更容易快速定位并给出稳定修复方案。
