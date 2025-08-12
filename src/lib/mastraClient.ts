// Mastra客户端配置
interface MastraClientConfig {
  baseUrl: string;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  headers?: Record<string, string>;
}

// 模拟 MastraClient 类，直到真正的库可用
class MockMastraClient {
  private config: MastraClientConfig;

  constructor(config: MastraClientConfig) {
    this.config = config;
  }

  getAgent(agentId: string) {
    return new MockAgent(this.config, agentId);
  }
}

// 模拟 Agent 类
class MockAgent {
  private config: MastraClientConfig;
  private agentId: string;

  constructor(config: MastraClientConfig, agentId: string) {
    this.config = config;
    this.agentId = agentId;
  }

  async generate(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    temperature?: number;
  }) {
    // 模拟API调用
    const response = await fetch(`${this.config.baseUrl}/agents/${this.agentId}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

// 默认配置
const defaultConfig: MastraClientConfig = {
  baseUrl: 'https://agent.juzhiqiang.shop',
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建Mastra客户端实例
class ContractReviewClient {
  private client: MockMastraClient;
  private agentId = 'contractAuditAgent';

  constructor(config: Partial<MastraClientConfig> = {}) {
    const finalConfig = { ...defaultConfig, ...config };
    this.client = new MockMastraClient(finalConfig);
  }

  /**
   * 审核合同内容
   * @param contractContent 合同内容
   * @param contractType 合同类型（可选）
   * @returns 审核结果
   */
  async reviewContract(contractContent: string, contractType?: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // 构建消息
      const messages = [
        {
          role: 'user' as const,
          content: `请审核以下${contractType ? contractType : ''}合同的合规性：\n\n${contractContent}`,
        },
      ];

      // 获取代理实例
      const agent = this.client.getAgent(this.agentId);

      // 生成响应
      const response = await agent.generate({
        messages,
        temperature: 0.1, // 较低的温度确保审核结果的一致性
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Contract review error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '合同审核失败，请稍后重试',
      };
    }
  }

  /**
   * 流式审核合同内容（模拟实现）
   * @param contractContent 合同内容
   * @param contractType 合同类型（可选）
   * @param onChunk 流式数据回调
   * @param onComplete 完成回调
   * @param onError 错误回调
   */
  async reviewContractStream(
    contractContent: string,
    contractType: string | undefined,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // 首先获取完整响应
      const result = await this.reviewContract(contractContent, contractType);
      
      if (!result.success) {
        onError(new Error(result.error || '审核失败'));
        return;
      }

      // 模拟流式输出
      const fullResponse = result.data?.content || result.data?.message || '审核完成，但无响应内容。';
      
      // 将响应分割为小块进行流式显示
      const chunks = fullResponse.split('');
      let currentResponse = '';

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        currentResponse += chunk;
        onChunk(chunk);
        
        // 添加小延迟模拟流式效果
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      onComplete(currentResponse);
    } catch (error) {
      console.error('Contract review stream error:', error);
      onError(error instanceof Error ? error : new Error('合同审核流失败'));
    }
  }

  /**
   * 检查Mastra服务连接状态
   * @returns 连接状态
   */
  async checkConnection(): Promise<{
    connected: boolean;
    error?: string;
  }> {
    try {
      // 尝试获取代理信息来检查连接
      const agent = this.client.getAgent(this.agentId);
      
      // 发送一个简单的测试消息
      await agent.generate({
        messages: [
          {
            role: 'user' as const,
            content: '测试连接',
          },
        ],
        temperature: 0.1,
      });

      return { connected: true };
    } catch (error) {
      console.error('Connection check failed:', error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : '无法连接到Mastra服务',
      };
    }
  }

  /**
   * 获取可用的代理列表
   * @returns 代理列表
   */
  async getAvailableAgents(): Promise<{
    success: boolean;
    agents?: string[];
    error?: string;
  }> {
    try {
      // 目前返回已知的代理
      return {
        success: true,
        agents: ['contractAuditAgent', 'weatherAgent'],
      };
    } catch (error) {
      console.error('Get agents error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取代理列表失败',
      };
    }
  }
}

// 导出客户端实例
export const contractReviewClient = new ContractReviewClient();
export { ContractReviewClient };
export type { MastraClientConfig };
