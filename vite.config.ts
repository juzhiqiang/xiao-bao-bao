import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 使用环境变量明确控制base路径
  // VITE_DEPLOYMENT_TARGET: 'github' | 'cloudflare' | undefined
  const deploymentTarget = process.env.VITE_DEPLOYMENT_TARGET;
  
  let base = '/';
  
  if (deploymentTarget === 'github' || (mode === 'production' && !deploymentTarget)) {
    // 默认生产环境使用GitHub Pages配置
    base = '/xiao-bao-bao/';
  } else if (deploymentTarget === 'cloudflare') {
    // 明确指定Cloudflare使用根路径
    base = '/';
  }

  console.log(`Building with mode: ${mode}, deployment: ${deploymentTarget || 'default'}, base: ${base}`);

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
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      target: 'es2020',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      host: true,
      fs: {
        strict: true
      }
    },
    preview: {
      port: 3000,
      host: true
    },
    define: {
      __DEV__: mode === 'development',
    }
  }
})
