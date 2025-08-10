# Momentum 项目文件清理审计

## 第一部分：明确保留的文件
- `app/page.tsx` - 主页面
- `app/layout.tsx` - 根布局
- `app/globals.css` - 全局样式
- `app/chat/page.tsx` - 聊天页面
- `components/` 下所有组件文件
- `lib/` 下所有库文件
- `hooks/` 下所有钩子文件
- `public/images/` 下的图片资源

## 第二部分：建议删除的文件（高置信度未使用）

### docs/ 目录下的 HTML 文件
- `docs/actionlist.html` - 静态 HTML，已有对应 React 组件
- `docs/challenge-tasks.html` - 静态 HTML，已有对应 React 页面
- `docs/chat.html` - 静态 HTML，已有 app/chat/page.tsx
- `docs/checkprogress.html` - 静态 HTML，功能已集成到主应用
- `docs/growth.html` - 静态 HTML，功能已集成到主应用
- `docs/profile.html` - 静态 HTML，功能已集成到主应用
- `docs/welcome-newuser.html` - 静态 HTML，已有对应 React 页面
- `docs/welcome.html` - 静态 HTML，已有对应 React 页面

### js/ 目录下的 JavaScript 文件
- `js/action_list.js` - 旧版 JS，已有 React 组件替代
- `js/chat.js` - 旧版 JS，已有 React 聊天页面
- `js/main.js` - 旧版 JS，功能已迁移到 React
- `js/momentum_tree.js` - 旧版 JS，已有 React 组件

### css/ 目录
- `css/style.css` - 旧版样式，已有 Tailwind + globals.css

## 第三部分：需要确认的页面文件

### app/ 目录下的页面
- `app/challenge-tasks/page.tsx` - 挑战任务页面，是否需要？
- `app/prd/page.tsx` - PRD 文档页面，是否需要？
- `app/prototypes/page.tsx` - 原型页面，是否需要？
- `app/welcome-newuser/page.tsx` - 新用户欢迎页，是否需要？
- `app/create-task/page.tsx` - 创建任务页面，是否需要？
- `app/history/page.tsx` - 历史记录页面，是否需要？
- `app/tutorials/[slug]/page.tsx` - 教程页面，是否需要？
- `app/about/page.tsx` - 关于页面，是否需要？
- `app/todolist/page.tsx` - 待办列表页面，是否需要？

### 其他文件
- `public/prd.md` - PRD 文档，如果 app/prd/page.tsx 删除则可删
- `public/tutorials/` 下的 markdown 文件 - 如果教程页面删除则可删
- `public/logo2` - 似乎是重复的 logo 文件
- `app/loading.tsx` - 全局加载页面，是否需要？
- `app/chat/loading.tsx` - 聊天加载页面，是否需要？

## 建议操作
1. 第二部分可以直接删除
2. 第三部分请告知哪些页面功能你需要保留
\`\`\`

现在修复 `@apply rounded-momentum-lg` 错误。让我检查可能还在使用自定义类的地方：

```typescriptreact file="app/globals.css"
[v0-no-op-code-block-prefix]/* Tailwind v4: use a single import */
@import "tailwindcss";
@import "tw-animate-css";

/* Momentum Design System Variables */
:root {
  --momentum-cream: #faf9f7;
  --momentum-white: #ffffff;
  --momentum-sage: #7a9b7b;
  --momentum-sage-light: #a8c4a9;
  --momentum-sage-dark: #5d7a5e;
  --momentum-forest: #2d4a2e;
  --momentum-coral: #f4a261;
  --momentum-coral-dark: #ef7a62;
  --momentum-muted: #6b7280;
  --momentum-border: #e5e7eb;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  /* optional: --font-sans, --font-serif, --font-mono if they are applied in the layout.tsx */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* 自定义工具类仍可通过 @layer utilities 扩展 */
@layer utilities {
  /* Background colors */
  .bg-momentum-cream {
    background-color: var(--momentum-cream);
  }
  .bg-momentum-white {
    background-color: var(--momentum-white);
  }
  .bg-momentum-sage {
    background-color: var(--momentum-sage);
  }
  .bg-momentum-sage-light {
    background-color: var(--momentum-sage-light);
  }
  .bg-momentum-sage-dark {
    background-color: var(--momentum-sage-dark);
  }
  .bg-momentum-forest {
    background-color: var(--momentum-forest);
  }
  .bg-momentum-coral {
    background-color: var(--momentum-coral);
  }
  .bg-momentum-coral-dark {
    background-color: var(--momentum-coral-dark);
  }

  /* Background with opacity */
  .bg-momentum-sage-light-20 {
    background-color: rgba(168, 196, 169, 0.2);
  }
  .bg-momentum-sage-light-30 {
    background-color: rgba(168, 196, 169, 0.3);
  }
  .bg-momentum-coral-10 {
    background-color: rgba(244, 162, 97, 0.1);
  }

  /* Text colors */
  .text-momentum-cream {
    color: var(--momentum-cream);
  }
  .text-momentum-white {
    color: var(--momentum-white);
  }
  .text-momentum-sage {
    color: var(--momentum-sage);
  }
  .text-momentum-sage-light {
    color: var(--momentum-sage-light);
  }
  .text-momentum-sage-dark {
    color: var(--momentum-sage-dark);
  }
  .text-momentum-forest {
    color: var(--momentum-forest);
  }
  .text-momentum-coral {
    color: var(--momentum-coral);
  }
  .text-momentum-muted {
    color: var(--momentum-muted);
  }

  /* Border colors */
  .border-momentum-sage {
    border-color: var(--momentum-sage);
  }
  .border-momentum-sage-light {
    border-color: var(--momentum-sage-light);
  }
  .border-momentum-sage-light-20 {
    border-color: rgba(168, 196, 169, 0.2);
  }
  .border-momentum-sage-light-30 {
    border-color: rgba(168, 196, 169, 0.3);
  }
  .border-momentum-coral {
    border-color: var(--momentum-coral);
  }
  .border-momentum-border {
    border-color: var(--momentum-border);
  }

  /* Radius */
  .rounded-momentum-lg {
    border-radius: 12px;
  }
  .rounded-momentum-xl {
    border-radius: 16px;
  }

  /* Shadows */
  .shadow-momentum-soft {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .shadow-momentum-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Card */
  .momentum-card {
    @apply bg-white p-4 shadow-sm border;
    border-radius: 12px;
    border-color: rgba(168, 196, 169, 0.2);
  }

  /* Buttons */
  .momentum-button-primary {
    /* 仅应用 Tailwind 内置工具类 */
    @apply font-medium transition-colors text-white;

    /* 自定义圆角与阴影用原生 CSS 实现，避免 @apply 自定义类 */
    border-radius: 12px;
    background-color: var(--momentum-coral);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 原 shadow-momentum-soft 的等效阴影 */
  }

  .momentum-button-primary:hover {
    background-color: var(--momentum-coral-dark);
  }

  .momentum-button-secondary {
    @apply font-medium transition-colors;
    border-radius: 12px;
    color: var(--momentum-sage-dark);
    background-color: rgba(168, 196, 169, 0.2);
  }
  .momentum-button-secondary:hover {
    background-color: rgba(168, 196, 169, 0.3);
  }

  /* Quick select card */
  .quick-select-card {
    @apply bg-white border p-4 cursor-pointer transition-all duration-200;
    border-radius: 16px;
    border-color: rgba(168, 196, 169, 0.2);
  }
  .quick-select-card:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-color: rgba(168, 196, 169, 0.3);
    background-color: rgba(244, 162, 97, 0.1);
    transform: translateY(-2px);
  }

  .quick-select-icon {
    @apply w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm;
  }

  /* Animation */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
}

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Base styles */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--momentum-sage-light);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--momentum-sage);
}

/* Focus */
*:focus {
  outline: none;
}
*:focus-visible {
  outline: 2px solid var(--momentum-coral);
  outline-offset: 2px;
}
