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

// 检测部署环境并设置basename
// 方法：检查页面URL来确定当前部署平台
function getBasename(): string {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('Current hostname:', hostname, 'pathname:', pathname);
  
  // GitHub Pages 检测
  if (hostname === 'juzhiqiang.github.io' || pathname.startsWith('/xiao-bao-bao/')) {
    console.log('Detected GitHub Pages deployment');
    return '/xiao-bao-bao';
  }
  
  // Cloudflare Pages 或其他自定义域名
  console.log('Detected Cloudflare Pages or custom domain deployment');
  return '/';
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
