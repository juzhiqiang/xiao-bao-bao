import { Routes, Route } from 'react-router-dom';
import XiaoBaoBaoStreamingChat from './components/XiaoBaoBaoStreamingChat';
import ContractReviewChat from './components/ContractReviewChat';
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 主页路由 */}
        <Route path="/" element={<XiaoBaoBaoStreamingChat />} />
        
        {/* 合同审核路由 */}
        <Route path="/contract-review" element={<ContractReviewChat />} />
        
        {/* 404处理 - 重定向到主页 */}
        <Route path="*" element={<XiaoBaoBaoStreamingChat />} />
      </Routes>
    </div>
  );
}

export default App;
