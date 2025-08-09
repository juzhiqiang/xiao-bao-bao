import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import XiaoBaoBaoChat from './components/XiaoBaoBaoChat';
import GraphQLTest from './components/GraphQLTest';
import apolloClient from './lib/apollo';
import './index.css';

export default function App() {
  const [showTest, setShowTest] = useState(false);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        {/* Debug Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowTest(!showTest)}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
          >
            {showTest ? '返回聊天' : '调试模式'}
          </button>
        </div>
        
        {showTest ? <GraphQLTest /> : <XiaoBaoBaoChat />}
      </div>
    </ApolloProvider>
  );
}