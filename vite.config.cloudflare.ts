import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages 专用配置 - 确保使用根路径
export default defineConfig(({ command, mode }) => {
  // 强制使用根路径，无论什么环境
  const base = '/';

  console.log(`🌟 Cloudflare Pages Build - mode: ${mode}, base: ${base}`);

  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            apollo: ['@apollo/client', 'graphql']
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2020',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 3000,
      host: true
    }
  }
})
