import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据部署环境设置base路径
  // GitHub Pages总是需要仓库名作为base路径
  // 使用简单可靠的判断逻辑
  const base = mode === 'production' ? '/xiao-bao-bao/' : '/';

  console.log(`Building with mode: ${mode}, base: ${base}`);

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
          },
          // 确保文件名一致性
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // 启用源码映射用于调试
      sourcemap: mode === 'development',
      // 最小化代码
      minify: mode === 'production' ? 'esbuild' : false,
      // 确保目标兼容性
      target: 'es2020',
      // 清理输出目录
      emptyOutDir: true,
    },
    // 开发服务器配置
    server: {
      port: 3000,
      host: true,
      fs: {
        strict: true
      }
    },
    // 预览服务器配置
    preview: {
      port: 3000,
      host: true
    },
    // 定义全局变量替换
    define: {
      // 确保在构建时有正确的环境变量
      __DEV__: mode === 'development',
    }
  }
})
