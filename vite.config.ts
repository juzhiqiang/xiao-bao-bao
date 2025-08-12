import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // GitHub Pages配置 - 默认构建目标
  const base = './';

  console.log(`Building with mode: ${mode}, base: ${base} (GitHub Pages)`);

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
