import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import XiaoBaoBaoStreamingChat from './components/XiaoBaoBaoStreamingChat';
import ContractReviewChat from './components/ContractReviewChat';
import './index.css';

function App() {
  useEffect(() => {
    // 调试信息（仅在开发环境）
    if (import.meta.env.DEV) {
      console.log('🚀 App mounted:', {
        currentPath: window.location.pathname,
        currentSearch: window.location.search,
        currentHash: window.location.hash,
        fullUrl: window.location.href
      });
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* 主页路由 */}
        <Route path="/" element={<XiaoBaoBaoStreamingChat />} />
        
        {/* 合同审核路由 */}
        <Route path="/contract-review" element={<ContractReviewChat />} />
        
        {/* 兼容性路由 - 处理可能的旧路径 */}
        <Route path="/xiao-bao-bao" element={<Navigate to="/" replace />} />
        <Route path="/xiao-bao-bao/contract-review" element={<Navigate to="/contract-review" replace />} />
        
        {/* 404 重定向到主页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
