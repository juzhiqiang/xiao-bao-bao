import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据环境自动设置base路径
  // GitHub Pages需要仓库名作为base路径
  // Cloudflare Pages和本地开发使用根路径
  const base = mode === 'production' && process.env.GITHUB_ACTIONS
    ? '/xiao-bao-bao/'  // GitHub Pages
    : '/'               // Cloudflare Pages 或本地开发

  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      // 确保资源文件路径正确
      assetsDir: 'assets',
    },
  }
})