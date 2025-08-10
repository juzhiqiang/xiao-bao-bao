# 部署说明

## 🚀 部署指南

### 前端部署

#### GitHub Pages 部署

1. **构建项目**
```bash
npm run build
```

2. **部署到 GitHub Pages**
```bash
npm run deploy
```

#### Vercel 部署

1. **连接 GitHub 仓库**
   - 登录 [Vercel](https://vercel.com)
   - 导入 GitHub 仓库
   - 选择 `xiao-bao-bao` 项目

2. **配置构建设置**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **环境变量**（可选）
```
REACT_APP_API_ENDPOINT=https://ai-admin.juzhiqiang.shop
```

#### Netlify 部署

1. **连接仓库**
   - 登录 [Netlify](https://netlify.com)
   - 选择 "New site from Git"
   - 连接 GitHub 并选择仓库

2. **构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`

### API 服务部署

#### Cloudflare Workers 部署

当前 API 服务部署在 Cloudflare Workers：
- **生产环境**: `https://ai-admin.juzhiqiang.shop`
- **开发环境**: 可配置本地或测试环境

#### 自定义 API 部署

如果需要部署自己的 API 服务：

1. **创建 API 服务**
```typescript
// 兼容 OpenAI 格式的 API
app.post('/v1/chat/completions', async (req, res) => {
  const { messages, stream, model, temperature, max_tokens } = req.body;
  
  if (stream) {
    // 流式响应
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // 实现 SSE 流式响应
    // ...
  } else {
    // 传统响应
    // ...
  }
});
```

2. **配置 CORS**
```typescript
app.use(cors({
  origin: ['https://juzhiqiang.github.io', 'http://localhost:3000'],
  credentials: true
}));
```

## 🔧 环境配置

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 环境变量

创建 `.env` 文件：
```env
# API 配置
VITE_API_ENDPOINT=https://ai-admin.juzhiqiang.shop
VITE_API_KEY=your-api-key

# 应用配置
VITE_APP_TITLE=小包包AI对话
VITE_APP_VERSION=2.0.0
```

## 📊 性能优化

### 构建优化

1. **代码分割**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          markdown: ['react-markdown', 'remark-gfm'],
          ui: ['lucide-react']
        }
      }
    }
  }
});
```

2. **资源压缩**
```typescript
import { defineConfig } from 'vite';
import { gzip } from 'rollup-plugin-gzip';

export default defineConfig({
  plugins: [
    // ... 其他插件
    gzip()
  ]
});
```

### CDN 优化

使用 CDN 加速静态资源：
```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
```

## 🔐 安全配置

### CSP 设置

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://ai-admin.juzhiqiang.shop;">
```

### API 安全

1. **API Key 管理**
   - 使用环境变量存储敏感信息
   - 不要在前端代码中硬编码 API Key

2. **CORS 配置**
   - 限制允许的域名
   - 启用预检请求

3. **请求限制**
   - 实现请求频率限制
   - 添加请求大小限制

## 📈 监控和分析

### 错误监控

```typescript
// 添加错误监控
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到监控服务
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // 发送到监控服务
});
```

### 性能监控

```typescript
// 性能监控
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
  });
}
```

## 🧪 测试部署

### 本地测试

```bash
# 构建并测试
npm run build
npm run preview

# 运行测试
npm test
```

### 部署前检查清单

- [ ] 构建成功无错误
- [ ] 所有测试通过
- [ ] API 接口连通性测试
- [ ] 流式响应功能测试
- [ ] 跨浏览器兼容性测试
- [ ] 移动端适配测试
- [ ] 性能指标检查
- [ ] 安全配置验证

## 🔄 CI/CD 配置

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 自动化测试

```yaml
# .github/workflows/test.yml
name: Tests

on:
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 📝 部署日志

### v2.0.0 部署记录

- **日期**: 2025-01-XX
- **版本**: v2.0.0
- **更新内容**:
  - ✅ 新增流式响应功能
  - ✅ 更新 API 接口地址
  - ✅ 优化用户体验
  - ✅ 完善错误处理

- **部署环境**:
  - 前端: GitHub Pages
  - API: Cloudflare Workers
  - CDN: GitHub CDN

- **性能指标**:
  - 首屏加载时间: < 2s
  - 流式响应延迟: < 100ms
  - 包大小: < 500KB

---

**部署成功后记得更新文档和通知用户！** 🚀