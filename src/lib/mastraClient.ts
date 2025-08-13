import { MastraClient } from '@mastra/client-js';

// Mastra客户端配置接口
interface MastraClientConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

// 环境变量配置
const getBaseUrl = (): string => {
  // 优先使用环境变量，否则使用默认值
  return process.env.REACT_APP_MASTRA_BASE_URL || 'https://agent.juzhiqiang.shop';
};

// 创建Mastra客户端实例
export const mastraClient = new MastraClient({
  baseUrl: getBaseUrl(),
});

// 合同审查客户端类
export class ContractReviewClient {
  private client: MastraClient;
  private agentId = 'contractAuditAgent';

  constructor(config?: Partial<MastraClientConfig>) {
    const baseUrl = config?.baseUrl || getBaseUrl();
    
    this.client = new MastraClient({
      baseUrl,
      ...config,
    });
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

      // 使用新的Mastra客户端API
      const response = await this.client.workflows.run({
        workflowId: 'contract-review-workflow',
        input: {
          messages,
          agentId: this.agentId,
          temperature: 0.1, // 较低的温度确保审核结果的一致性
        },
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

      let fullResponse = '';

      // 使用Mastra客户端的流式API
      await this.client.workflows.stream({
        workflowId: 'contract-review-workflow',
        input: {
          messages,
          agentId: this.agentId,
          temperature: 0.1,
        },
        onData: (chunk: any) => {
          const content = chunk?.content || chunk?.delta?.content || '';
          if (content) {
            fullResponse += content;
            onChunk(content);
          }
        },
        onComplete: () => {
          onComplete(fullResponse);
        },
        onError: (error: Error) => {
          onError(error);
        },
      });
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
      // 使用健康检查API
      await this.client.health.check();
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
      // 使用Mastra客户端获取代理列表
      const response = await this.client.agents.list();
      
      return {
        success: true,
        agents: response.data?.map((agent: any) => agent.id) || ['contractAuditAgent'],
      };
    } catch (error) {
      console.error('Get agents error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取代理列表失败',
      };
    }
  }

  /**
   * 获取工作流执行历史
   * @returns 执行历史
   */
  async getWorkflowHistory(): Promise<{
    success: boolean;
    history?: any[];
    error?: string;
  }> {
    try {
      const response = await this.client.workflows.list({
        workflowId: 'contract-review-workflow',
      });

      return {
        success: true,
        history: response.data || [],
      };
    } catch (error) {
      console.error('Get workflow history error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取工作流历史失败',
      };
    }
  }
}

// 导出客户端实例
export const contractReviewClient = new ContractReviewClient();

// 导出默认客户端
export default mastraClient;

// 导出类型
export type { MastraClientConfig };
