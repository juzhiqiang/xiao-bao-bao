# ☁️ Cloudflare Pages 专用部署指南

## 🚨 重要提示

如果您在Cloudflare Pages上遇到MIME类型错误：
```
Refused to apply style because its MIME type ('text/html') is not a supported stylesheet MIME type
```

这是因为使用了错误的构建配置。请按以下步骤操作：

## ✅ 正确的部署步骤

### 1. 在Cloudflare Pages中设置构建配置

```
构建命令: npm run build:cloudflare
构建输出目录: dist
根目录: / (保持默认)
Node.js版本: 18
```

### 2. 环境变量设置

在Cloudflare Pages的**设置 > 环境变量**中添加：

```
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
```

### 3. 验证构建输出

构建完成后，检查dist目录结构应该是：
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   ├── index-[hash].css
  │   ├── vendor-[hash].js
  │   ├── router-[hash].js
  │   └── apollo-[hash].js
  ├── _redirects
  └── favicon.svg
```

### 4. 关键文件说明

- **`_redirects`**: 确保SPA路由和正确的MIME类型
- **`vite.config.cloudflare.ts`**: Cloudflare专用构建配置
- **base路径**: 设置为 `/` (根路径)

## 🔍 常见问题

### Q: 为什么不能使用默认的build命令？
A: 默认的 `npm run build` 是为GitHub Pages配置的，base路径为 `/xiao-bao-bao/`，在Cloudflare上会导致资源404错误。

### Q: 如果仍然出现404错误怎么办？
A: 
1. 清除Cloudflare Pages的缓存
2. 重新部署，确保使用 `npm run build:cloudflare`
3. 检查浏览器网络面板，确认请求的是正确的路径

### Q: 如何在本地测试Cloudflare配置？
A: 使用预览命令：
```bash
npm run preview:cloudflare
```

## 🚀 自动化部署

如果您想要自动化Cloudflare部署，可以：

1. 在Cloudflare Pages中连接GitHub仓库
2. 设置分支为 `main`
3. 使用上述构建配置
4. 推送代码即可自动部署

## 📞 技术支持

如果遇到问题：
1. 检查Cloudflare Pages的构建日志
2. 验证构建命令是否正确
3. 查看浏览器控制台的错误信息
4. 提交GitHub Issue寻求帮助

---
💡 记住：Cloudflare Pages必须使用 `npm run build:cloudflare` 命令！
