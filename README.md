# 小包包 (XiaoBaoBao)

🤖 豆包风格的AI对话框组件 (React + TypeScript) 支持流式响应与合同审核

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/juzhiqiang/xiao-bao-bao)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)

## ✨ 特性

### 🎯 核心功能
- **流式响应** - 基于 GraphQL 的实时流式对话体验
- **智能问答** - 支持各种类型的问题和任务
- **代码编程** - 代码生成、解释和调试
- **创意写作** - 文章、故事、诗歌等创意内容生成
- **学习指导** - 知识讲解和学习辅助

### 📋 合同审核 (v2.1 升级！)
- **专业审核** - 基于官方 @mastra/client-js 的智能合同审核
- **合规检查** - 法律法规和行业标准合规性检查
- **风险评估** - 识别潜在风险点和法律漏洞
- **改进建议** - 提供具体的修改建议和解决方案
- **文件支持** - 支持 PDF、Word、文本文件上传
- **流式响应** - 实时流式审核结果展示
- **HTTPS安全** - 全程加密通信保障数据安全

### 🎨 界面特性
- **现代化设计** - 豆包风格的美观界面
- **响应式布局** - 适配各种设备屏幕
- **流畅动画** - 精美的过渡动画和交互效果
- **深色模式** - 支持浅色/深色主题切换
- **Markdown 支持** - 完整的 Markdown 渲染和代码高亮

### 🔧 技术特性
- **TypeScript** - 完整的类型安全
- **React 18** - 最新的 React 特性
- **Vite** - 快速的开发和构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **GraphQL** - 高效的数据查询
- **@mastra/client-js** - 官方 Mastra 客户端集成

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装

```bash
# 克隆项目
git clone https://github.com/juzhiqiang/xiao-bao-bao.git
cd xiao-bao-bao

# 安装依赖
npm install
# 或
yarn install
```

### 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

必要的环境变量：
```env
# Mastra API 配置（用于合同审核功能） - 已升级！
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop

# GraphQL API 配置
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 📖 使用指南

### 基本对话
1. 在输入框中输入你的问题
2. 按 Enter 发送消息
3. 观察 AI 的实时流式响应

### 合同审核功能
1. 点击右上角的 "合同审核" 按钮
2. 选择合同类型（可选）
3. 粘贴合同文本或上传合同文件
4. 获得专业的合规性分析报告

详细使用说明请参考：[合同审核功能文档](./docs/CONTRACT_REVIEW.md)

## 🆕 v2.1 升级亮点

### Mastra 客户端升级
- ✅ **官方库集成**: 替换为 `@mastra/client-js`
- ✅ **HTTPS 安全**: 服务端点升级为 `https://agent.juzhiqiang.shop`
- ✅ **真实 API**: 使用真正的 Mastra workflows API
- ✅ **流式增强**: 支持真正的流式数据传输
- ✅ **连接监控**: 实时连接状态检查
- ✅ **向后兼容**: 所有现有接口保持不变

查看详细升级指南：[Mastra 升级文档](./docs/MASTRA_UPGRADE.md)

## 🏗️ 项目结构

```
src/
├── components/
│   ├── XiaoBaoBaoStreamingChat.tsx    # 主聊天组件
│   ├── ContractReviewChat.tsx         # 合同审核组件
│   └── index.ts                       # 组件导出
├── lib/
│   ├── streaming.ts                   # 流式响应处理
│   ├── graphql.ts                     # GraphQL 相关
│   └── mastraClient.ts                # Mastra 客户端 (v2.1 升级)
├── docs/
│   ├── MASTRA_UPGRADE.md              # 升级指南
│   └── CONTRACT_REVIEW.md             # 合同审核文档
├── App.tsx                            # 路由配置
├── main.tsx                           # 应用入口
└── index.css                          # 全局样式
```

## 🔌 API 集成

### GraphQL API
本项目支持 GraphQL 流式查询，提供实时的对话体验。

### Mastra Agent API (v2.1 升级)
集成了官方 Mastra 客户端，基于以下技术栈：
- [@mastra/client-js](https://www.npmjs.com/package/@mastra/client-js) - 官方 Mastra 客户端
- [recodeAgent](https://github.com/juzhiqiang/recodeAgent) - 合同审核代理服务
- DeepSeek AI - 底层语言模型
- HTTPS 安全连接 - agent.juzhiqiang.shop

#### 主要 API 功能
```typescript
// 工作流执行
await mastraClient.workflows.run({
  workflowId: 'contract-review-workflow',
  input: { ... }
});

// 流式响应
await mastraClient.workflows.stream({
  workflowId: 'contract-review-workflow',
  onData: (chunk) => { ... },
  onComplete: () => { ... }
});

// 健康检查
await mastraClient.health.check();

// 代理列表
await mastraClient.agents.list();
```

## 🎨 自定义主题

项目使用 Tailwind CSS，你可以轻松自定义主题：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

## 📦 部署

### GitHub Pages

```bash
npm run deploy
```

### Cloudflare Pages

```bash
npm run build
```

然后将 `dist` 目录上传到 Cloudflare Pages。

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🛠️ 开发

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 部署到 GitHub Pages
npm run deploy
```

### Git 工作流

1. 从 `main` 分支创建功能分支
2. 在功能分支上开发新功能
3. 提交 Pull Request
4. 代码审查后合并到 `main`

## 🔄 从 v2.0 升级到 v2.1

如果你已经在使用 v2.0 版本，升级到 v2.1 非常简单：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖
npm install

# 3. 更新环境变量
# 将 .env 文件中的 VITE_MASTRA_API_URL 从 http://localhost:4111 
# 更新为 https://agent.juzhiqiang.shop

# 4. 启动应用
npm run dev
```

所有现有的 API 接口保持不变，无需修改任何代码！

详细升级指南：[MASTRA_UPGRADE.md](./docs/MASTRA_UPGRADE.md)

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 贡献指南

- 遵循现有的代码风格
- 添加适当的注释
- 更新相关文档
- 添加或更新测试（如果适用）

## 📝 更新日志

### v2.1.0 (2025-08-13)
- ✅ **重大升级**: 使用官方 `@mastra/client-js` 替换自定义实现
- ✅ **安全提升**: 服务端点升级至 HTTPS (agent.juzhiqiang.shop)
- ✅ **性能优化**: 真实 Mastra API 集成，移除 Mock 延迟
- ✅ **功能增强**: 新增连接检查、工作流历史等功能
- ✅ **环境配置**: 支持 `REACT_APP_MASTRA_BASE_URL` 环境变量
- ✅ **文档完善**: 新增升级指南和详细使用文档

### v2.0.0
- 🎉 **合同审核功能**: 基于 Mastra Agent 的智能合同审核
- 🎨 **界面优化**: 全新的豆包风格设计
- ⚡ **性能提升**: GraphQL 流式响应优化

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide React](https://lucide.dev/) - 图标库
- [Mastra](https://mastra.ai/) - AI Agent 框架
- [DeepSeek](https://www.deepseek.com/) - AI 模型服务

## 📞 联系

- 项目链接: [https://github.com/juzhiqiang/xiao-bao-bao](https://github.com/juzhiqiang/xiao-bao-bao)
- 在线演示: [https://juzhiqiang.github.io/xiao-bao-bao](https://juzhiqiang.github.io/xiao-bao-bao)
- 问题反馈: [Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues)
- 升级指南: [MASTRA_UPGRADE.md](./docs/MASTRA_UPGRADE.md)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
