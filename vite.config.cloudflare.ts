import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages 专用配置
export default defineConfig({
  plugins: [react()],
  base: '/', // Cloudflare Pages 使用根路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 添加更好的错误处理
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          apollo: ['@apollo/client', 'graphql']
        },
        // 确保文件名一致性
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // 最小化代码
    minify: 'esbuild',
    // 确保目标兼容性
    target: 'es2020',
    // 清理输出目录
    emptyOutDir: true,
  },
  // 开发服务器配置
  server: {
    port: 3000,
    host: true,
  },
  // 预览服务器配置
  preview: {
    port: 3000,
    host: true
  }
})
