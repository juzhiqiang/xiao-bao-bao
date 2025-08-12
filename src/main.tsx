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
function getBasename(): string {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('Detection - hostname:', hostname, 'pathname:', pathname);
  
  // 更精确的GitHub Pages检测
  if (hostname === 'juzhiqiang.github.io') {
    console.log('✅ Detected GitHub Pages deployment');
    return '/xiao-bao-bao';
  }
  
  // 如果pathname已经包含/xiao-bao-bao/，说明是GitHub Pages
  if (pathname.startsWith('/xiao-bao-bao/')) {
    console.log('✅ Detected GitHub Pages deployment (via pathname)');
    return '/xiao-bao-bao';
  }
  
  // 所有其他情况（包括自定义域名、Cloudflare Pages等）
  console.log('✅ Detected Custom Domain/Cloudflare Pages deployment');
  return '/';
}

const basename = getBasename();
console.log('🎯 Final basename:', basename);

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
