# 小包包 (XiaoBaoBao)

🤖 豆包风格的AI对话框组件 (React + TypeScript) 支持流式响应、合同审核与旅游规划

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/juzhiqiang/xiao-bao-bao)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)

## ✨ 特性

### 🎯 核心功能
- **流式响应** - 基于 GraphQL 的实时流式对话体验
- **智能问答** - 支持各种类型的问题和任务
- **代码编程** - 代码生成、解释和调试
- **创意写作** - 文章、故事、诗歌等创意内容生成
- **学习指导** - 知识讲解和学习辅助

### 📋 合同审核功能
- **专业审核** - 基于官方 @mastra/client-js 的智能合同审核
- **合规检查** - 法律法规和行业标准合规性检查
- **风险评估** - 识别潜在风险点和法律漏洞
- **改进建议** - 提供具体的修改建议和解决方案
- **文件支持** - 支持 PDF、Word、文本文件上传
- **流式响应** - 实时流式审核结果展示
- **HTTPS安全** - 全程加密通信保障数据安全

### 🗺️ 旅游规划功能 (v2.2 新增！)
- **智能路线规划** - 根据地理位置优化旅行路线
- **个性化推荐** - 支持经济型、舒适型、奢华型三种旅行风格
- **详细行程安排** - 提供逐日行程和景点推荐
- **预算估算** - 根据旅行风格智能估算费用
- **实用建议** - 提供旅行贴士和注意事项
- **全球目的地** - 支持全球主要旅游城市
- **自然语言交互** - 通过对话方式规划旅行
- **完整调试功能** - 内置连接测试和故障排除工具

### 🎨 界面特性
- **现代化设计** - 豆包风格的美观界面
- **模块化导航** - 智能导航栏，在不同功能间快速切换
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
- **@mastra/client-js** - 官方 Mastra 客户端集成，支持 Fallback 模式
- **Multi-Agent 架构** - 接入多个专业 AI Agent

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
# Mastra API 配置（用于合同审核功能）
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop

# RecodeAgent API 配置（用于旅游规划功能）- v2.2 新增
VITE_RECODE_AGENT_API_URL=https://agent.juzhiqiang.shop

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
1. 在首页输入框中输入你的问题
2. 按 Enter 发送消息
3. 观察 AI 的实时流式响应

### 合同审核功能
1. 点击导航栏的 "合同审核" 按钮
2. 选择合同类型（可选）
3. 粘贴合同文本或上传合同文件
4. 获得专业的合规性分析报告

### 旅游规划功能 (v2.2 新增)
1. 点击导航栏的 "旅游规划" 按钮
2. 使用快速规划表单或自然语言对话
3. 输入目的地、旅行风格、天数等信息
4. 获得详细的旅游路线规划

详细使用说明请参考：
- [合同审核功能文档](./docs/CONTRACT_REVIEW.md)
- [旅游规划功能文档](./docs/travel-planning-guide.md)
- [故障排除指南](./docs/TROUBLESHOOTING.md) 🆕

## 🆕 v2.2 升级亮点

### 旅游规划模块
- ✅ **智能路线规划**: 集成 recodeAgent 旅游 Agent
- ✅ **多种旅行风格**: 经济型、舒适型、奢华型选择
- ✅ **全球目的地支持**: 涵盖欧洲、亚洲、北美、中国等热门城市
- ✅ **预算智能估算**: 根据风格和目的地自动计算预算
- ✅ **详细行程安排**: 逐日景点推荐和交通规划
- ✅ **实用旅行贴士**: 签证、最佳时间、注意事项提醒
- ✅ **自然语言交互**: 支持对话式旅游规划

### 技术架构升级
- ✅ **模块化导航**: 新增智能导航组件，快速切换功能
- ✅ **API 服务层**: 新增 travelAPI.ts 统一管理旅游相关接口
- ✅ **Multi-Agent 集成**: 同时接入多个专业 AI Agent
- ✅ **响应式优化**: 针对旅游规划场景优化界面设计
- ✅ **Fallback 机制**: @mastra/client-js 导入失败时自动启用模拟功能
- ✅ **完整调试工具**: 内置连接测试、状态监控、故障诊断

### 稳定性改进
- ✅ **兼容性导入**: 解决 @mastra/client-js 的 TypeScript 导入问题
- ✅ **错误处理**: 完善的错误恢复和 Fallback 机制
- ✅ **调试功能**: 实时状态指示器和详细调试信息
- ✅ **文档完善**: 新增故障排除指南和使用说明

## 🏗️ 项目结构

```
src/
├── components/
│   ├── XiaoBaoBaoStreamingChat.tsx    # 主聊天组件
│   ├── ContractReviewChat.tsx         # 合同审核组件
│   ├── TravelPlanningChat.tsx         # 旅游规划组件 (v2.2 新增)
│   ├── Navigation.tsx                 # 导航组件 (v2.2 新增)
│   └── index.ts                       # 组件导出
├── lib/
│   ├── streaming.ts                   # 流式响应处理
│   ├── graphql.ts                     # GraphQL 相关
│   ├── mastraClient.ts                # Mastra 客户端
│   └── travelAPI.ts                   # 旅游 API 服务 (v2.2 新增)
├── docs/
│   ├── CONTRACT_REVIEW.md             # 合同审核文档
│   ├── travel-planning-guide.md       # 旅游规划文档 (v2.2 新增)
│   └── TROUBLESHOOTING.md             # 故障排除指南 (v2.2 新增)
├── App.tsx                            # 路由配置
├── main.tsx                           # 应用入口
└── index.css                          # 全局样式
```

## 🔌 API 集成

### GraphQL API
本项目支持 GraphQL 流式查询，提供实时的对话体验。

### Mastra Agent API
集成了官方 Mastra 客户端，用于合同审核功能：
- [@mastra/client-js](https://www.npmjs.com/package/@mastra/client-js) - 官方 Mastra 客户端
- [recodeAgent](https://github.com/juzhiqiang/recodeAgent) - 合同审核代理服务
- DeepSeek AI - 底层语言模型

### RecodeAgent Travel API (v2.2 新增)
集成了专门的旅游规划 API，统一使用 agent.juzhiqiang.shop：
- [recodeAgent](https://github.com/juzhiqiang/recodeAgent) - 旅游规划代理服务
- Travel Route Tool - 智能路线优化算法
- Geography API - 地理信息和距离计算
- DeepSeek AI - 个性化推荐引擎

#### 主要 API 功能
```typescript
// 合同审核
await mastraClient.workflows.run({
  workflowId: 'contract-review-workflow',
  input: { ... }
});

// 旅游规划 (v2.2 新增)
await travelAPIService.smartTravelPlanning({
  destinations: ['巴黎', '伦敦'],
  travelStyle: 'comfort',
  duration: 7
});

// Fallback 模式支持
// 当 @mastra/client-js 导入失败时，自动启用模拟功能
```

## 🔧 故障排除

### 常见问题快速解决

#### 1. @mastra/client-js 导入错误
✅ **已修复**: 系统已添加 Fallback 机制，导入失败时自动使用模拟功能

#### 2. API 连接失败 (404 错误) 
✅ **已修复**: 改用 @mastra/client-js SDK 而非直接 REST 调用

#### 3. 旅游规划功能无响应
- 点击页面右上角"测试连接"按钮检查状态
- 查看"调试信息"面板了解详细状态
- 即使 API 不可用，Fallback 模式仍提供基本功能

### 调试工具
- **连接状态指示器**: 🟢 正常 / 🔴 失败 / 🟡 检测中
- **测试连接按钮**: 手动检测 API 连接状态
- **调试信息面板**: 显示详细的服务状态和错误信息

详细故障排除指南请参考：[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

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

## 🔄 从 v2.1 升级到 v2.2

如果你已经在使用 v2.1 版本，升级到 v2.2：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖
npm install

# 3. 更新环境变量
# 在 .env 文件中新增或更新：
# VITE_RECODE_AGENT_API_URL=https://agent.juzhiqiang.shop

# 4. 启动应用
npm run dev
```

所有现有的功能保持不变，新增了旅游规划模块！

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

### v2.2.0 (2025-08-14)
- 🎉 **旅游规划功能**: 全新的智能旅游路线规划模块
- 🗺️ **Multi-Agent 架构**: 集成 recodeAgent 旅游 Agent
- 🧭 **智能导航**: 新增模块化导航组件
- 🌍 **全球支持**: 支持全球主要旅游城市
- 💰 **智能预算**: 根据旅行风格自动估算费用
- 🎯 **个性化推荐**: 三种旅行风格适应不同需求
- 📱 **响应式优化**: 移动端旅游规划体验优化
- 🔄 **API 统一**: 所有功能统一使用 agent.juzhiqiang.shop
- 🛡️ **稳定性改进**: Fallback 机制、错误处理、调试工具
- 📚 **文档完善**: 新增故障排除指南和详细使用说明

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

## 🌟 功能演示

### 旅游规划示例

**输入**: "我想去日本旅游7天，预算充足"

**输出**:
```markdown
# 🗺️ 您的专属旅游路线规划

## 📋 行程概览
🎯 **目的地**: 东京 → 京都 → 大阪
⏰ **总天数**: 7天
🛣️ **总距离**: 515公里
💰 **预算范围**: ¥12,600 - ¥16,380
🌟 **最佳时间**: 春季(3-5月)和秋季(9-11月)

## 🛤️ 详细路线安排

### 📍 第1站：东京 (3天)
**🎯 必游景点**: 浅草寺、东京塔、皇居、新宿、涩谷
**🚗 交通方式**: 头等舱航班
**💵 预估花费**: ¥1200-2600/天

### 📍 第2站：京都 (2天)  
**🎯 必游景点**: 清水寺、金阁寺、伏见稻荷大社
**🚗 交通方式**: 新干线
**💵 预估花费**: ¥1200-2600/天

### 📍 第3站：大阪 (2天)
**🎯 必游景点**: 大阪城、道顿堀、环球影城
**🚗 交通方式**: 新干线
**💵 预估花费**: ¥1200-2600/天

## 💡 实用旅行贴士
- 建议购买JR Pass通票，方便城际交通
- 春季赏樱和秋季赏枫是最佳旅行时间
- 提前预订热门餐厅和景点门票
```

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide React](https://lucide.dev/) - 图标库
- [Mastra](https://mastra.ai/) - AI Agent 框架
- [DeepSeek](https://www.deepseek.com/) - AI 模型服务
- [React Router](https://reactrouter.com/) - 路由管理
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown 渲染

## 📞 联系

- 项目链接: [https://github.com/juzhiqiang/xiao-bao-bao](https://github.com/juzhiqiang/xiao-bao-bao)
- 在线演示: [https://juzhiqiang.github.io/xiao-bao-bao](https://juzhiqiang.github.io/xiao-bao-bao)
- 旅游规划演示: [https://juzhiqiang.github.io/xiao-bao-bao/travel-planning](https://juzhiqiang.github.io/xiao-bao-bao/travel-planning)
- 问题反馈: [Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues)
- 功能文档: 
  - [旅游规划指南](./docs/travel-planning-guide.md)
  - [合同审核指南](./docs/CONTRACT_REVIEW.md)
  - [故障排除指南](./docs/TROUBLESHOOTING.md) 🆕

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

🌟 现在支持智能旅游规划，让AI帮你规划完美的旅行路线！

💡 遇到问题？查看我们的[故障排除指南](./docs/TROUBLESHOOTING.md)快速解决！
