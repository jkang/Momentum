// 简单测试记忆功能
// 在浏览器控制台中运行

// 模拟 localStorage
if (typeof window === 'undefined') {
  global.window = {
    localStorage: {
      data: {},
      getItem(key) { return this.data[key] || null; },
      setItem(key, value) { this.data[key] = value; },
      removeItem(key) { delete this.data[key]; }
    }
  };
}

// 导入记忆模块（需要在浏览器环境中测试）
console.log('测试记忆功能...');

// 测试1: 添加拖延原因
console.log('1. 测试添加拖延原因');
const reasons = ['我总是觉得任务太难了', '完美主义让我不敢开始', '害怕做不好'];
// Memory.addReasons(reasons);

// 测试2: 添加行动承诺
console.log('2. 测试添加行动承诺');
const steps = ['每天写作15分钟', '先完成大纲', '设置番茄钟专注'];
// Memory.addCommitment(steps);

// 测试3: 检索记忆
console.log('3. 测试记忆检索');
const query = '我又开始拖延了，不知道怎么开始';
// const preface = Memory.buildPreface(query);
// console.log('记忆前缀:', preface);

// 测试4: 查看所有记忆
console.log('4. 查看所有记忆');
// const allMemories = Memory.getAll();
// console.log('所有记忆:', allMemories);

console.log('请在浏览器环境中运行实际测试');
console.log('示例代码:');
console.log(`
// 在浏览器控制台中运行:
import { Memory } from '/lib/memory.js';

// 添加记忆
Memory.addReasons(['我总是觉得任务太难了']);
Memory.addCommitment(['每天写作15分钟', '先完成大纲']);

// 检索记忆
const preface = Memory.buildPreface('我又开始拖延了');
console.log(preface);

// 查看所有记忆
console.log(Memory.getAll());
`);
