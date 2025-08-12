import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
 
  const base = mode === 'production' ? './' : '/';

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
