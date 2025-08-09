# 🤖 小包包 (XiaoBaoBao)

<div align="center">

![小包包Logo](https://img.shields.io/badge/🎯-小包包-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat-square&logo=typescript)
![GraphQL](https://img.shields.io/badge/GraphQL-16.8.1-E10098?style=flat-square&logo=graphql)
![Apollo](https://img.shields.io/badge/Apollo-3.8.7-311C87?style=flat-square&logo=apollo-graphql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?style=flat-square&logo=tailwindcss)
![DeepSeek](https://img.shields.io/badge/AI-DeepSeek-FF6B6B?style=flat-square)
![Markdown](https://img.shields.io/badge/Markdown-Support-000000?style=flat-square&logo=markdown)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**豆包风格的AI对话框组件** - 现代化、美观、易用的React组件，集成GraphQL接口和真实AI能力，支持完整Markdown渲染

[🚀 GitHub Pages](https://juzhiqiang.github.io/xiao-bao-bao) | [⚡ Cloudflare Pages](https://xiao-bao-bao.pages.dev) | [🤖 GraphQL API](https://deepseek.jzq1020814597.workers.dev) | [📖 文档](#使用方法)

</div>

## ✨ 特性

### 🎨 UI设计
- **豆包风格界面** - 参考豆包AI的现代化UI设计
- **响应式布局** - 完美适配桌面端和移动端
- **精美动画** - 流畅的过渡效果和micro交互
- **渐变配色** - 现代化的渐变色彩搭配

### 🤖 AI功能
- **真实AI对话** - 接入DeepSeek AI，提供智能回复
- **GraphQL接口** - 使用现代化的GraphQL API进行数据交互
- **多轮对话** - 支持上下文记忆的连续对话
- **智能问答** - 回答各种问题，提供专业建议
- **代码辅助** - 编程相关问题和代码生成
- **创意写作** - 文案创作、诗歌创作等创意功能

### 📝 Markdown支持
- **完整渲染** - 支持所有标准Markdown语法
- **代码高亮** - 多语言语法高亮显示
- **表格支持** - 完美渲染Markdown表格
- **链接处理** - 自动处理外部链接（新窗口打开）
- **GFM扩展** - 支持GitHub风格Markdown扩展

### 🛠️ 交互功能
- **快捷问题** - 预设常用问题，一键发送
- **消息操作** - 复制、重新生成AI回复
- **错误处理** - 完善的错误提示和重试机制
- **智能输入** - 自适应高度的文本输入框
- **实时状态** - AI思考和回复过程的实时反馈

## 🌐 在线体验

### 🎯 直接体验
- **GitHub Pages**: https://juzhiqiang.github.io/xiao-bao-bao
- **Cloudflare Pages**: https://xiao-bao-bao.pages.dev

### 🔧 API服务
- **GraphQL API**: https://deepseek.jzq1020814597.workers.dev
- **支持模型**: deepseek-chat, deepseek-coder
- **部署平台**: Cloudflare Workers
- **接口类型**: 标准GraphQL接口

## 🛠️ 技术架构

### 前端技术
- **框架**: React 18.2.0 + TypeScript 5.0.2
- **GraphQL**: Apollo Client 3.8.7 + GraphQL 16.8.1
- **样式**: TailwindCSS 3.3.0
- **图标**: Lucide React 0.263.1
- **构建**: Vite 4.4.5
- **Markdown**: React-Markdown 9.0.1
- **代码高亮**: rehype-highlight 7.0.0
- **GFM扩展**: remark-gfm 4.0.0

### 后端服务
- **AI模型**: DeepSeek Chat & Coder
- **API类型**: GraphQL接口
- **API代理**: Cloudflare Workers
- **部署**: 无服务器架构

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/juzhiqiang/xiao-bao-bao.git
cd xiao-bao-bao

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 依赖说明

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0", 
    "lucide-react": "^0.263.1",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "rehype-highlight": "^7.0.0",
    "@apollo/client": "^3.8.7",
    "graphql": "^16.8.1",
    "graphql-tag": "^2.12.6"
  }
}
```

## 🔧 GraphQL集成

### Apollo Client配置

```tsx
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://deepseek.jzq1020814597.workers.dev',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### GraphQL查询和变更

```tsx
import { gql, useMutation, useQuery } from '@apollo/client';

// 获取可用模型
const GET_MODELS = gql`
  query GetModels {
    models {
      data {
        id
        object
        created
        ownedBy
      }
    }
  }
`;

// 聊天完成
const CHAT_COMPLETION = gql`
  mutation ChatCompletion($input: ChatCompletionInput!) {
    chatCompletion(input: $input) {
      id
      object
      created
      model
      choices {
        index
        message {
          role
          content
        }
        finishReason
      }
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

// 在组件中使用
const { data: modelsData } = useQuery(GET_MODELS);
const [chatCompletion, { loading, error }] = useMutation(CHAT_COMPLETION);
```

### 使用GraphQL发送消息

```tsx
const handleSendMessage = async (userMessage: string) => {
  const input = {
    model: 'deepseek-chat',
    messages: [
      { role: 'user', content: userMessage }
    ],
    maxTokens: 2000,
    temperature: 0.7,
    topP: 0.9,
    stream: false
  };

  const { data } = await chatCompletion({
    variables: { input }
  });

  const aiResponse = data?.chatCompletion?.choices?.[0]?.message?.content;
  // 处理AI回复...
};
```

## 📝 Markdown功能展示

小包包现在支持完整的Markdown渲染，包括：

### 代码高亮
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 调用函数
print(fibonacci(10))
```

### 表格支持
| 功能 | 支持状态 | 说明 |
|------|---------|------|
| GraphQL接口 | ✅ | 现代化API接口 |
| 代码高亮 | ✅ | 多语言语法高亮 |
| 表格渲染 | ✅ | 完美的表格显示 |
| 链接处理 | ✅ | 新窗口打开外链 |
| 列表支持 | ✅ | 有序和无序列表 |

### 文本格式
- **粗体文字**
- *斜体文字* 
- ~~删除线~~
- `行内代码`

### 引用和列表
> 这是一个引用块，支持多行内容的引用显示

1. 有序列表项1
2. 有序列表项2
   - 无序子项
   - 嵌套支持

## 📦 组件使用

### 基础集成

```tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './lib/apollo';
import XiaoBaoBaoChat from './components/XiaoBaoBaoChat';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <XiaoBaoBaoChat />
      </div>
    </ApolloProvider>
  );
}

export default App;
```

### 自定义GraphQL端点

```tsx
// 修改 src/lib/apollo.ts
const httpLink = createHttpLink({
  uri: 'https://your-graphql-endpoint.workers.dev',
});
```

## 🎨 样式定制

### Markdown样式类

```css
.markdown-content {
  line-height: 1.6;
}

.markdown-content h1, h2, h3 {
  margin-top: 1.25em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-content pre {
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 1em;
  border-radius: 0.5rem;
}

.markdown-content code {
  background-color: #f1f5f9;
  color: #e11d48;
  padding: 0.125em 0.25em;
  border-radius: 0.25rem;
}
```

## 🔧 配置说明

### 构建配置
```bash
# GitHub Pages构建
npm run build

# Cloudflare Pages构建  
npm run build:cloudflare
```

### Apollo配置
```tsx
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://deepseek.jzq1020814597.workers.dev',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  },
});
```

### Markdown配置
```tsx
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Markdown插件配置
remarkPlugins={[remarkGfm]}
rehypePlugins={[rehypeHighlight]}
```

## 🌟 核心功能

### 🤖 AI对话引擎
- **接口**: GraphQL标准接口
- **模型**: DeepSeek-Chat (67B参数)
- **格式**: 支持Markdown格式回复
- **高亮**: 自动代码语法高亮
- **渲染**: 实时Markdown渲染

### 📊 性能优化
- **GraphQL**: 精确数据查询，减少网络传输
- **Apollo缓存**: 智能的查询结果缓存
- **懒加载**: Markdown组件按需渲染
- **语法高亮**: 高效的代码高亮处理
- **响应式**: 自适应的表格和代码块

## 📋 开发路线

### ✅ 已完成
- [x] 基础UI组件开发
- [x] GraphQL接口集成
- [x] Apollo Client配置
- [x] DeepSeek AI集成
- [x] 多轮对话支持
- [x] Markdown完整支持
- [x] 代码语法高亮
- [x] 表格和列表渲染
- [x] 错误处理机制
- [x] 响应式设计
- [x] 双平台部署

### 🚧 进行中
- [ ] GraphQL订阅支持
- [ ] 流式Markdown渲染
- [ ] 自定义代码主题
- [ ] 数学公式支持(KaTeX)
- [ ] 图片和媒体支持

### 📅 计划中
- [ ] GraphQL片段优化
- [ ] 实时协作编辑
- [ ] Markdown导出功能
- [ ] 自定义Markdown组件
- [ ] 语音转Markdown
- [ ] AI辅助Markdown生成

## 🤝 贡献指南

欢迎参与项目开发！

### 前端贡献
1. Fork [xiao-bao-bao](https://github.com/juzhiqiang/xiao-bao-bao) 仓库
2. 创建功能分支：`git checkout -b feature/graphql-enhancement`
3. 提交更改：`git commit -m 'Add GraphQL features'`
4. 推送分支：`git push origin feature/graphql-enhancement`
5. 提交Pull Request

### API贡献
1. Fork [deepseekApi](https://github.com/juzhiqiang/deepseekApi) 仓库
2. 按照相同流程提交改进

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 👥 团队

**juzhiqiang** - *项目创建者*
- [GitHub](https://github.com/juzhiqiang)
- [GraphQL API服务](https://deepseek.jzq1020814597.workers.dev)

## 🙏 致谢

### 技术支持
- [DeepSeek](https://www.deepseek.com/) - 提供强大的AI模型
- [GraphQL](https://graphql.org/) - 现代化的API查询语言
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL客户端和工具链
- [React-Markdown](https://github.com/remarkjs/react-markdown) - Markdown渲染支持
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight) - 代码语法高亮
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub风格Markdown
- [Cloudflare](https://www.cloudflare.com/) - 边缘计算和CDN服务
- [React](https://reactjs.org/) - 前端框架支持
- [TailwindCSS](https://tailwindcss.com/) - 样式系统

### 设计灵感
- [豆包](https://www.doubao.com/) - UI设计参考
- [GitHub](https://github.com/) - Markdown渲染参考
- [Lucide](https://lucide.dev/) - 图标设计

---

<div align="center">

**🎯 现在小包包支持GraphQL接口、完整的Markdown渲染和代码高亮！**

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

[⬆ 回到顶部](#-小包包-xiaobaobaо)

</div>