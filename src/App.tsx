import { Routes, Route } from 'react-router-dom';
import XiaoBaoBaoStreamingChat from './components/XiaoBaoBaoStreamingChat';
import ContractReviewChat from './components/ContractReviewChat';
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<XiaoBaoBaoStreamingChat />} />
        <Route path="/contract-review" element={<ContractReviewChat />} />
      </Routes>
    </div>
  );
}

export default App;
