/**
 * 旅游规划 API 服务
 * 完全参考 mastraClient.ts 的实现方式，使用正确的 Mastra 客户端调用
 */

import { MastraClient } from '@mastra/client-js';

// Mastra客户端配置接口
interface MastraClientConfig {
  baseUrl: string;
  apiKey?: string;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  headers?: Record<string, string>;
}

// 旅游请求接口
export interface TravelRouteRequest {
  destinations: string[];
  travelStyle?: 'budget' | 'comfort' | 'luxury';
  duration?: number;
  startLocation?: string;
  preferences?: string[];
  budget?: number;
}

// 旅游目的地接口
export interface TravelDestination {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  region?: string;
  order: number;
  recommendedDays: number;
  attractions: string[];
  transportation: string;
  estimatedCost: string;
  description: string;
  tips?: string[];
}

// 旅游路线响应接口
export interface TravelRouteResponse {
  route: TravelDestination[];
  totalDistance: number;
  totalDuration: number;
  estimatedBudget: string;
  bestTravelTime: string;
  tips: string[];
  summary: string;
}

// 旅游消息接口
export interface TravelAgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

// 旅游聊天请求接口
export interface TravelChatRequest {
  messages: TravelAgentMessage[];
  temperature?: number;
}

// 旅游聊天响应接口
export interface TravelChatResponse {
  content: string;
  success: boolean;
  data?: any;
  error?: string;
  toolResults?: Array<{
    toolId: string;
    result: TravelRouteResponse;
  }>;
}

// 环境变量配置 - 参考 mastraClient.ts
const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_MASTRA_BASE_URL || 
         process.env.VITE_MASTRA_API_URL || 
         "https://agent.juzhiqiang.shop";
};

// 旅游规划客户端类 - 完全参考 ContractReviewClient 的实现
export class TravelPlanningClient {
  private client: MastraClient;
  private agentId = "travelRouteAgent";
  
  constructor(config?: Partial<MastraClientConfig>) {
    const baseUrl = config?.baseUrl || getBaseUrl();

    this.client = new MastraClient({
      baseUrl,
      retries: config?.retries || 3,
      backoffMs: config?.backoffMs || 300,
      maxBackoffMs: config?.maxBackoffMs || 5000,
      headers: config?.headers,
    });
    
    console.log('TravelPlanningClient initialized with baseUrl:', baseUrl);
  }

  /**
   * 旅游规划对话 - 参考 reviewContract 方法
   * @param messages 对话消息
   * @param temperature 温度参数（默认0.7，旅游规划需要一定创造性）
   * @returns 规划结果
   */
  async planTravel(
    messages: TravelAgentMessage[],
    temperature: number = 0.7
  ): Promise<TravelChatResponse> {
    try {
      // 构建消息 - 参考 mastraClient.ts 的消息格式
      const formattedMessages = messages.map(msg => ({
        role: msg.role as const,
        content: msg.content,
      }));

      // 获取代理实例并生成响应 - 参考 mastraClient.ts 的实现
      const agent = this.client.getAgent(this.agentId);
      const response = await agent.generate({
        messages: formattedMessages,
        temperature,
      });

      return {
        success: true,
        content: response?.content || response?.message || "旅游规划完成",
        data: response,
      };
    } catch (error) {
      console.error("Travel planning error:", error);
      return {
        success: false,
        content: "",
        error: error instanceof Error ? error.message : "旅游规划失败，请稍后重试",
      };
    }
  }

  /**
   * 流式旅游规划对话 - 完全参考 reviewContractStream 方法
   * @param messages 对话消息
   * @param temperature 温度参数
   * @param onChunk 流式数据回调
   * @param onComplete 完成回调
   * @param onError 错误回调
   */
  async planTravelStream(
    messages: TravelAgentMessage[],
    temperature: number = 0.7,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // 构建消息
      const formattedMessages = messages.map(msg => ({
        role: msg.role as const,
        content: msg.content,
      }));

      let fullResponse = "";

      // 获取代理实例并生成流式响应
      const agent = this.client.getAgent(this.agentId);
      const stream = await agent.stream({
        messages: formattedMessages,
        temperature,
      });

      // 处理流式响应 - 完全参考 mastraClient.ts 的流式处理逻辑
      if (stream && stream.body) {
        const reader = stream.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            // 处理chunk数据
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\\n");

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
              else if (line.match(/^[a-z]:\\{.*\\}/)) {
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
        const response = await this.planTravel(messages, temperature);
        if (response.success) {
          const content = response.content || "规划完成";
          fullResponse = content;
          onChunk(content);
          onComplete(fullResponse);
        } else {
          onError(new Error(response.error || "规划失败"));
        }
      }
    } catch (error) {
      console.error("Travel planning stream error:", error);
      
      // 如果流式调用失败，尝试回退到普通模式
      try {
        console.log("Stream failed, trying fallback...");
        const response = await this.planTravel(messages, temperature);
        if (response.success) {
          const content = response.content || "规划完成";
          onChunk(content);
          onComplete(content);
        } else {
          onError(new Error(response.error || "规划失败"));
        }
      } catch (fallbackError) {
        onError(error instanceof Error ? error : new Error("旅游规划流失败"));
      }
    }
  }

  /**
   * 结构化旅游路线规划
   * @param request 旅游请求
   * @returns 结构化的旅游路线
   */
  async planTravelRoute(request: TravelRouteRequest): Promise<TravelRouteResponse> {
    try {
      // 将结构化请求转换为自然语言prompt
      const prompt = this.convertRequestToPrompt(request);
      
      // 通过 agent 生成路线规划
      const response = await this.planTravel([
        { role: 'user', content: prompt }
      ]);

      if (!response.success) {
        throw new Error(response.error || "路线规划失败");
      }

      // 尝试解析响应中的结构化数据
      try {
        if (response.data?.toolResults && response.data.toolResults.length > 0) {
          return response.data.toolResults[0].result;
        }
        
        // 否则基于文本响应创建结构化数据
        return this.parseTextResponseToRoute(response.content, request);
      } catch (parseError) {
        console.warn('Failed to parse route response, creating default structure:', parseError);
        return this.createStructuredRouteFromText(response.content, request);
      }
    } catch (error) {
      console.error('Travel route planning error:', error);
      throw error;
    }
  }

  /**
   * 检查Mastra服务连接状态 - 参考 checkConnection 方法
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
   * 获取可用的代理列表 - 参考 getAvailableAgents 方法
   * @returns 代理列表
   */
  async getAvailableAgents(): Promise<{
    success: boolean;
    agents?: string[];
    error?: string;
  }> {
    try {
      // 目前返回已知的代理ID
      return {
        success: true,
        agents: [this.agentId, "contractAuditAgent", "weatherAgent"],
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
   * 获取代理信息 - 参考 getAgentInfo 方法
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
          description: "旅游路线规划智能助手",
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
   * 测试代理功能 - 参考 testAgent 方法
   * @param testMessage 测试消息
   * @returns 测试结果
   */
  async testAgent(testMessage: string = "你好，我想规划一次旅行"): Promise<{
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
        temperature: 0.7,
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

  /**
   * 将结构化请求转换为自然语言prompt
   */
  private convertRequestToPrompt(request: TravelRouteRequest): string {
    const { destinations, travelStyle, duration, startLocation, preferences, budget } = request;
    
    let prompt = `请为我规划一个详细的旅游路线：\\n\\n`;
    prompt += `🎯 目的地：${destinations.join(', ')}\\n`;
    prompt += `🎒 旅行风格：${this.formatTravelStyleText(travelStyle || 'comfort')}\\n`;
    prompt += `⏰ 总天数：${duration || 7}天\\n`;
    
    if (startLocation) {
      prompt += `📍 出发地：${startLocation}\\n`;
    }
    
    if (budget) {
      prompt += `💰 预算：${budget}元\\n`;
    }
    
    if (preferences && preferences.length > 0) {
      prompt += `❤️ 偏好：${preferences.join(', ')}\\n`;
    }
    
    prompt += `\\n请提供详细的行程安排，包括：\\n`;
    prompt += `- 每个目的地的推荐天数和顺序\\n`;
    prompt += `- 必游景点推荐\\n`;
    prompt += `- 交通方式建议\\n`;
    prompt += `- 预算估算\\n`;
    prompt += `- 最佳旅行时间\\n`;
    prompt += `- 实用旅行贴士\\n`;
    prompt += `- 详细的行程安排\\n`;
    
    return prompt;
  }

  /**
   * 解析文本响应为路线数据
   */
  private parseTextResponseToRoute(textResponse: string, request: TravelRouteRequest): TravelRouteResponse {
    return this.createStructuredRouteFromText(textResponse, request);
  }

  /**
   * 从文本创建结构化路线数据
   */
  private createStructuredRouteFromText(textResponse: string, request: TravelRouteRequest): TravelRouteResponse {
    const destinations = request.destinations || ['未知目的地'];
    const duration = request.duration || 7;
    const style = request.travelStyle || 'comfort';
    
    const route: TravelDestination[] = destinations.map((dest, index) => ({
      name: dest,
      latitude: 0,
      longitude: 0,
      country: '待确定',
      order: index + 1,
      recommendedDays: Math.ceil(duration / destinations.length),
      attractions: this.extractAttractionsFromText(textResponse, dest),
      transportation: style === 'luxury' ? '头等舱/高级轿车' : style === 'budget' ? '公共交通' : '高铁/经济舱',
      estimatedCost: this.getEstimatedCostByStyle(style),
      description: this.extractDescriptionFromText(textResponse, dest),
      tips: this.extractTipsFromText(textResponse)
    }));
    
    return {
      route,
      totalDistance: destinations.length * 500, // 估算距离
      totalDuration: duration,
      estimatedBudget: this.getEstimatedBudgetByStyle(style, duration),
      bestTravelTime: this.extractBestTimeFromText(textResponse) || '春秋两季',
      tips: this.extractTipsFromText(textResponse),
      summary: this.extractSummaryFromText(textResponse)
    };
  }

  /**
   * 从文本中提取景点信息
   */
  private extractAttractionsFromText(text: string, destination: string): string[] {
    // 简单的文本解析逻辑，可以根据需要改进
    const defaultAttractions = [`${destination}主要景点1`, `${destination}主要景点2`, `${destination}主要景点3`];
    
    // 尝试从文本中提取景点信息
    const attractionRegex = new RegExp(`${destination}.*?[景点|景区|必游|推荐].*?([\\n。；]|$)`, 'gi');
    const matches = text.match(attractionRegex);
    
    if (matches && matches.length > 0) {
      return matches.slice(0, 3).map(match => match.trim().substring(0, 50));
    }
    
    return defaultAttractions;
  }

  /**
   * 从文本中提取描述信息
   */
  private extractDescriptionFromText(text: string, destination: string): string {
    const lines = text.split('\\n');
    for (const line of lines) {
      if (line.includes(destination) && line.length > 20) {
        return line.trim().substring(0, 200);
      }
    }
    return `${destination}是一个美丽的旅游目的地，值得深度游览。`;
  }

  /**
   * 从文本中提取贴士
   */
  private extractTipsFromText(text: string): string[] {
    const tips: string[] = [];
    const tipPatterns = [/贴士[:：]([^\\n]*)/gi, /建议[:：]([^\\n]*)/gi, /注意[:：]([^\\n]*)/gi];
    
    for (const pattern of tipPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        tips.push(...matches.slice(0, 3).map(match => match.split(/[:：]/)[1]?.trim()));
      }
    }
    
    if (tips.length === 0) {
      return [
        '提前预订住宿和交通可以获得更好的价格',
        '建议购买旅行保险',
        '了解当地的文化和习俗',
        '准备好相关证件和签证'
      ];
    }
    
    return tips.filter(tip => tip && tip.length > 5).slice(0, 5);
  }

  /**
   * 从文本中提取最佳旅行时间
   */
  private extractBestTimeFromText(text: string): string | null {
    const timeRegex = /[最佳|适合|推荐].*?[时间|季节|月份].*?([^\\n。；]*)/gi;
    const match = text.match(timeRegex);
    
    if (match && match[0]) {
      return match[0].trim().substring(0, 50);
    }
    
    return null;
  }

  /**
   * 从文本中提取摘要
   */
  private extractSummaryFromText(text: string): string {
    const lines = text.split('\\n').filter(line => line.trim().length > 10);
    if (lines.length > 0) {
      return lines[0].trim().substring(0, 200);
    }
    return '为您精心规划的旅游路线，包含详细的行程安排和实用建议。';
  }

  /**
   * 根据旅行风格获取估算费用
   */
  private getEstimatedCostByStyle(style: string): string {
    switch (style) {
      case 'budget': return '¥200-400/天';
      case 'comfort': return '¥500-1000/天';
      case 'luxury': return '¥1500-3000/天';
      default: return '¥500-1000/天';
    }
  }

  /**
   * 根据旅行风格和天数获取总预算
   */
  private getEstimatedBudgetByStyle(style: string, duration: number): string {
    const costMap = {
      'budget': [200, 400],
      'comfort': [500, 1000],
      'luxury': [1500, 3000]
    };
    
    const [min, max] = costMap[style as keyof typeof costMap] || costMap.comfort;
    return `¥${min * duration} - ¥${max * duration}`;
  }

  /**
   * 格式化旅行风格文本
   */
  private formatTravelStyleText(style: string): string {
    const styleMap = {
      'budget': '经济型',
      'comfort': '舒适型',
      'luxury': '奢华型'
    };
    return styleMap[style as keyof typeof styleMap] || '舒适型';
  }
}

// 创建 Mastra 客户端实例 - 参考 mastraClient.ts 的导出方式
export const mastraClient = new MastraClient({
  baseUrl: getBaseUrl(),
});

// 导出客户端实例
export const travelPlanningClient = new TravelPlanningClient();

// 导出默认客户端
export default travelPlanningClient;

// 导出类型
export type { MastraClientConfig };

// 便捷函数
export const formatTravelStyle = (style: string): string => {
  const styleMap = {
    'budget': '🎒 经济型',
    'comfort': '🏨 舒适型',
    'luxury': '💎 奢华型'
  };
  return styleMap[style as keyof typeof styleMap] || '🏨 舒适型';
};

export const validateTravelRequest = (request: TravelRouteRequest): string[] => {
  const errors: string[] = [];
  
  if (!request.destinations || request.destinations.length === 0) {
    errors.push('请至少输入一个目的地');
  }
  
  if (request.destinations && request.destinations.length > 10) {
    errors.push('目的地数量不能超过10个');
  }
  
  if (request.duration && (request.duration < 1 || request.duration > 30)) {
    errors.push('旅行天数应在1-30天之间');
  }
  
  if (request.budget && request.budget < 0) {
    errors.push('预算金额不能为负数');
  }
  
  return errors;
};

// 兼容性支持 - 保持与原有API的兼容
export const travelAPIService = travelPlanningClient;
