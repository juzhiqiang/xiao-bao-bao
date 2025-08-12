# 🚀 部署指南

## Cloudflare Pages 部署 (推荐)

### 自动部署
1. 在Cloudflare Pages连接GitHub仓库
2. 设置构建配置：
   - **构建命令**: `npm run build:cloudflare`
   - **构建输出目录**: `dist`
   - **根目录**: `/` (默认)
   - **Node.js版本**: `18`

### 手动部署
```bash
# 构建Cloudflare版本
npm run build:cloudflare

# 上传dist目录到Cloudflare Pages
```

### 环境变量设置
在Cloudflare Pages的环境变量中设置：
```
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
```

## GitHub Pages 部署

### 自动部署 (GitHub Actions)
推送到main分支会自动触发部署

### 手动部署
```bash
# 构建GitHub Pages版本
npm run build

# 部署到GitHub Pages
npm run deploy
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 本地预览构建版本
npm run preview

# 预览Cloudflare版本
npm run preview:cloudflare
```

## 故障排除

### MIME类型错误
如果遇到 "Expected a JavaScript module script but got text/html" 错误：

1. **Cloudflare Pages**: 
   - 确保使用 `npm run build:cloudflare` 构建
   - 检查 `_redirects` 文件是否正确部署
   - 验证base路径为 `/`

2. **GitHub Pages**:
   - 确保使用 `npm run build` 构建  
   - 检查 `404.html` 文件是否存在
   - 验证base路径为 `/xiao-bao-bao/`

### 路由问题
- SPA路由由 `_redirects` (Cloudflare) 和 `404.html` (GitHub Pages) 处理
- 确保BrowserRouter的basename设置正确

### 网络错误
- 检查API端点是否可访问
- 验证CORS配置
- 查看浏览器控制台的详细错误信息

## 配置文件说明

| 文件 | 用途 | 部署平台 |
|------|------|----------|
| `vite.config.ts` | 默认配置，自动检测环境 | GitHub Pages |
| `vite.config.cloudflare.ts` | Cloudflare专用配置 | Cloudflare Pages |
| `public/_redirects` | Cloudflare重定向规则 | Cloudflare Pages |
| `public/404.html` | GitHub Pages SPA路由 | GitHub Pages |

## 性能优化

构建配置包含：
- 代码分割 (vendor, router, apollo)
- 资源压缩和优化
- 缓存策略
- 源码映射 (开发模式)

## 监控和调试

部署后检查：
- [ ] 页面正常加载
- [ ] 路由切换正常
- [ ] API连接状态
- [ ] 控制台无错误
- [ ] 移动端适配

---
📝 更新时间: 2025-08-12
