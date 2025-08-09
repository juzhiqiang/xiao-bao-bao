import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import XiaoBaoBaoChat from './components/XiaoBaoBaoChat';
import GraphQLTest from './components/GraphQLTest';
import SimpleGraphQLTest from './components/SimpleGraphQLTest';
import DirectAPITest from './components/DirectAPITest';
import apolloClient from './lib/apollo';
import './index.css';

export default function App() {
  const [viewMode, setViewMode] = useState<'chat' | 'debug' | 'simple' | 'direct'>('chat');

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        {/* Debug Toggle */}
        <div className="fixed top-4 right-4 z-50 flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('chat')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'chat' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            聊天
          </button>
          <button
            onClick={() => setViewMode('direct')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'direct' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            直接测试
          </button>
          <button
            onClick={() => setViewMode('simple')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'simple' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Apollo测试
          </button>
          <button
            onClick={() => setViewMode('debug')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'debug' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            详细调试
          </button>
        </div>
        
        {viewMode === 'chat' && <XiaoBaoBaoChat />}
        {viewMode === 'direct' && <DirectAPITest />}
        {viewMode === 'simple' && <SimpleGraphQLTest />}
        {viewMode === 'debug' && <GraphQLTest />}
      </div>
    </ApolloProvider>
  );
}