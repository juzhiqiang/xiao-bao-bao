import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 简化base路径逻辑
  const base = mode === 'production' && process.env.GITHUB_PAGES === 'true' 
    ? '/xiao-bao-bao/' 
    : '/';

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
            apollo: ['@apollo/client', 'graphql'],
            markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
            mastra: ['@mastra/client-js']
          }
        }
      },
      minify: mode === 'production',
      target: 'es2020',
      sourcemap: mode !== 'production'
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
