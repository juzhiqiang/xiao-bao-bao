# 🤖 小包包 (XiaoBaoBao)

<div align="center">

![小包包Logo](https://img.shields.io/badge/🎯-小包包-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**豆包风格的AI对话框组件** - 现代化、美观、易用的React组件

[🚀 在线预览](https://juzhiqiang.github.io/xiao-bao-bao) | [📖 文档](#使用方法) | [🐛 问题反馈](https://github.com/juzhiqiang/xiao-bao-bao/issues)

</div>

## ✨ 特性

- 🎨 **豆包风格设计** - 参考豆包AI的现代化UI设计
- 🚀 **TypeScript支持** - 完整的类型定义，开发体验更佳  
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌈 **渐变色彩** - 精美的渐变色彩搭配，视觉效果佳
- ⚡ **打字效果** - 模拟真实AI回复的打字动画
- 🎯 **快捷操作** - 支持复制、重新生成、点赞等交互功能
- 📝 **智能输入** - 自适应高度的文本输入框
- 🎊 **快速开始** - 内置快捷问题，一键体验

## 🎬 预览

### 桌面端效果
- 💬 流畅的对话体验
- 🎨 现代化的UI界面  
- 🌟 精美的动画效果
- 📋 丰富的交互功能

### 移动端效果
- 📱 完美的响应式适配
- 👆 触屏友好的操作
- 🔄 流畅的滚动体验

## 🛠️ 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript 5.0.2  
- **样式方案**: TailwindCSS 3.3.0
- **图标库**: Lucide React 0.263.1
- **构建工具**: Vite 4.4.5
- **部署平台**: GitHub Pages

## 🚀 快速开始

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/juzhiqiang/xiao-bao-bao.git

# 进入项目目录
cd xiao-bao-bao

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问项目

开发服务器启动后，在浏览器中访问 `http://localhost:5173` 即可预览效果。

## 📦 使用方法

### 基础使用

```tsx
import React from 'react';
import XiaoBaoBaoChat from './components/XiaoBaoBaoChat';

function App() {
  return (
    <div className="App">
      <XiaoBaoBaoChat />
    </div>
  );
}

export default App;
```

### 自定义配置

```tsx
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickAction {
  id: string;
  text: string;
  icon?: React.ReactNode;
}
```

## 🎨 设计特色

### 1. 豆包风格UI
- 采用现代化的卡片式设计
- 渐变色彩搭配，视觉效果佳
- 圆润的边角，温和的视觉体验

### 2. 交互体验
- 流畅的消息滚动动画
- 智能的输入框高度自适应
- 丰富的hover效果和micro交互

### 3. 功能完整
- 消息复制、重新生成
- 点赞/点踩反馈机制  
- 快捷问题一键发送
- 打字效果模拟

## 🌟 核心功能

### 💬 智能对话
- 支持多轮对话
- 消息历史记录
- 实时打字效果

### 🎯 快捷操作
- 预设问题快速发送
- 消息操作（复制、重新生成）
- 反馈机制（点赞、点踩）

### 📱 响应式设计
- 桌面端完美体验
- 移动端友好适配
- 各尺寸屏幕兼容

## 📂 项目结构

```
xiao-bao-bao/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # React组件
│   │   └── XiaoBaoBaoChat.tsx
│   ├── App.tsx           # 主应用
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── .github/              # GitHub配置
│   └── workflows/        # 自动部署配置
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.js    # TailwindCSS配置
└── vite.config.ts        # Vite配置
```

## 🔧 构建部署

### 本地构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 自动部署
项目已配置GitHub Actions，推送到main分支后会自动部署到GitHub Pages。

部署地址：https://juzhiqiang.github.io/xiao-bao-bao

## 📋 开发计划

- [ ] 添加主题切换功能
- [ ] 支持消息导出
- [ ] 添加语音输入支持
- [ ] 集成真实AI API
- [ ] 添加消息搜索功能
- [ ] 支持文件上传
- [ ] 添加快捷键支持

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建新的功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 👥 作者

**juzhiqiang** - *初始开发* - [GitHub](https://github.com/juzhiqiang)

## 🙏 致谢

- 感谢 [豆包](https://www.doubao.com/) 提供的设计灵感
- 感谢 [React](https://reactjs.org/) 团队
- 感谢 [TailwindCSS](https://tailwindcss.com/) 团队
- 感谢 [Lucide](https://lucide.dev/) 图标库

---

<div align="center">

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

[⬆ 回到顶部](#-小包包-xiaobaobaо)

</div>