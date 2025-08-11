'use client'

import { useState } from 'react'
import { Memory } from '@/lib/memory'
import { extractReasonsFromText, extractCommitStepsFromAi } from '@/lib/memory-extract'
import { shouldSummarize, buildSummarySystem } from '@/lib/memory-summarize'

export default function TestMemoryPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [userInput, setUserInput] = useState('我总是觉得任务太难了，完美主义让我不敢开始')
  const [aiResponse, setAiResponse] = useState(`好的，我理解你的困扰。让我们把这个大任务拆解成几个小步骤：

1. 先花5分钟列出任务的基本要求
2. 选择其中最简单的一个部分开始
3. 设置25分钟专注时间
4. 完成后奖励自己休息5分钟

你想【开始第一步】还是【先聊聊原因】？`)

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
  }

  const testMemoryExtraction = () => {
    addResult('=== 测试记忆提取 ===')
    
    // 测试从用户输入提取原因
    const reasons = extractReasonsFromText(userInput)
    addResult(`从用户输入提取的原因: ${JSON.stringify(reasons)}`)
    
    // 测试从AI回复提取步骤
    const steps = extractCommitStepsFromAi(aiResponse)
    addResult(`从AI回复提取的步骤: ${JSON.stringify(steps)}`)
    
    // 保存到记忆
    if (reasons.length > 0) {
      Memory.addReasons(reasons)
      addResult('✅ 原因已保存到记忆')
    }
    
    if (steps.length > 0) {
      Memory.addCommitment(steps)
      addResult('✅ 步骤已保存到记忆')
    }
  }

  const testMemoryRetrieval = () => {
    addResult('=== 测试记忆检索 ===')
    
    const query = '我又开始拖延了，不知道怎么开始'
    const preface = Memory.buildPreface(query)
    addResult(`查询: "${query}"`)
    addResult(`记忆前缀: ${preface || '无相关记忆'}`)
  }

  const testMemoryStorage = () => {
    addResult('=== 测试记忆存储 ===')
    
    const allMemories = Memory.getAll()
    addResult(`总记忆条数: ${allMemories.length}`)
    
    allMemories.forEach((memory, index) => {
      addResult(`${index + 1}. [${memory.kind}] ${memory.text}`)
    })
  }

  const testSummarization = () => {
    addResult('=== 测试对话摘要 ===')
    
    // 创建模拟的长对话
    const longMessages = Array.from({ length: 35 }, (_, i) => ({
      id: `msg_${i}`,
      role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
      content: i % 2 === 0 ? `用户消息 ${i}: 我遇到了拖延问题` : `助手回复 ${i}: 让我们来解决这个问题`,
      timestamp: Date.now() + i * 1000
    }))
    
    const shouldSum = shouldSummarize(longMessages)
    addResult(`是否需要摘要 (${longMessages.length}条消息): ${shouldSum}`)
    
    if (shouldSum) {
      const summary = buildSummarySystem(longMessages.slice(0, -10))
      addResult(`摘要内容: ${summary.content}`)
    }
  }

  const clearMemory = () => {
    Memory.clearAll()
    addResult('🗑️ 所有记忆已清空')
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-momentum-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-momentum-forest mb-8">记忆功能测试</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-momentum-forest mb-2">
                模拟用户输入:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 border border-momentum-sage-light-20 rounded-lg"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-momentum-forest mb-2">
                模拟AI回复:
              </label>
              <textarea
                value={aiResponse}
                onChange={(e) => setAiResponse(e.target.value)}
                className="w-full p-3 border border-momentum-sage-light-20 rounded-lg"
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <button
                onClick={testMemoryExtraction}
                className="w-full bg-momentum-coral text-white px-4 py-2 rounded-lg hover:bg-momentum-coral-dark"
              >
                测试记忆提取
              </button>
              
              <button
                onClick={testMemoryRetrieval}
                className="w-full bg-momentum-sage text-white px-4 py-2 rounded-lg hover:bg-momentum-sage-dark"
              >
                测试记忆检索
              </button>
              
              <button
                onClick={testMemoryStorage}
                className="w-full bg-momentum-forest text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                查看记忆存储
              </button>
              
              <button
                onClick={testSummarization}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                测试对话摘要
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={clearMemory}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  清空记忆
                </button>
                
                <button
                  onClick={clearResults}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  清空结果
                </button>
              </div>
            </div>
          </div>
          
          {/* 结果区域 */}
          <div>
            <h2 className="text-lg font-semibold text-momentum-forest mb-4">测试结果:</h2>
            <div className="bg-white border border-momentum-sage-light-20 rounded-lg p-4 h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">点击测试按钮查看结果...</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm">
                      {result.startsWith('===') ? (
                        <div className="font-bold text-momentum-forest border-b border-momentum-sage-light-20 pb-1 mb-2">
                          {result}
                        </div>
                      ) : result.startsWith('✅') || result.startsWith('🗑️') ? (
                        <div className="text-green-600">{result}</div>
                      ) : (
                        <div className="text-gray-700">{result}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
