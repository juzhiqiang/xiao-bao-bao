/**
 * 旅游规划 API 服务
 * 使用 @mastra/client-js 与 recodeAgent 项目中的旅游 agent 进行交互
 */

import { Mastra } from '@mastra/client-js';

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
  private mastraClient: Mastra;
  private baseUrl: string;
  
  constructor() {
    // 从环境变量获取 API 地址
    this.baseUrl = import.meta.env.VITE_RECODE_AGENT_API_URL || 
                   import.meta.env.VITE_MASTRA_API_URL || 
                   'https://agent.juzhiqiang.shop';
    
    // 初始化 Mastra 客户端
    this.mastraClient = new Mastra({
      baseUrl: this.baseUrl,
    });
  }

  /**
   * 直接调用旅游路线规划工具
   * 使用 Mastra SDK 调用工具
   */
  async planTravelRoute(request: TravelRouteRequest): Promise<TravelRouteResponse> {
    try {
      console.log('Calling travel route tool with request:', request);
      
      // 使用 Mastra SDK 调用工具
      const result = await this.mastraClient.tools.run({
        toolId: 'travelRouteTool',
        input: request
      });

      console.log('Tool result:', result);
      return result as TravelRouteResponse;
    } catch (error) {
      console.error('Travel route planning tool error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 通过旅游 agent 进行对话
   * 使用 Mastra SDK 调用 agent
   */
  async chatWithTravelAgent(request: TravelChatRequest): Promise<TravelChatResponse> {
    try {
      console.log('Calling travel agent with request:', request);
      
      // 使用 Mastra SDK 调用 agent
      const result = await this.mastraClient.agents.run({
        agentId: 'travelRouteAgent',
        input: request.messages[request.messages.length - 1].content // 获取最后一条用户消息
      });

      console.log('Agent result:', result);
      
      return {
        content: result.text || result.content || '规划完成',
        toolResults: result.toolResults
      };
    } catch (error) {
      console.error('Travel agent chat error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 执行旅游规划工作流
   * 使用 Mastra SDK 调用工作流
   */
  async executeTravelWorkflow(request: TravelRouteRequest): Promise<{
    itinerary: string;
    routeSummary: {
      totalDestinations: number;
      totalDistance: number;
      totalDuration: number;
      estimatedBudget: string;
    };
  }> {
    try {
      console.log('Calling travel workflow with request:', request);
      
      // 使用 Mastra SDK 调用工作流
      const result = await this.mastraClient.workflows.run({
        workflowId: 'travelRouteWorkflow',
        input: request
      });

      console.log('Workflow result:', result);
      return result as any;
    } catch (error) {
      console.error('Travel workflow error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 通用的智能旅游规划接口
   * 会根据输入自动选择最合适的 API
   */
  async smartTravelPlanning(input: string | TravelRouteRequest): Promise<TravelChatResponse> {
    try {
      if (typeof input === 'string') {
        // 文本输入，使用 agent 对话
        return await this.chatWithTravelAgent({
          messages: [{ role: 'user', content: input }]
        });
      } else {
        // 结构化输入，优先尝试工具调用
        try {
          const routeResult = await this.planTravelRoute(input);
          return {
            content: this.formatTravelRouteToText(routeResult),
            toolResults: [{
              toolId: 'travelRouteTool',
              result: routeResult
            }]
          };
        } catch (toolError) {
          // 如果工具调用失败，降级到 agent 对话
          console.warn('Tool call failed, falling back to agent chat:', toolError);
          const fallbackText = `请为我规划一个旅游路线：
目的地：${input.destinations.join(', ')}
旅行风格：${this.formatTravelStyleText(input.travelStyle || 'comfort')}
总天数：${input.duration || 7}天
${input.startLocation ? '出发地：' + input.startLocation : ''}`;
          
          return await this.chatWithTravelAgent({
            messages: [{ role: 'user', content: fallbackText }]
          });
        }
      }
    } catch (error) {
      console.error('Smart travel planning error:', error);
      throw this.createFallbackError(error);
    }
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
   * 使用 Mastra SDK 检查连接
   */
  async checkHealth(): Promise<boolean> {
    try {
      // 尝试获取可用的 agents 列表来测试连接
      const agents = await this.mastraClient.agents.list();
      console.log('Available agents:', agents);
      return true;
    } catch (error) {
      console.warn('Mastra health check failed:', error);
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
   * 使用 Mastra SDK 进行连接测试
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log(`Testing Mastra connection to: ${this.baseUrl}`);
      
      // 尝试获取可用的 agents 列表
      const agents = await this.mastraClient.agents.list();
      console.log('Connection test - Available agents:', agents);
      
      // 检查是否有旅游相关的 agent
      const travelAgent = agents.find((agent: any) => 
        agent.id === 'travelRouteAgent' || agent.name?.includes('travel')
      );
      
      if (travelAgent) {
        return {
          success: true,
          message: '✅ Mastra API 连接正常，已找到旅游规划 Agent',
          details: { 
            baseUrl: this.baseUrl, 
            agentCount: agents.length,
            travelAgent: travelAgent.id || travelAgent.name
          }
        };
      } else {
        return {
          success: false,
          message: '⚠️ Mastra API 连接正常，但未找到旅游规划 Agent',
          details: { 
            baseUrl: this.baseUrl, 
            agentCount: agents.length,
            availableAgents: agents.map((a: any) => a.id || a.name)
          }
        };
      }
    } catch (error) {
      console.error('Mastra connection test failed:', error);
      return {
        success: false,
        message: `❌ 无法连接到 Mastra API: ${error instanceof Error ? error.message : '未知错误'}`,
        details: { 
          error: error instanceof Error ? error.message : error, 
          baseUrl: this.baseUrl,
          errorType: error instanceof Error ? error.constructor.name : typeof error
        }
      };
    }
  }

  /**
   * 获取可用的 Agents 列表
   */
  async getAvailableAgents(): Promise<any[]> {
    try {
      const agents = await this.mastraClient.agents.list();
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
      const tools = await this.mastraClient.tools.list();
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
      const workflows = await this.mastraClient.workflows.list();
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
