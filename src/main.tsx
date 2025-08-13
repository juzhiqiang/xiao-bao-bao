import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import apolloClient from './lib/apollo.ts'
import './index.css'

// 确保root元素存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// 修复的basename检测逻辑
function getBasename(): string {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // GitHub Pages 特定域名
  if (hostname === 'juzhiqiang.github.io') {
    return '/xiao-bao-bao';
  }
  
  // 如果是自定义域名 (al.juzhiqiang.shop)，使用根路径
  if (hostname === 'al.juzhiqiang.shop' || hostname.includes('juzhiqiang.shop')) {
    return '/';
  }
  
  // 开发环境检测
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('.local')) {
    return '/';
  }
  
  // 如果路径明确包含项目名，说明是在子路径部署
  if (pathname.startsWith('/xiao-bao-bao/') && !pathname.startsWith('/xiao-bao-bao/contract-review')) {
    return '/xiao-bao-bao';
  }
  
  // 默认使用根路径
  return '/';
}

const basename = getBasename();

// 调试信息（仅在开发环境）
if (import.meta.env.DEV) {
  console.log('🔧 Router Config:', {
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    basename: basename,
    fullUrl: window.location.href
  });
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
