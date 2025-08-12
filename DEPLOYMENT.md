# 🚀 小包包部署指南

本文档详细说明了如何在不同环境中部署小包包应用，包括合同审核功能的完整配置。

## 📋 部署前准备

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0
- DeepSeek API Key
- Mastra服务运行环境

### 必需的API密钥
1. **DeepSeek API Key** - 用于合同审核功能
2. **GraphQL Endpoint** - DeepSeek GraphQL服务地址

## 🔧 本地开发环境

### 1. 克隆项目
```bash
git clone https://github.com/juzhiqiang/xiao-bao-bao.git
cd xiao-bao-bao
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
vim .env
```

配置内容：
```env
# Mastra API Configuration
VITE_MASTRA_API_URL=http://localhost:4111

# DeepSeek API Configuration
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# GraphQL API Configuration
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
```

### 4. 启动Mastra服务

```bash
# 克隆recodeAgent项目
git clone https://github.com/juzhiqiang/recodeAgent.git
cd recodeAgent

# 安装依赖
npm install

# 配置环境变量
echo "DEEPSEEK_API_KEY=sk-your-deepseek-api-key" > .env

# 启动开发服务器
npm run dev
```

### 5. 启动前端应用
```bash
# 返回主项目目录
cd ../xiao-bao-bao

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173`

## 🌐 GitHub Pages 部署

### 1. 构建生产版本
```bash
npm run build
```

### 2. 部署到GitHub Pages
```bash
npm run deploy
```

### 3. 配置GitHub Pages
1. 进入仓库设置页面
2. 找到 "Pages" 设置
3. 选择 "gh-pages" 分支
4. 保存设置

访问 `https://yourusername.github.io/xiao-bao-bao`

## ☁️ Cloudflare Workers 部署

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler auth login
```

### 3. 配置 wrangler.toml
```toml
name = "xiao-bao-bao"
compat_date = "2023-05-18"
account_id = "your-account-id"

[site]
bucket = "./dist"
entry-point = "workers-site"
```

### 4. 构建并部署
```bash
npm run build:cloudflare
wrangler publish
```

## 🐳 Docker 部署

### 1. 创建 Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 创建 nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### 3. 构建并运行
```bash
# 构建镜像
docker build -t xiao-bao-bao .

# 运行容器
docker run -p 8080:80 xiao-bao-bao
```

## 🔄 CI/CD 自动部署

### GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_MASTRA_API_URL: ${{ secrets.VITE_MASTRA_API_URL }}
        DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
        VITE_GRAPHQL_ENDPOINT: ${{ secrets.VITE_GRAPHQL_ENDPOINT }}

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 配置 GitHub Secrets
1. 进入仓库设置
2. 选择 "Secrets and variables" > "Actions"
3. 添加以下密钥：
   - `VITE_MASTRA_API_URL`
   - `DEEPSEEK_API_KEY`
   - `VITE_GRAPHQL_ENDPOINT`

## 🖥️ 服务器部署

### 1. 准备服务器
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

### 2. 部署应用
```bash
# 克隆项目
git clone https://github.com/juzhiqiang/xiao-bao-bao.git
cd xiao-bao-bao

# 安装依赖
npm install

# 配置环境变量
vim .env

# 构建生产版本
npm run build

# 使用 serve 提供静态文件服务
npm install -g serve
pm2 start "serve -s dist -p 3000" --name xiao-bao-bao
```

### 3. 配置 Nginx 反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 监控和维护

### 1. 应用监控
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs xiao-bao-bao

# 重启应用
pm2 restart xiao-bao-bao
```

### 2. 更新应用
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart xiao-bao-bao
```

## ⚠️ 注意事项

### 安全配置
1. **API密钥安全**
   - 不要在客户端暴露服务端API密钥
   - 使用环境变量管理敏感信息
   - 定期轮换API密钥

2. **CORS配置**
   - 确保后端API正确配置CORS策略
   - 限制允许的域名和请求方法

3. **HTTPS配置**
   - 生产环境务必使用HTTPS
   - 配置SSL证书
   - 启用HTTP/2

### 性能优化
1. **静态资源缓存**
2. **代码分割和懒加载**
3. **CDN加速**
4. **Gzip压缩**

### 故障排查
1. **检查API连接状态**
2. **查看浏览器控制台错误**
3. **验证环境变量配置**
4. **检查网络连接**

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看项目 [Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues)
2. 提交新的 Issue
3. 参考 [README.md](./README.md) 文档

---

祝部署顺利！🎉
