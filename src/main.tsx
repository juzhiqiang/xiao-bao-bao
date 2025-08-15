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

// 简化的basename检测 - 只有GitHub Pages使用子路径
function getBasename(): string {
  const hostname = window.location.hostname;
  
  // 只有GitHub Pages需要使用子路径
  if (hostname === 'juzhiqiang.github.io') {
    console.log(123)
    return '/xiao-bao-bao';
  }
  
  // 所有其他情况（包括自定义域名）都使用根路径
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
