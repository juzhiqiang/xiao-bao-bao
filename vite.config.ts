import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据部署环境确定base路径
  const getBase = () => {
    // 生产环境下，如果是GitHub Pages，使用仓库名作为base
    if (mode === 'production') {
      // 检查是否为GitHub Pages部署
      if (process.env.GITHUB_REPOSITORY === 'juzhiqiang/xiao-bao-bao') {
        return '/xiao-bao-bao/';
      }
      // 自定义域名使用根路径
      return '/';
    }
    // 开发环境使用根路径
    return '/';
  };

  const base = getBase();

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
      // 开发环境支持客户端路由
      historyApiFallback: {
        index: '/index.html'
      }
    },
    preview: {
      port: 3000,
      host: true
    },
    // 确保环境变量正确处理
    define: {
      // 在构建时注入一些有用的信息
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.1.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
})
