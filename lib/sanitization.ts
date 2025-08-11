/**
 * 文本清洗与安全过滤工具
 * 用于防止 Prompt Injection 攻击，统一处理聊天输入和待办粘贴文本
 */

// 长度限制常量
export const MAX_CHAT_INPUT_CHARS = 500
export const MAX_TODO_PASTE_CHARS = 500
export const MAX_LINES = 200

// 清洗结果接口
export interface SanitizationResult {
  clean: string
  truncated: boolean
  removedPatterns: string[]
}

/**
 * 移除代码片段和反引号内容
 */
function removeCodeBlocks(text: string): { text: string; removed: string[] } {
  const removed: string[] = []
  
  // 移除 fenced code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    removed.push('代码块')
    return ''
  })
  
  // 移除行内反引号内容 (`...`)
  text = text.replace(/`[^`\n]*`/g, (match) => {
    removed.push('行内代码')
    return ''
  })
  
  return { text, removed }
}

/**
 * 移除角色标记和指令性内容
 */
function removeRoleMarkers(text: string): { text: string; removed: string[] } {
  const removed: string[] = []
  const lines = text.split('\n')
  const cleanLines: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase()
    
    // 检查是否为角色标记行
    const rolePatterns = [
      /^(system|assistant|user|角色|role)\s*[:：]/,
      /^<\s*(system|assistant|user)\s*>/,
      /^【\s*(系统|助手|用户)\s*】/
    ]
    
    const isRoleLine = rolePatterns.some(pattern => pattern.test(trimmed))
    
    if (isRoleLine) {
      removed.push('角色标记')
      continue
    }
    
    cleanLines.push(line)
  }
  
  return { text: cleanLines.join('\n'), removed }
}

/**
 * 移除常见的注入短语
 */
function removeInjectionPhrases(text: string): { text: string; removed: string[] } {
  const removed: string[] = []
  
  const injectionPatterns = [
    // 中文注入短语
    /忽略\s*[以之前上述]*\s*[所有的]*\s*[指令规则]/gi,
    /覆盖\s*[之前的]*\s*[规则指令]/gi,
    /你\s*现在\s*是\s*[^。，,.\n]*/gi,
    /你\s*不再\s*是\s*[^。，,.\n]*/gi,
    /重新\s*定义\s*[你的]*\s*[角色身份]/gi,
    
    // 英文注入短语
    /ignore\s+(previous|all|above)\s+(instructions?|rules?|prompts?)/gi,
    /override\s+(previous|all)\s+(instructions?|rules?)/gi,
    /you\s+are\s+now\s+[^.。,，\n]*/gi,
    /as\s+(system|assistant|chatgpt|gpt)/gi,
    /forget\s+(everything|all)\s+(above|previous)/gi
  ]
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      removed.push('注入短语')
      text = text.replace(pattern, '')
    }
  }
  
  return { text, removed }
}

/**
 * 处理链接和 HTML
 */
function processLinksAndHtml(text: string): { text: string; removed: string[] } {
  const removed: string[] = []
  
  // 移除 HTML 标签
  if (/<[^>]+>/.test(text)) {
    removed.push('HTML标签')
    text = text.replace(/<[^>]*>/g, '')
  }
  
  // 处理 Markdown 链接 [文案](url) -> 文案
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, (match, linkText) => {
    if (match !== linkText) {
      removed.push('链接URL')
    }
    return linkText || '[链接]'
  })
  
  // 处理裸露的 URL
  const urlPattern = /https?:\/\/[^\s\u4e00-\u9fff]+/g
  if (urlPattern.test(text)) {
    removed.push('URL链接')
    text = text.replace(urlPattern, '[链接]')
  }
  
  return { text, removed }
}

/**
 * 清理异常字符和格式化
 */
function cleanCharacters(text: string): { text: string; removed: string[] } {
  const removed: string[] = []
  
  // 移除零宽字符和控制字符（保留常见的空白字符）
  const beforeLength = text.length
  text = text.replace(/[\u200B-\u200D\uFEFF\u00AD\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  
  if (text.length < beforeLength) {
    removed.push('异常字符')
  }
  
  // 合并多个空白字符为单个空格
  text = text.replace(/[ \t]+/g, ' ')
  
  // 合并多个换行为最多两个换行
  text = text.replace(/\n{3,}/g, '\n\n')
  
  // 清理首尾空白
  text = text.trim()
  
  return { text, removed }
}

/**
 * 限制行数
 */
function limitLines(text: string, maxLines: number): { text: string; truncated: boolean } {
  const lines = text.split('\n')
  if (lines.length <= maxLines) {
    return { text, truncated: false }
  }
  
  return {
    text: lines.slice(0, maxLines).join('\n'),
    truncated: true
  }
}

/**
 * 限制字符数
 */
function limitCharacters(text: string, maxChars: number): { text: string; truncated: boolean } {
  if (text.length <= maxChars) {
    return { text, truncated: false }
  }
  
  return {
    text: text.slice(0, maxChars),
    truncated: true
  }
}

/**
 * 通用文本清洗函数
 */
function sanitizeText(text: string, maxChars: number): SanitizationResult {
  if (!text || typeof text !== 'string') {
    return { clean: '', truncated: false, removedPatterns: [] }
  }
  
  let cleanText = text
  const allRemoved: string[] = []
  let wasTruncated = false
  
  // 1. 移除代码片段
  const codeResult = removeCodeBlocks(cleanText)
  cleanText = codeResult.text
  allRemoved.push(...codeResult.removed)
  
  // 2. 移除角色标记
  const roleResult = removeRoleMarkers(cleanText)
  cleanText = roleResult.text
  allRemoved.push(...roleResult.removed)
  
  // 3. 移除注入短语
  const injectionResult = removeInjectionPhrases(cleanText)
  cleanText = injectionResult.text
  allRemoved.push(...injectionResult.removed)
  
  // 4. 处理链接和 HTML
  const linkResult = processLinksAndHtml(cleanText)
  cleanText = linkResult.text
  allRemoved.push(...linkResult.removed)
  
  // 5. 清理异常字符
  const charResult = cleanCharacters(cleanText)
  cleanText = charResult.text
  allRemoved.push(...charResult.removed)
  
  // 6. 限制行数
  const lineResult = limitLines(cleanText, MAX_LINES)
  cleanText = lineResult.text
  if (lineResult.truncated) {
    wasTruncated = true
    allRemoved.push('超出行数限制')
  }
  
  // 7. 限制字符数
  const charLimitResult = limitCharacters(cleanText, maxChars)
  cleanText = charLimitResult.text
  if (charLimitResult.truncated) {
    wasTruncated = true
    allRemoved.push('超出字符限制')
  }
  
  // 去重移除的模式
  const uniqueRemoved = Array.from(new Set(allRemoved))
  
  return {
    clean: cleanText,
    truncated: wasTruncated,
    removedPatterns: uniqueRemoved
  }
}

/**
 * 清洗聊天输入文本
 */
export function sanitizeChatText(text: string): SanitizationResult {
  return sanitizeText(text, MAX_CHAT_INPUT_CHARS)
}

/**
 * 清洗待办粘贴文本
 */
export function sanitizeTodoText(text: string): SanitizationResult {
  return sanitizeText(text, MAX_TODO_PASTE_CHARS)
}
