import { MastraClient } from "@mastra/client-js";

// Mastra客户端配置接口
interface MastraClientConfig {
  baseUrl: string;
  apiKey?: string;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  headers?: Record<string, string>;
}

// 环境变量配置
const getBaseUrl = (): string => {
  return "https://agent.juzhiqiang.shop";
};

// 创建Mastra客户端实例
export const mastraClient = new MastraClient({
  baseUrl: getBaseUrl(),
});

// 合同审查客户端类
export class ContractReviewClient {
  private client: MastraClient;
  private agentId = "contractAuditAgent";

  constructor(config?: Partial<MastraClientConfig>) {
    const baseUrl = config?.baseUrl || getBaseUrl();

    this.client = new MastraClient({
      baseUrl,
      retries: config?.retries || 3,
      backoffMs: config?.backoffMs || 300,
      maxBackoffMs: config?.maxBackoffMs || 5000,
      headers: config?.headers,
    });

    this.client.getAgents().then((agents) => {
      console.log("Agents:", agents);
    });

  }


  /**
   * 审核合同内容
   * @param contractContent 合同内容
   * @param contractType 合同类型（可选）
   * @returns 审核结果
   */
  async reviewContract(
    contractContent: string,
    contractType?: string
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // 构建消息
      const messages = [
        {
          role: "user" as const,
          content: `请审核以下${
            contractType ? contractType : ""
          }合同的合规性：\n\n${contractContent}`,
        },
      ];

      // 获取代理实例并生成响应
      const agent = this.client.getAgent(this.agentId);
      const response = await agent.generate({
        messages,
        temperature: 0.1, // 较低的温度确保审核结果的一致性
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Contract review error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "合同审核失败，请稍后重试",
      };
    }
  }

  /**
   * 流式审核合同内容 - 修复版本
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
          role: "user" as const,
          content: `请审核以下${
            contractType ? contractType : ""
          }合同的合规性：\n\n${contractContent}`,
        },
      ];

      let fullResponse = "";

      // 获取代理实例并生成流式响应
      const agent = this.client.getAgent(this.agentId);
      const stream = await agent.stream({
        messages,
        temperature: 0.1,
      });

      // 处理流式响应
      if (stream && stream.body) {
        const reader = stream.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            // 处理chunk数据
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;
              
              // 调试日志
              console.log("Processing line:", line);
              
              // 处理标准SSE格式：data: {...}
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data?.content || data?.delta?.content || "";

                  if (content) {
                    fullResponse += content;
                    onChunk(content);
                  }
                } catch (parseError) {
                  console.warn("Parse SSE data error:", parseError);
                }
              }
              // 处理编号格式：0:"文本"
              else if (line.match(/^[0-9]+:".+"/)) {
                try {
                  const colonIndex = line.indexOf(':');
                  if (colonIndex > 0) {
                    const jsonStr = line.slice(colonIndex + 1);
                    const content = JSON.parse(jsonStr);
                    
                    if (typeof content === 'string') {
                      fullResponse += content;
                      onChunk(content);
                      console.log("Parsed content chunk:", content);
                    }
                  }
                } catch (parseError) {
                  console.warn("Parse numbered format error:", parseError, "Line:", line);
                }
              }
              // 处理控制信息：f:{...}, e:{...}, d:{...}
              else if (line.match(/^[a-z]:\{.*\}/)) {
                try {
                  const prefix = line.charAt(0);
                  const jsonStr = line.slice(2);
                  const data = JSON.parse(jsonStr);
                  
                  if (prefix === 'e') {
                    // 结束信号
                    console.log("Stream finished:", data);
                  } else if (prefix === 'f') {
                    // 开始信号
                    console.log("Stream started:", data);
                  }
                } catch (parseError) {
                  console.warn("Parse control message error:", parseError);
                }
              }
              // 尝试直接解析为JSON
              else {
                try {
                  const data = JSON.parse(line);
                  const content = data?.content || data?.delta?.content || "";
                  
                  if (content) {
                    fullResponse += content;
                    onChunk(content);
                  }
                } catch (parseError) {
                  // 如果不是JSON，可能是纯文本
                  if (line.trim() && !line.includes(':') && line.length > 1) {
                    fullResponse += line;
                    onChunk(line);
                  }
                }
              }
            }
          }

          console.log("Stream complete. Full response:", fullResponse);
          onComplete(fullResponse);
        } finally {
          reader.releaseLock();
        }
      } else {
        // 如果没有流式响应，回退到普通模式
        console.log("No stream body, falling back to regular mode");
        const response = await this.reviewContract(
          contractContent,
          contractType
        );
        if (response.success) {
          const content =
            response.data?.content || response.data?.message || "审核完成";
          fullResponse = content;
          onChunk(content);
          onComplete(fullResponse);
        } else {
          onError(new Error(response.error || "审核失败"));
        }
      }
    } catch (error) {
      console.error("Contract review stream error:", error);
      
      // 如果流式调用失败，尝试回退到普通模式
      try {
        console.log("Stream failed, trying fallback...");
        const response = await this.reviewContract(contractContent, contractType);
        if (response.success) {
          const content = response.data?.content || response.data?.message || "审核完成";
          onChunk(content);
          onComplete(content);
        } else {
          onError(new Error(response.error || "审核失败"));
        }
      } catch (fallbackError) {
        onError(error instanceof Error ? error : new Error("合同审核流失败"));
      }
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
      // 尝试获取代理实例并发送测试消息来检查连接
      const agent = this.client.getAgent(this.agentId);

      // 发送一个简单的测试消息
      await agent.generate({
        messages: [
          {
            role: "user" as const,
            content: "测试连接",
          },
        ],
        temperature: 0.1,
      });

      return { connected: true };
    } catch (error) {
      console.error("Connection check failed:", error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : "无法连接到Mastra服务",
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
      // 目前返回已知的代理ID
      // 注意：实际的Mastra客户端可能没有直接的agents.list()方法
      // 这里我们返回一个预定义的列表
      return {
        success: true,
        agents: [this.agentId, "weatherAgent"],
      };
    } catch (error) {
      console.error("Get agents error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取代理列表失败",
      };
    }
  }

  /**
   * 获取代理信息
   * @param agentId 代理ID
   * @returns 代理信息
   */
  async getAgentInfo(agentId?: string): Promise<{
    success: boolean;
    agent?: any;
    error?: string;
  }> {
    try {
      const targetAgentId = agentId || this.agentId;
      const agent = this.client.getAgent(targetAgentId);

      return {
        success: true,
        agent: {
          id: targetAgentId,
          name: targetAgentId,
          status: "active",
        },
      };
    } catch (error) {
      console.error("Get agent info error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "获取代理信息失败",
      };
    }
  }

  /**
   * 测试代理功能
   * @param testMessage 测试消息
   * @returns 测试结果
   */
  async testAgent(testMessage: string = "你好，这是一个测试消息"): Promise<{
    success: boolean;
    response?: any;
    error?: string;
  }> {
    try {
      const agent = this.client.getAgent(this.agentId);
      const response = await agent.generate({
        messages: [
          {
            role: "user" as const,
            content: testMessage,
          },
        ],
        temperature: 0.1,
      });

      return {
        success: true,
        response,
      };
    } catch (error) {
      console.error("Test agent error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "代理测试失败",
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
