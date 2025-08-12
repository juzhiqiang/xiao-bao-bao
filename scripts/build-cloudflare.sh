#!/bin/bash

# Cloudflare Pages 构建脚本
echo "🌟 开始 Cloudflare Pages 构建..."

# 显示当前环境
echo "📊 环境信息:"
echo "Node版本: $(node --version)"
echo "NPM版本: $(npm --version)"
echo "当前目录: $(pwd)"

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 运行 TypeScript 检查
echo "🔍 TypeScript 检查..."
npx tsc --noEmit

# 使用 Cloudflare 专用配置构建
echo "🏗️ 使用 Cloudflare 配置构建..."
echo "配置文件: vite.config.cloudflare.ts"
npx vite build --config vite.config.cloudflare.ts

# 验证构建结果
echo "✅ 构建完成，验证文件..."
ls -la dist/
echo "📄 index.html 内容预览:"
head -20 dist/index.html

echo "🎉 Cloudflare Pages 构建完成！"
