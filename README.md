# 🤖 小包包 (XiaoBaoBao)

豆包风格的AI对话框组件，基于 React + TypeScript 开发，支持 **流式响应** 和 Markdown 格式显示。

## ✨ 新增特性

### 🚀 流式响应
- **实时显示**：不再等待所有结果，实时流式显示 AI 回复
- **更好体验**：AI 回复逐字显示，对话更加自然流畅
- **停止控制**：可以随时中止正在生成的回复
- **智能备用**：自动检测流式支持，失败时自动降级到非流式模式

### 🛠️ 技术优化
- **Fetch API**：使用原生 Fetch API 处理 SSE 流式响应
- **内存管理**：优化流式数据处理，避免内存泄漏
- **错误处理**：完善的错误处理和重试机制
- **状态管理**：实时连接状态监控和显示

### 🎨 UI/UX 改进
- **流式指示器**：实时显示生成状态和进度
- **停止按钮**：可视化的停止生成控制
- **连接状态**：直观的连接状态指示器
- **自然动画**：流畅的打字动画效果

## 📦 功能特性

### 原有功能
- 🎯 **豆包风格设计** - 精美的UI界面和交互体验
- 📝 **Markdown支持** - 完整的Markdown语法支持，包括代码高亮
- 🔄 **GraphQL集成** - 支持GraphQL API调用
- 💬 **智能对话** - 基于AI的智能对话功能
- 🎨 **响应式设计** - 完美适配各种屏幕尺寸
- ⚡ **高性能** - 基于React 18和TypeScript的现代化开发

### 新增功能
- 🌊 **流式响应** - 实时流式显示AI回复内容
- ⏹️ **停止生成功能** - 支持中途停止AI内容生成
- 🔄 **智能降级机制** - 流式失败时自动使用传统模式
- 📊 **状态监控** - 实时显示连接和生成状态
- 🎭 **自然动画** - 模拟真实打字的自然显示效果
- 🛠️ **StreamingChatHandler** - 新的流式处理核心类
- 🎯 **ChatModeSelector** - 模式选择演示组件
- 📱 **响应式设计优化** - 更好的移动端体验

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: React Hooks (useState, useRef, useEffect)
- **样式方案**: Tailwind CSS
- **图标系统**: Lucide React
- **Markdown**: React Markdown + remark-gfm + rehype-highlight
- **API通信**: 
  - GraphQL (Apollo Client) - 传统模式
  - Fetch API + SSE - 流式模式
- **构建工具**: Vite
- **代码质量**: ESLint + TypeScript

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

### 构建项目

```bash
npm run build
# 或
yarn build
```

### 部署到GitHub Pages

```bash
npm run deploy
# 或
yarn deploy
```

## 📖 使用方法

### 基础使用

```tsx
import { XiaoBaoBaoStreamingChat } from 'xiao-bao-bao';

function App() {
  return (
    <div>
      <XiaoBaoBaoStreamingChat />
    </div>
  );
}
```

### 自定义配置

```tsx
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

// 创建自定义配置的流式处理器
const customHandler = new StreamingChatHandler({
  endpoint: 'https://ai-admin.juzhiqiang.shop/v1/chat/completions',
  model: 'your-model',
  temperature: 0.7,
  maxTokens: 2000
});
```

## 🔧 配置选项

### StreamingConfig

```typescript
interface StreamingConfig {
  endpoint: string;      // API端点地址
  apiKey?: string;       // API密钥(可选)
  model?: string;        // 使用的模型
  temperature?: number;  // 温度参数
  maxTokens?: number;    // 最大token数
  topP?: number;         // Top-p参数
}
```

### 默认配置

```typescript
const DEFAULT_CONFIG = {
  endpoint: 'https://ai-admin.juzhiqiang.shop/v1/chat/completions',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9
};
```

## 🎯 核心特性详解

### 1. 流式响应处理

```typescript
// 开始流式对话
await streamingHandler.streamChat(
  messages,
  (chunk) => {
    // 处理每个数据块
    console.log('收到数据块:', chunk);
  },
  () => {
    // 完成回调
    console.log('生成完成');
  },
  (error) => {
    // 错误处理
    console.error('生成错误:', error);
  }
);
```

### 2. 智能备用机制

```typescript
// 检测流式支持
const isSupported = await StreamingChatHandler.checkStreamingSupport(endpoint);

if (isSupported) {
  // 使用流式模式
  await handler.streamChat(...);
} else {
  // 降级到传统模式
  await handler.fallbackRequest(...);
}
```

### 3. 自然打字效果

```typescript
// 模拟自然打字效果
simulateNaturalTyping(
  text,
  (chunk) => updateUI(chunk),
  () => onComplete(),
  50 // 基础延迟
);
```

## 🎨 UI组件说明

### 主要组件

1. **XiaoBaoBaoStreamingChat** - 新的流式聊天组件
2. **XiaoBaoBaoChat** - 原版GraphQL聊天组件
3. **StreamingChatHandler** - 流式响应处理器

### 状态指示器

- 🟢 绿色闪烁：流式API已连接
- 🟡 黄色闪烁：正在连接中
- 🔴 红色：连接失败

### 交互控制

- **发送按钮**：发送消息或停止生成
- **重新生成**：重新生成AI回复
- **复制按钮**：复制消息内容
- **快捷操作**：预设的常用问题

## 📊 性能优化

### 内存管理
- 使用 `AbortController` 控制请求生命周期
- 及时释放 `ReadableStream` 资源
- 优化大量文本的渲染性能

### 网络优化
- 智能重连机制
- 断线重连和错误恢复
- 支持请求取消和重试

### 用户体验
- 流畅的动画过渡
- 实时状态反馈
- 智能错误提示

## 🐛 常见问题

### Q: 流式响应不工作怎么办？
A: 检查API端点是否支持SSE格式，组件会自动降级到传统模式。

### Q: 如何自定义API端点？
A: 修改 `StreamingChatHandler` 的配置或直接修改 `streaming.ts` 中的默认配置。

### Q: 如何处理认证？
A: 在 `StreamingConfig` 中设置 `apiKey` 参数。

### Q: 支持哪些AI模型？
A: 目前主要支持兼容OpenAI格式的API，可以通过配置使用其他兼容的API。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/streaming-response`)
3. 提交更改 (`git commit -am 'Add streaming response feature'`)
4. 推送到分支 (`git push origin feature/streaming-response`)
5. 创建 Pull Request

## 📄 更新日志

### v2.0.0 (2025-01-XX)
- ✨ 新增流式响应支持
- ⚡ 优化性能和用户体验
- 🛠️ 改进错误处理机制
- 🎨 更新UI设计和动画
- 📚 完善文档和示例

### v1.0.0 (2024-XX-XX)
- 🎉 初始版本发布
- 🤖 基础AI对话功能
- 📝 Markdown支持
- 🔄 GraphQL集成

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [在线演示](https://juzhiqiang.github.io/xiao-bao-bao)
- [GitHub仓库](https://github.com/juzhiqiang/xiao-bao-bao)
- [API接口文档](https://ai-admin.juzhiqiang.shop)
- [React文档](https://react.dev/)
- [TypeScript文档](https://www.typescriptlang.org/)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**享受流畅的AI对话体验！** 🚀✨