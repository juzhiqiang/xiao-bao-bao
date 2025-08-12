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

// 简化的basename检测
function getBasename(): string {
  // 如果是GitHub Pages域名或路径包含仓库名，使用GitHub配置
  if (window.location.hostname === 'juzhiqiang.github.io' || 
      window.location.pathname.startsWith('/xiao-bao-bao/')) {
    return '/xiao-bao-bao';
  }
  // 其他情况使用根路径
  return '/';
}

const basename = getBasename();

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
