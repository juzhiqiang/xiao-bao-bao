import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import apolloClient from './lib/apollo.ts'
import './index.css'

// 动态确定basename
// GitHub Pages: /xiao-bao-bao/
// Cloudflare Pages: /
function getBasename(): string {
  // 检查当前URL路径来判断部署环境
  const currentPath = window.location.pathname;
  
  // 如果路径包含 /xiao-bao-bao/，说明是GitHub Pages
  if (currentPath.startsWith('/xiao-bao-bao/')) {
    return '/xiao-bao-bao';
  }
  
  // 否则使用根路径（Cloudflare Pages或本地开发）
  return '/';
}

// 确保root元素存在
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const basename = getBasename();
console.log('Using basename:', basename);

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
