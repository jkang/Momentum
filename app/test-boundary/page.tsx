"use client"

import { useState } from "react"

export default function TestBoundaryPage() {
  const [testMessage, setTestMessage] = useState("")
  const [result, setResult] = useState("")

  const testBoundaryDetection = async () => {
    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            { role: "user", content: testMessage }
          ] 
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No body")

      let fullResponse = ""
      const decoder = new TextDecoder()
      let buf = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() || ""
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullResponse += parsed.content
              }
            } catch {}
          }
        }
      }

      setResult(fullResponse)
    } catch (error) {
      setResult(`错误: ${error}`)
    }
  }

  const testCases = [
    "我想聊聊美食",
    "今天天气真好",
    "推荐个好看的电影",
    "我论文写不下去了",
    "总是拖延怎么办",
    "不想做作业"
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">边界检测测试</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">测试消息:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="输入要测试的消息..."
          />
        </div>
        
        <button
          onClick={testBoundaryDetection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          测试
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => setTestMessage(testCase)}
              className="p-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              {testCase}
            </button>
          ))}
        </div>
        
        {result && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">AI回复:</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
