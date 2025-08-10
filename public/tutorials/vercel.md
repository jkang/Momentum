# Vercel 入门教程（从 0 到部署）

Vercel 是前端托管平台，几步就能把你的项目发布到公网。

## 前置准备
- GitHub 账号一个
- 一个包含 `README.md` 的仓库（可以用上节 GitHub 教程创建）

## 你将学到
- 连接 GitHub 仓库并自动部署
- 环境变量配置
- 自定义域名与预览部署

## 1. 准备工作
- 一个 GitHub 仓库（参考《GitHub 入门教程》）
- 项目包含 package.json，能本地 `npm run dev` 启动

## A. 绑定 GitHub（2 分钟）
1. 打开 https://vercel.com/import
2. 使用 GitHub 登录并授权

## B. 导入项目（5 分钟）
1. 点击 “Add New...” → “Project”
2. 选择你的仓库 `my-ai-product`
3. Framework：Next.js（或默认）
4. 点击 Deploy，等待构建完成

## 2. 一键导入
1. 登录 https://vercel.com ，点击 New Project
2. 选择你的 GitHub 仓库，保持默认设置（Framework 自动识别）
3. 点击 Deploy，等待构建完成即可获得一个 https://xxx.vercel.app 的地址

## C. 环境变量（可选）
1. 在 Project → Settings → Environment Variables
2. 添加键值，如 `NEXT_PUBLIC_API_BASE` 等
3. 重新部署使其生效

## 3. 环境变量配置
- 在 Project Settings -> Environment Variables 添加键值（例如：NEXT_PUBLIC_API_URL）
- 重新触发部署后生效

## 4. 预览部署
- 每次向 GitHub 提交 PR，Vercel 会自动生成预览链接，团队可在线评审

## 5. 自定义域名
- Project Settings -> Domains，绑定你自己的域名并完成解析即可

## 常见问题
- 构建失败？检查项目根目录是否有 package.json
- 404？确认 Next.js 使用 App Router 并存在 `app/page.tsx`

这样你就可以把项目快速上线了。

完成后，你会获得一个 `https://xxx.vercel.app` 的公网地址，发给朋友立刻可用。
