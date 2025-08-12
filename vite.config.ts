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
      // 添加更好的错误处理
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            apollo: ['@apollo/client', 'graphql']
          }
        }
      },
      // 启用源码映射用于调试
      sourcemap: mode === 'development',
      // 最小化代码，但保持可读性
      minify: mode === 'production' ? 'esbuild' : false,
    },
    // 开发服务器配置
    server: {
      port: 3000,
      host: true,
      // 添加错误页面
      fs: {
        strict: true
      }
    },
    // 预览服务器配置
    preview: {
      port: 3000,
      host: true
    }
  }
})
