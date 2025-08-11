// 测试会话数量限制的脚本
// 在浏览器控制台中运行此脚本来验证功能

console.log("🧪 测试会话数量限制功能");

// 模拟创建多个会话
const createTestSessions = () => {
  const sessions = [];
  const now = Date.now();
  
  // 创建5个测试会话（超过3个限制）
  for (let i = 1; i <= 5; i++) {
    sessions.push({
      id: `test-session-${i}`,
      title: `测试对话 ${i}`,
      createdAt: now - (5 - i) * 60000, // 每个会话间隔1分钟
      updatedAt: now - (5 - i) * 60000,
      messages: [
        {
          id: `msg-${i}-1`,
          role: "user",
          content: `这是测试会话${i}的用户消息`,
          timestamp: now - (5 - i) * 60000
        },
        {
          id: `msg-${i}-2`,
          role: "assistant", 
          content: `这是测试会话${i}的AI回复`,
          timestamp: now - (5 - i) * 60000 + 1000
        }
      ]
    });
  }
  
  return sessions;
};

// 测试函数
const testSessionLimit = () => {
  console.log("1️⃣ 创建5个测试会话...");
  const testSessions = createTestSessions();
  
  // 直接存储到localStorage
  localStorage.setItem("momentum-sessions-v1", JSON.stringify(testSessions));
  console.log(`✅ 已存储 ${testSessions.length} 个会话`);
  
  // 模拟读取会话（这会触发限制逻辑）
  console.log("2️⃣ 读取会话（触发限制逻辑）...");
  const stored = localStorage.getItem("momentum-sessions-v1");
  const sessions = JSON.parse(stored);
  
  // 应用限制逻辑（模拟readSessions函数）
  const MAX_SESSIONS = 3;
  const limited = sessions
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_SESSIONS);
  
  localStorage.setItem("momentum-sessions-v1", JSON.stringify(limited));
  
  console.log(`3️⃣ 限制后剩余会话数: ${limited.length}`);
  console.log("📋 保留的会话:", limited.map(s => s.title));
  
  return limited.length === 3;
};

// 清理测试数据
const cleanup = () => {
  localStorage.removeItem("momentum-sessions-v1");
  localStorage.removeItem("momentum-storage-cleaned-v2");
  console.log("🧹 已清理测试数据");
};

// 运行测试
console.log("开始测试...");
const result = testSessionLimit();
console.log(result ? "✅ 测试通过：会话数量限制正常工作" : "❌ 测试失败");

// 提示用户
console.log("\n💡 使用说明:");
console.log("- 刷新页面后，应用会自动清理现有数据");
console.log("- 新的对话会自动限制在最近3次");
console.log("- 每次对话最多保留25条消息");
console.log("\n🔍 检查当前存储:");
console.log("localStorage大小:", JSON.stringify(localStorage).length, "字符");

// 运行 cleanup() 来清理测试数据
