/**
 * 旅游规划 API 服务
 * 参考 mastraClient.ts 的实现方式，使用正确的 Mastra 客户端调用
 */

import { MastraClient } from '@mastra/client-js';

export interface TravelRouteRequest {
  destinations: string[];
  travelStyle?: 'budget' | 'comfort' | 'luxury';
  duration?: number;
  startLocation?: string;
}

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
}

export interface TravelRouteResponse {
  route: TravelDestination[];
  totalDistance: number;
  totalDuration: number;
  estimatedBudget: string;
  bestTravelTime: string;
  tips: string[];
}

export interface TravelAgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TravelChatRequest {
  messages: TravelAgentMessage[];
}

export interface TravelChatResponse {
  content: string;
  toolResults?: Array<{
    toolId: string;
    result: TravelRouteResponse;
  }>;
}

class TravelAPIService {
  private mastraClient: MastraClient;
  private baseUrl: string;
  private agentId = 'travelRouteAgent';
  private usingFallback: boolean = false;
  
  constructor() {
    // 从环境变量获取 API 地址
    this.baseUrl = import.meta.env.VITE_RECODE_AGENT_API_URL || 
                   import.meta.env.VITE_MASTRA_API_URL || 
                   'https://agent.juzhiqiang.shop';
    
    try {
      // 初始化 Mastra 客户端 - 参考 mastraClient.ts 的方式
      this.mastraClient = new MastraClient({
        baseUrl: this.baseUrl,
        retries: 3,
        backoffMs: 300,
        maxBackoffMs: 5000,
      });
      console.log('Mastra client initialized with baseUrl:', this.baseUrl);
    } catch (error) {
      console.warn('Failed to initialize MastraClient, using fallback', error);
      this.usingFallback = true;
    }
  }

  /**
   * 通过旅游 agent 进行对话
   * 参考 mastraClient.ts 中 ContractReviewClient.reviewContract 的实现
   */
  async chatWithTravelAgent(request: TravelChatRequest): Promise<TravelChatResponse> {
    try {
      console.log('Calling travel agent with request:', request);
      
      if (this.usingFallback) {
        return {
          content: this.createMockTravelPlan(request.messages[request.messages.length - 1].content)
        };
      }
      
      // 构建消息 - 参考 mastraClient.ts 的消息格式
      const messages = [
        {
          role: 'user' as const,
          content: request.messages[request.messages.length - 1].content
        }
      ];

      // 获取代理实例并生成响应 - 参考 mastraClient.ts 的实现
      const agent = this.mastraClient.getAgent(this.agentId);
      const response = await agent.generate({
        messages,
        temperature: 0.7, // 旅游规划需要一定的创造性
      });

      console.log('Agent response:', response);
      
      return {
        content: response?.content || response?.message || '旅游规划完成',
        toolResults: response?.toolResults
      };
    } catch (error) {
      console.error('Travel agent chat error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 流式旅游规划对话
   * 参考 mastraClient.ts 中 reviewContractStream 的实现
   */
  async chatWithTravelAgentStream(
    request: TravelChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      console.log('Starting travel agent stream with request:', request);
      
      if (this.usingFallback) {
        const mockResponse = this.createMockTravelPlan(request.messages[request.messages.length - 1].content);
        // 模拟流式响应
        let index = 0;
        const words = mockResponse.split(' ');
        const interval = setInterval(() => {
          if (index < words.length) {
            onChunk(words[index] + ' ');
            index++;
          } else {
            clearInterval(interval);
            onComplete(mockResponse);
          }
        }, 50);
        return;
      }

      // 构建消息
      const messages = [
        {
          role: 'user' as const,
          content: request.messages[request.messages.length - 1].content
        }
      ];

      let fullResponse = '';

      // 获取代理实例并生成流式响应
      const agent = this.mastraClient.getAgent(this.agentId);
      const stream = await agent.stream({
        messages,
        temperature: 0.7,
      });

      // 处理流式响应 - 参考 mastraClient.ts 的流式处理逻辑
      if (stream && stream.body) {
        const reader = stream.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            // 处理chunk数据
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (!line.trim()) continue;
              
              console.log('Processing line:', line);
              
              // 处理标准SSE格式：data: {...}
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data?.content || data?.delta?.content || '';

                  if (content) {
                    fullResponse += content;
                    onChunk(content);
                  }
                } catch (parseError) {
                  console.warn('Parse SSE data error:', parseError);
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
                    }
                  }
                } catch (parseError) {
                  console.warn('Parse numbered format error:', parseError);
                }
              }
              // 处理控制信息：f:{...}, e:{...}, d:{...}
              else if (line.match(/^[a-z]:\{.*\}/)) {
                try {
                  const prefix = line.charAt(0);
                  const jsonStr = line.slice(2);
                  const data = JSON.parse(jsonStr);
                  
                  if (prefix === 'e') {
                    console.log('Stream finished:', data);
                  } else if (prefix === 'f') {
                    console.log('Stream started:', data);
                  }
                } catch (parseError) {
                  console.warn('Parse control message error:', parseError);
                }
              }
              // 尝试直接解析为JSON
              else {
                try {
                  const data = JSON.parse(line);
                  const content = data?.content || data?.delta?.content || '';
                  
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

          console.log('Stream complete. Full response:', fullResponse);
          onComplete(fullResponse);
        } finally {
          reader.releaseLock();
        }
      } else {
        // 如果没有流式响应，回退到普通模式
        console.log('No stream body, falling back to regular mode');
        const response = await this.chatWithTravelAgent(request);
        fullResponse = response.content;
        onChunk(response.content);
        onComplete(fullResponse);
      }
    } catch (error) {
      console.error('Travel agent stream error:', error);
      
      // 如果流式调用失败，尝试回退到普通模式
      try {
        console.log('Stream failed, trying fallback...');
        const response = await this.chatWithTravelAgent(request);
        onChunk(response.content);
        onComplete(response.content);
      } catch (fallbackError) {
        onError(error instanceof Error ? error : new Error('旅游规划流失败'));
      }
    }
  }

  /**
   * 直接调用旅游路线规划工具
   * 如果有专门的工具，可以通过 agent 来调用
   */
  async planTravelRoute(request: TravelRouteRequest): Promise<TravelRouteResponse> {
    try {
      console.log('Planning travel route with request:', request);
      
      if (this.usingFallback) {
        return this.createMockTravelRoute(request);
      }
      
      // 将结构化请求转换为自然语言prompt
      const prompt = this.convertRequestToPrompt(request);
      
      // 通过 agent 生成路线规划
      const response = await this.chatWithTravelAgent({
        messages: [{ role: 'user', content: prompt }]
      });

      // 尝试解析响应中的结构化数据，如果没有则创建模拟数据
      try {
        // 如果响应包含结构化数据，尝试解析
        if (response.toolResults && response.toolResults.length > 0) {
          return response.toolResults[0].result;
        }
        
        // 否则基于文本响应创建结构化数据
        return this.parseTextResponseToRoute(response.content, request);
      } catch (parseError) {
        console.warn('Failed to parse route response, using mock data:', parseError);
        return this.createMockTravelRoute(request);
      }
    } catch (error) {
      console.error('Travel route planning error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 通用的智能旅游规划接口
   */
  async smartTravelPlanning(input: string | TravelRouteRequest): Promise<TravelChatResponse> {
    try {
      if (typeof input === 'string') {
        // 文本输入，使用 agent 对话
        return await this.chatWithTravelAgent({
          messages: [{ role: 'user', content: input }]
        });
      } else {
        // 结构化输入，转换为自然语言然后调用 agent
        const prompt = this.convertRequestToPrompt(input);
        return await this.chatWithTravelAgent({
          messages: [{ role: 'user', content: prompt }]
        });
      }
    } catch (error) {
      console.error('Smart travel planning error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 将结构化请求转换为自然语言prompt
   */
  private convertRequestToPrompt(request: TravelRouteRequest): string {
    const { destinations, travelStyle, duration, startLocation } = request;
    
    let prompt = `请为我规划一个详细的旅游路线：\n\n`;
    prompt += `目的地：${destinations.join(', ')}\n`;
    prompt += `旅行风格：${this.formatTravelStyleText(travelStyle || 'comfort')}\n`;
    prompt += `总天数：${duration || 7}天\n`;
    if (startLocation) {
      prompt += `出发地：${startLocation}\n`;
    }
    
    prompt += `\n请提供详细的行程安排，包括：\n`;
    prompt += `- 每个目的地的推荐天数\n`;
    prompt += `- 必游景点推荐\n`;
    prompt += `- 交通方式建议\n`;
    prompt += `- 预算估算\n`;
    prompt += `- 最佳旅行时间\n`;
    prompt += `- 实用旅行贴士\n`;
    
    return prompt;
  }

  /**
   * 解析文本响应为路线数据
   */
  private parseTextResponseToRoute(textResponse: string, request: TravelRouteRequest): TravelRouteResponse {
    // 这里可以添加更复杂的文本解析逻辑
    // 目前先返回基于请求的模拟数据，并包含AI响应的文本
    const mockRoute = this.createMockTravelRoute(request);
    
    // 将AI响应添加到tips中
    mockRoute.tips.unshift(`AI 推荐：${textResponse.substring(0, 200)}...`);
    
    return mockRoute;
  }

  /**
   * 创建模拟的旅游路线（用于 fallback）
   */
  private createMockTravelRoute(request: TravelRouteRequest): TravelRouteResponse {
    const destinations = request.destinations || ['未知目的地'];
    const duration = request.duration || 7;
    const style = request.travelStyle || 'comfort';
    
    const route: TravelDestination[] = destinations.map((dest, index) => ({
      name: dest,
      latitude: 0,
      longitude: 0,
      country: '未知',
      order: index + 1,
      recommendedDays: Math.ceil(duration / destinations.length),
      attractions: [`${dest}的著名景点1`, `${dest}的著名景点2`, `${dest}的著名景点3`],
      transportation: style === 'luxury' ? '头等舱' : style === 'budget' ? '公共交通' : '高铁',
      estimatedCost: this.getEstimatedCostByStyle(style),
      description: `${dest}是一个美丽的旅游目的地，拥有丰富的文化和自然景观。`
    }));
    
    return {
      route,
      totalDistance: destinations.length * 500,
      totalDuration: duration,
      estimatedBudget: this.getEstimatedBudgetByStyle(style, duration),
      bestTravelTime: '春秋两季',
      tips: [
        '提前预订住宿和交通工具可以获得更好的价格',
        '建议购买旅行保险',
        '准备好相关证件和签证',
        '了解当地的文化和习俗'
      ]
    };
  }

  /**
   * 创建模拟的旅游规划文本
   */
  private createMockTravelPlan(input: string): string {
    return `# 🗺️ 您的旅游规划

基于您的需求："${input}"

由于当前使用模拟模式，这里提供一个基础的旅游建议：

## 📋 规划建议

1. **确定目的地**: 根据您的兴趣选择合适的目的地
2. **制定预算**: 根据旅行风格估算费用
3. **安排时间**: 合理分配各个景点的游览时间
4. **预订服务**: 提前预订机票、酒店等服务

## 💡 实用建议

- 📱 下载相关的旅行APP
- 🗺️ 准备离线地图
- 💰 了解当地消费水平
- 🎒 准备合适的行李

请稍后重试，或联系技术支持获得完整的智能旅游规划服务。`;
  }

  private getEstimatedCostByStyle(style: string): string {
    switch (style) {
      case 'budget': return '¥200-300/天';
      case 'comfort': return '¥500-800/天';
      case 'luxury': return '¥1200-2600/天';
      default: return '¥500-800/天';
    }
  }

  private getEstimatedBudgetByStyle(style: string, duration: number): string {
    const costMap = {
      'budget': [200, 300],
      'comfort': [500, 800],
      'luxury': [1200, 2600]
    };
    
    const [min, max] = costMap[style as keyof typeof costMap] || costMap.comfort;
    return `¥${min * duration} - ¥${max * duration}`;
  }

  /**
   * 格式化旅游路线为文本
   */
  private formatTravelRouteToText(routeData: TravelRouteResponse): string {
    let formatted = `# 🗺️ 您的专属旅游路线规划\n\n`;
    
    // 路线概览
    formatted += `## 📋 行程概览\n\n`;
    formatted += `🎯 **目的地**: ${routeData.route.map(r => r.name).join(' → ')}\n`;
    formatted += `⏰ **总天数**: ${routeData.totalDuration}天\n`;
    formatted += `🛣️ **总距离**: ${routeData.totalDistance}公里\n`;
    formatted += `💰 **预算范围**: ${routeData.estimatedBudget}\n`;
    formatted += `🌟 **最佳时间**: ${routeData.bestTravelTime}\n\n`;

    // 详细路线
    formatted += `## 🛤️ 详细路线安排\n\n`;
    
    routeData.route.forEach((destination, index) => {
      formatted += `### 📍 第${destination.order}站：${destination.name}\n\n`;
      formatted += `**📍 位置**: ${destination.country}${destination.region ? ', ' + destination.region : ''}\n`;
      formatted += `**⏱️ 建议停留**: ${destination.recommendedDays}天\n`;
      formatted += `**🚗 交通方式**: ${destination.transportation}\n`;
      formatted += `**💵 预估花费**: ${destination.estimatedCost}\n\n`;
      
      formatted += `**🎯 必游景点**:\n`;
      destination.attractions.forEach(attraction => {
        formatted += `- ${attraction}\n`;
      });
      formatted += `\n`;
      
      formatted += `**📝 目的地介绍**: ${destination.description}\n\n`;
      
      if (index < routeData.route.length - 1) {
        formatted += `---\n\n`;
      }
    });

    // 旅行贴士
    if (routeData.tips.length > 0) {
      formatted += `## 💡 实用旅行贴士\n\n`;
      routeData.tips.forEach(tip => {
        formatted += `- ${tip}\n`;
      });
    }

    return formatted;
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

  /**
   * 创建错误回退响应
   */
  private createFallbackError(originalError: any): Error {
    const errorMessage = originalError instanceof Error ? originalError.message : '未知错误';
    
    console.error('Original error:', originalError);
    
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return new Error('🌐 网络连接错误，请检查网络设置或稍后再试');
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return new Error('🔍 旅游规划服务暂时不可用，请稍后再试');
    } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server')) {
      return new Error('⚠️ 服务器内部错误，请稍后再试');
    } else if (errorMessage.includes('timeout')) {
      return new Error('⏱️ 请求超时，请稍后再试');
    } else {
      return new Error(`🚫 旅游规划服务遇到问题：${errorMessage}`);
    }
  }

  /**
   * 检查服务健康状态
   * 参考 mastraClient.ts 中 checkConnection 的实现
   */
  async checkHealth(): Promise<boolean> {
    try {
      if (this.usingFallback) {
        return false;
      }
      
      // 获取代理实例并发送测试消息来检查连接
      const agent = this.mastraClient.getAgent(this.agentId);

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

      return true;
    } catch (error) {
      console.warn('Travel API health check failed:', error);
      return false;
    }
  }

  /**
   * 获取支持的目的地列表
   */
  async getSupportedDestinations(): Promise<string[]> {
    // 返回默认支持的目的地列表
    return [
      '巴黎', '伦敦', '罗马', '巴塞罗那', '阿姆斯特丹', '布鲁塞尔',
      '东京', '京都', '大阪', '首尔', '新加坡', '曼谷',
      '纽约', '洛杉矶', '旧金山', '芝加哥', '多伦多',
      '北京', '上海', '广州', '西安', '成都', '杭州'
    ];
  }

  /**
   * 测试 API 连接
   * 参考 mastraClient.ts 中 testAgent 的实现
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log(`Testing Mastra connection to: ${this.baseUrl}`);
      
      if (this.usingFallback) {
        return {
          success: false,
          message: '⚠️ 使用回退模式，Mastra 客户端初始化失败',
          details: { 
            baseUrl: this.baseUrl,
            usingFallback: true,
            error: 'Failed to initialize MastraClient'
          }
        };
      }
      
      // 获取代理实例并发送测试消息
      const agent = this.mastraClient.getAgent(this.agentId);
      const response = await agent.generate({
        messages: [
          {
            role: 'user' as const,
            content: '你好，这是一个连接测试',
          },
        ],
        temperature: 0.1,
      });
      
      console.log('Connection test response:', response);
      
      return {
        success: true,
        message: '✅ Mastra API 连接正常，旅游规划 Agent 可用',
        details: { 
          baseUrl: this.baseUrl, 
          agentId: this.agentId,
          response: response?.content || response?.message
        }
      };
    } catch (error) {
      console.error('Mastra connection test failed:', error);
      return {
        success: false,
        message: `❌ 无法连接到 Mastra API: ${error instanceof Error ? error.message : '未知错误'}`,
        details: { 
          error: error instanceof Error ? error.message : error, 
          baseUrl: this.baseUrl,
          agentId: this.agentId,
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      };
    }
  }

  /**
   * 获取可用的 Agents 列表
   * 参考 mastraClient.ts 中 getAvailableAgents 的实现
   */
  async getAvailableAgents(): Promise<any[]> {
    try {
      if (this.usingFallback) {
        return [{ id: 'fallback', name: 'Fallback Agent' }];
      }
      
      // 目前返回已知的代理ID
      const agents = [
        { id: this.agentId, name: 'Travel Route Agent', status: 'active' },
        { id: 'contractAuditAgent', name: 'Contract Audit Agent', status: 'active' }
      ];
      
      console.log('Available agents:', agents);
      return agents;
    } catch (error) {
      console.error('Failed to get agents:', error);
      return [];
    }
  }

  /**
   * 获取可用的工具列表
   */
  async getAvailableTools(): Promise<any[]> {
    try {
      if (this.usingFallback) {
        return [{ id: 'fallback', name: 'Fallback Tool' }];
      }
      
      // 返回预定义的工具列表
      const tools = [
        { id: 'travelRouteTool', name: 'Travel Route Planning Tool', status: 'active' },
        { id: 'budgetCalculatorTool', name: 'Budget Calculator Tool', status: 'active' }
      ];
      
      console.log('Available tools:', tools);
      return tools;
    } catch (error) {
      console.error('Failed to get tools:', error);
      return [];
    }
  }

  /**
   * 获取可用的工作流列表
   */
  async getAvailableWorkflows(): Promise<any[]> {
    try {
      if (this.usingFallback) {
        return [{ id: 'fallback', name: 'Fallback Workflow' }];
      }
      
      // 返回预定义的工作流列表
      const workflows = [
        { id: 'travelRouteWorkflow', name: 'Travel Route Planning Workflow', status: 'active' },
        { id: 'contractReviewWorkflow', name: 'Contract Review Workflow', status: 'active' }
      ];
      
      console.log('Available workflows:', workflows);
      return workflows;
    } catch (error) {
      console.error('Failed to get workflows:', error);
      return [];
    }
  }
}

// 导出单例实例
export const travelAPIService = new TravelAPIService();

// 导出工具函数
export const formatTravelStyle = (style: string): string => {
  const styleMap = {
    'budget': '🎒 经济型',
    'comfort': '🏨 舒适型',
    'luxury': '💎 奢华型'
  };
  return styleMap[style as keyof typeof styleMap] || '🏨 舒适型';
};

export const formatTravelStyleIcon = (style: string): string => {
  const iconMap = {
    'budget': '🎒',
    'comfort': '🏨',
    'luxury': '💎'
  };
  return iconMap[style as keyof typeof iconMap] || '🏨';
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
  
  return errors;
};
