import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 简化配置 - 根据实际需要设置base路径
  // GitHub Pages: /xiao-bao-bao/
  // Cloudflare Pages: / (需要在构建时手动调整)
  const base = mode === 'production' ? '/xiao-bao-bao/' : '/';

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
          }
        }
      },
      minify: mode === 'production',
      target: 'es2020',
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
