import { useState } from 'react';

const DirectAPITest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testDirectGraphQL = async () => {
    setIsLoading(true);
    setTestResult('开始测试...');
    
    try {
      // 直接使用最简单的GraphQL请求
      const response = await fetch('https://deepseek.jzq1020814597.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              chat(input: {
                model: "deepseek-chat"
                messages: [
                  {
                    role: "user"
                    content: "你好"
                  }
                ]
                max_tokens: 100
                temperature: 0.7
                top_p: 0.9
              }) {
                id
                choices {
                  message {
                    role
                    content
                  }
                }
              }
            }
          `
        })
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', response.headers);

      const result = await response.json();
      console.log('完整响应:', result);

      if (result.errors) {
        setTestResult(`❌ GraphQL错误:\n${JSON.stringify(result.errors, null, 2)}`);
      } else if (result.data?.chat) {
        setTestResult(`✅ 成功！\n响应: ${JSON.stringify(result.data.chat, null, 2)}`);
      } else {
        setTestResult(`❓ 意外响应格式:\n${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('请求错误:', error);
      setTestResult(`❌ 请求失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testHelloQuery = async () => {
    setIsLoading(true);
    setTestResult('测试Hello查询...');
    
    try {
      const response = await fetch('https://deepseek.jzq1020814597.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              hello
            }
          `
        })
      });

      const result = await response.json();
      console.log('Hello查询响应:', result);

      if (result.errors) {
        setTestResult(`❌ Hello查询错误:\n${JSON.stringify(result.errors, null, 2)}`);
      } else if (result.data?.hello) {
        setTestResult(`✅ Hello查询成功！\n响应: ${result.data.hello}`);
      } else {
        setTestResult(`❓ Hello查询意外响应:\n${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Hello查询错误:', error);
      setTestResult(`❌ Hello查询失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testModelsQuery = async () => {
    setIsLoading(true);
    setTestResult('测试Models查询...');
    
    try {
      const response = await fetch('https://deepseek.jzq1020814597.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              models {
                id
                object
                owned_by
              }
            }
          `
        })
      });

      const result = await response.json();
      console.log('Models查询响应:', result);

      if (result.errors) {
        setTestResult(`❌ Models查询错误:\n${JSON.stringify(result.errors, null, 2)}`);
      } else if (result.data?.models) {
        setTestResult(`✅ Models查询成功！\n找到 ${result.data.models.length} 个模型:\n${JSON.stringify(result.data.models, null, 2)}`);
      } else {
        setTestResult(`❓ Models查询意外响应:\n${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Models查询错误:', error);
      setTestResult(`❌ Models查询失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">直接API测试</h1>
      
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold">测试按钮</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={testHelloQuery}
            disabled={isLoading}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '测试中...' : '测试Hello查询'}
          </button>
          
          <button
            onClick={testModelsQuery}
            disabled={isLoading}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '测试中...' : '测试Models查询'}
          </button>
          
          <button
            onClick={testDirectGraphQL}
            disabled={isLoading}
            className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '测试中...' : '测试Chat变更'}
          </button>
        </div>
      </div>

      {testResult && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">测试结果</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-auto max-h-96 font-mono">
            {testResult}
          </pre>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">使用说明</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>1. 测试Hello查询:</strong> 验证基本的GraphQL连接是否正常</p>
          <p><strong>2. 测试Models查询:</strong> 检查是否能获取到可用的AI模型列表</p>
          <p><strong>3. 测试Chat变更:</strong> 尝试发送最简单的聊天请求</p>
          <p><strong>调试提示:</strong> 打开浏览器开发者工具的Console和Network标签查看详细信息</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 调试步骤</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
          <li>先测试Hello查询，确认基本连接</li>
          <li>再测试Models查询，确认GraphQL查询功能</li>
          <li>最后测试Chat变更，定位具体问题</li>
          <li>查看浏览器控制台的详细错误信息</li>
          <li>检查Network标签中的实际请求和响应</li>
        </ol>
      </div>
    </div>
  );
};

export default DirectAPITest;