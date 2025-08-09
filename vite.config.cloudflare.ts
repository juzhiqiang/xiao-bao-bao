import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages 专用配置
export default defineConfig({
  plugins: [react()],
  base: '/', // Cloudflare Pages 使用根路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})