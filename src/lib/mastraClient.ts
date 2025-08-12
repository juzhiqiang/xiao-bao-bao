import { MastraClient } from '@mastra/client-js';

// Mastra客户端配置
interface MastraClientConfig {
  baseUrl: string;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  headers?: Record<string, string>;
}

// 默认配置
const defaultConfig: MastraClientConfig = {
  baseUrl: import.meta.env.VITE_MASTRA_API_URL || 'https://agent.juzhiqiang.shop',
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建Mastra客户端实例
class ContractReviewClient {
  private client: MastraClient;
  private agentId = 'contractAuditAgent';

  constructor(config: Partial<MastraClientConfig> = {}) {
    const finalConfig = { ...defaultConfig, ...config };
    this.client = new MastraClient(finalConfig);
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
   * 流式审核合同内容
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
      // 构建消息
      const messages = [
        {
          role: 'user' as const,
          content: `请审核以下${contractType ? contractType : ''}合同的合规性：\n\n${contractContent}`,
        },
      ];

      // 获取代理实例
      const agent = this.client.getAgent(this.agentId);

      // 流式生成响应
      const stream = await agent.generateStream({
        messages,
        temperature: 0.1,
      });

      let fullResponse = '';

      // 处理流式数据
      for await (const chunk of stream) {
        if (chunk.type === 'text-delta') {
          const text = chunk.textDelta;
          fullResponse += text;
          onChunk(text);
        }
      }

      onComplete(fullResponse);
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
      // 注意：这里假设Mastra客户端有获取代理列表的方法
      // 实际API可能有所不同，需要根据最新的@mastra/client-js文档调整
      
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
