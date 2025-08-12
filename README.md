# 🤖 小包包 - 豆包风格的AI对话框组件

> React + TypeScript + 流式响应 + 合同审核功能

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-blue.svg)](https://tailwindcss.com/)

一个现代化的AI对话界面组件，支持流式响应和专业的合同审核功能。基于豆包的设计风格，提供流畅的用户体验。

## ✨ 特性

### 🎯 核心功能
- **流式响应** - 实时显示AI回复内容
- **GraphQL集成** - 支持DeepSeek GraphQL API
- **合同审核** - 专业的合同合规性分析
- **Markdown支持** - 完整的markdown渲染和代码高亮
- **响应式设计** - 适配各种屏幕尺寸
- **现代UI** - 基于Tailwind CSS的精美界面

### 📋 合同审核功能 (NEW!)
- **多格式支持** - 支持文本、PDF、Word文档上传
- **专业分析** - 基于Mastra Agent的智能合规性检查
- **风险评估** - 识别潜在的法律风险点
- **实时建议** - 提供具体的改进建议
- **流式审核** - 实时显示审核进度和结果

### 🛡️ 审核重点领域
- 数据安全与隐私保护
- 知识产权保护
- 服务等级协议(SLA)
- 责任限制与赔偿
- 技术规范要求
- 用户体验标准

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量配置文件：
```bash
cp .env.example .env
```

2. 配置环境变量：
```env
# Mastra API Configuration
VITE_MASTRA_API_URL=http://localhost:4111

# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# GraphQL API Configuration
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
```

### 启动Mastra服务

在使用合同审核功能前，需要启动Mastra服务：

```bash
# 克隆recodeAgent项目
git clone https://github.com/juzhiqiang/recodeAgent.git
cd recodeAgent

# 安装依赖
npm install

# 配置环境变量
echo "DEEPSEEK_API_KEY=your_deepseek_api_key_here" > .env

# 启动Mastra开发服务器
npm run dev
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

## 📖 使用指南

### 基础对话
1. 在主页面输入问题
2. 查看AI实时流式回复
3. 支持代码高亮、表格等Markdown格式

### 合同审核
1. 点击右上角"合同审核"按钮
2. 选择审核方式：
   - 直接粘贴合同文本
   - 上传合同文件(.txt, .pdf, .doc, .docx)
3. 选择合同类型（可选）
4. 获取专业的合规性分析报告

### 快速操作
- 使用首页的快速操作按钮
- 支持代码生成、技术解释等场景
- 一键进入合同审核模式

## 🏗️ 项目结构

```
src/
├── components/
│   ├── XiaoBaoBaoStreamingChat.tsx    # 主对话界面
│   ├── ContractReviewChat.tsx         # 合同审核界面
│   └── index.ts                       # 组件导出
├── lib/
│   ├── streaming.ts                   # 流式响应处理
│   ├── graphql.ts                     # GraphQL相关
│   └── mastraClient.ts                # Mastra客户端 (NEW!)
├── App.tsx                            # 路由配置
└── main.tsx                          # 应用入口
```

## 🔧 技术栈

### 前端框架
- **React 18** - 现代化React框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **React Router** - 客户端路由

### UI & 样式
- **Tailwind CSS** - 原子化CSS框架
- **Lucide React** - 现代图标库
- **React Markdown** - Markdown渲染
- **Rehype Highlight** - 代码语法高亮

### AI集成
- **GraphQL** - DeepSeek API集成
- **Mastra Client** - 合同审核Agent客户端
- **Apollo Client** - GraphQL客户端

## 📊 API集成

### DeepSeek GraphQL API
```typescript
const GRAPHQL_ENDPOINT = 'https://ai-admin.juzhiqiang.shop';
```

### Mastra Contract Review Agent
```typescript
import { contractReviewClient } from './lib/mastraClient';

// 审核合同
const result = await contractReviewClient.reviewContract(
  contractContent,
  contractType
);

// 流式审核
await contractReviewClient.reviewContractStream(
  contractContent,
  contractType,
  onChunk,
  onComplete,
  onError
);
```

## 🚢 部署

### 构建生产版本
```bash
npm run build
```

### GitHub Pages部署
```bash
npm run deploy
```

### Cloudflare Workers部署
```bash
npm run build:cloudflare
```

## 🔒 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `VITE_MASTRA_API_URL` | Mastra API地址 | `http://localhost:4111` |
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | - |
| `VITE_GRAPHQL_ENDPOINT` | GraphQL端点 | `https://ai-admin.juzhiqiang.shop` |

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v2.0.0 (2025-08-12)
- 🎉 新增合同审核功能
- 🔗 集成Mastra Agent客户端
- 📁 支持多种文件格式上传
- 🛡️ 专业合规性分析
- 🎨 全新合同审核界面
- ⚡ 流式合同审核体验
- 🧭 添加路由导航系统

### v1.x.x
- GraphQL流式响应
- Markdown渲染支持
- 代码语法高亮
- 响应式界面设计

## 📄 许可证

基于 [MIT](https://choosealicense.com/licenses/mit/) 许可证开源。

## 👥 作者

**juzhiqiang** - [GitHub](https://github.com/juzhiqiang)

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Mastra](https://github.com/mastra-ai/mastra) - AI Agent框架
- [DeepSeek](https://www.deepseek.com/) - AI模型服务
- [Vite](https://vitejs.dev/) - 构建工具

---

<p align="center">Made with ❤️ by <a href="https://github.com/juzhiqiang">juzhiqiang</a></p>
