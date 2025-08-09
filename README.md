# 🤖 小包包 (Xiao-Bao-Bao)

豆包风格的AI对话框组件 - 使用 React + TypeScript 构建

## ✨ 特性

- 🎨 **豆包风格设计** - 参考字节跳动豆包AI的现代化界面设计
- 💬 **实时对话** - 流畅的聊天体验，支持打字动画效果
- 🎯 **TypeScript** - 完整的类型定义，更好的开发体验
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🌈 **渐变美化** - 精美的渐变色彩和动画效果
- ⚡ **轻量高效** - 基于 Vite 构建，快速加载

## 🚀 在线预览

[点击这里查看在线演示](https://juzhiqiang.github.io/xiao-bao-bao/)

## 📦 安装

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

## 🛠️ 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 现代化构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **Lucide React** - 美观的图标库

## 🎨 设计特点

### 界面风格
- 采用豆包AI的圆润气泡设计
- 渐变背景和阴影效果
- 现代化的色彩搭配
- 流畅的动画过渡

### 交互体验
- 支持 Enter 键快速发送消息
- 智能的消息滚动定位
- 打字状态指示动画
- 响应式的按钮状态

## 🔧 核心组件

### XiaoBaoBaoChat
主对话框组件，包含以下功能：
- 消息列表显示
- 用户输入处理
- AI回复模拟
- 滚动自动定位

### 主要接口
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}
```

⭐ 如果这个项目对你有帮助，请给一个星标支持！