import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Send } from 'lucide-react';
import { GET_MODELS, HELLO_QUERY, CHAT_MUTATION } from '../lib/graphql';

const GraphQLTest = () => {
  const [testMessage, setTestMessage] = useState('Hello, GraphQL!');
  
  // Test queries
  const { data: helloData, loading: helloLoading, error: helloError } = useQuery(HELLO_QUERY);
  const { data: modelsData, loading: modelsLoading, error: modelsError } = useQuery(GET_MODELS);
  
  // Test mutation
  const [chatMutation, { data: chatData, loading: chatLoading, error: chatError }] = useMutation(CHAT_MUTATION);
  
  const handleTestChat = async () => {
    try {
      await chatMutation({
        variables: {
          input: {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: testMessage }],
            max_tokens: 100,
            temperature: 0.7
          }
        }
      });
    } catch (error) {
      console.error('Chat test error:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">GraphQL API 测试</h1>
      
      {/* Hello Query Test */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Hello Query
          {helloLoading && <Loader className="w-4 h-4 animate-spin" />}
          {helloError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {helloData && <CheckCircle className="w-4 h-4 text-green-500" />}
        </h2>
        {helloError && (
          <div className="text-red-600 text-sm mb-2">错误: {helloError.message}</div>
        )}
        {helloData && (
          <div className="text-green-600 text-sm">响应: {helloData.hello}</div>
        )}
      </div>

      {/* Models Query Test */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Models Query
          {modelsLoading && <Loader className="w-4 h-4 animate-spin" />}
          {modelsError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {modelsData && <CheckCircle className="w-4 h-4 text-green-500" />}
        </h2>
        {modelsError && (
          <div className="text-red-600 text-sm mb-2">错误: {modelsError.message}</div>
        )}
        {modelsData && (
          <div className="text-sm">
            <div className="text-green-600 mb-2">找到 {modelsData.models?.length || 0} 个模型:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(modelsData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Chat Mutation Test */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Chat Mutation
          {chatLoading && <Loader className="w-4 h-4 animate-spin" />}
          {chatError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {chatData && <CheckCircle className="w-4 h-4 text-green-500" />}
        </h2>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
            placeholder="测试消息"
          />
          <button
            onClick={handleTestChat}
            disabled={chatLoading || !testMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            测试
          </button>
        </div>
        
        {chatError && (
          <div className="text-red-600 text-sm mb-2">
            错误: {chatError.message}
            <details className="mt-2">
              <summary className="cursor-pointer">详细信息</summary>
              <pre className="bg-red-50 p-2 rounded text-xs overflow-auto mt-1">
                {JSON.stringify(chatError, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        {chatData && (
          <div className="text-sm">
            <div className="text-green-600 mb-2">聊天响应:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(chatData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Raw GraphQL Test */}
      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">原始 GraphQL 测试</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <div>端点: https://deepseek.jzq1020814597.workers.dev</div>
          <div>示例查询:</div>
          <pre className="bg-gray-100 p-2 rounded text-xs">
{`query { 
  hello 
  models { 
    id 
    object 
    owned_by 
  } 
}`}
          </pre>
          <div>示例变更:</div>
          <pre className="bg-gray-100 p-2 rounded text-xs">
{`mutation { 
  chat(input: { 
    messages: [{ 
      role: "user", 
      content: "Hello" 
    }] 
  }) { 
    choices { 
      message { 
        content 
      } 
    } 
  } 
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GraphQLTest;