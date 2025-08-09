import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { CHAT_MUTATION } from '../lib/graphql';

const SimpleGraphQLTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [chatMutation, { loading, error }] = useMutation(CHAT_MUTATION);

  const testSimpleChat = async () => {
    setTestResult('开始测试...');
    
    try {
      // 创建最简单的测试数据
      const testInput = {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: '你好'
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
        top_p: 0.9
      };

      console.log('测试输入:', JSON.stringify(testInput, null, 2));
      
      const result = await chatMutation({
        variables: {
          input: testInput
        }
      });

      console.log('测试结果:', JSON.stringify(result, null, 2));
      
      if (result.data?.chat) {
        setTestResult(`✅ 成功！收到响应: ${JSON.stringify(result.data.chat, null, 2)}`);
      } else {
        setTestResult(`❌ 响应格式异常: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (err) {
      console.error('测试错误:', err);
      setTestResult(`❌ 测试失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const testWithRawFetch = async () => {
    setTestResult('开始原生fetch测试...');
    
    try {
      const query = `
        mutation Chat($input: ChatInput!) {
          chat(input: $input) {
            id
            object
            created
            model
            choices {
              index
              message {
                role
                content
              }
              finish_reason
            }
            usage {
              prompt_tokens
              completion_tokens
              total_tokens
            }
          }
        }
      `;

      const variables = {
        input: {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: '你好'
            }
          ],
          max_tokens: 50,
          temperature: 0.7,
          top_p: 0.9
        }
      };

      console.log('原生fetch请求:');
      console.log('Query:', query);
      console.log('Variables:', JSON.stringify(variables, null, 2));

      const response = await fetch('https://deepseek.jzq1020814597.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      const data = await response.json();
      console.log('原生fetch响应:', data);

      if (data.errors) {
        setTestResult(`❌ GraphQL错误: ${JSON.stringify(data.errors, null, 2)}`);
      } else if (data.data?.chat) {
        setTestResult(`✅ 原生fetch成功！收到响应: ${JSON.stringify(data.data.chat, null, 2)}`);
      } else {
        setTestResult(`❌ 响应格式异常: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      console.error('原生fetch错误:', err);
      setTestResult(`❌ 原生fetch失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">简化GraphQL测试</h1>
      
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">测试选项</h2>
        
        <div className="flex gap-4">
          <button
            onClick={testSimpleChat}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? '测试中...' : 'Apollo Client测试'}
          </button>
          
          <button
            onClick={testWithRawFetch}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            原生Fetch测试
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Apollo Client错误</p>
              <p className="text-red-600 text-sm">{error.message}</p>
              {error.graphQLErrors?.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-700">GraphQL错误详情</summary>
                  <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(error.graphQLErrors, null, 2)}
                  </pre>
                </details>
              )}
              {error.networkError && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-700">网络错误详情</summary>
                  <pre className="text-xs bg-red-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(error.networkError, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {testResult && (
          <div className="p-4 bg-gray-50 border rounded">
            <h3 className="font-medium mb-2">测试结果:</h3>
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
              {testResult}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">调试信息</h2>
        <div className="space-y-2 text-sm">
          <div><strong>GraphQL端点:</strong> https://deepseek.jzq1020814597.workers.dev</div>
          <div><strong>预期输入格式:</strong></div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
{`{
  "input": {
    "model": "deepseek-chat",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ],
    "max_tokens": 50,
    "temperature": 0.7,
    "top_p": 0.9
  }
}`}
          </pre>
          <div><strong>预期响应格式:</strong></div>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
{`{
  "data": {
    "chat": {
      "id": "...",
      "object": "chat.completion",
      "created": 1234567890,
      "model": "deepseek-chat",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "你好！我是DeepSeek..."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 20,
        "total_tokens": 30
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

export default SimpleGraphQLTest;