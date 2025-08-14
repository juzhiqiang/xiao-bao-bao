/**
 * 旅游规划 API 服务
 * 与 recodeAgent 项目中的旅游 agent 进行交互
 */

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
  private baseUrl: string;
  
  constructor() {
    // 从环境变量获取 recodeAgent API 地址
    this.baseUrl = import.meta.env.VITE_RECODE_AGENT_API_URL || 
                   import.meta.env.VITE_MASTRA_API_URL || 
                   'https://agent.juzhiqiang.shop';
  }

  /**
   * 直接调用旅游路线规划工具
   * 使用正确的 Mastra 工具调用格式
   */
  async planTravelRoute(request: TravelRouteRequest): Promise<TravelRouteResponse> {
    try {
      // 使用 Mastra 工具调用格式
      const response = await fetch(`${this.baseUrl}/api/tools/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          toolId: 'travelRouteTool',
          input: request
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || data;
    } catch (error) {
      console.error('Travel route planning API error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 通过旅游 agent 进行对话
   * 使用正确的 Mastra agent 调用格式
   */
  async chatWithTravelAgent(request: TravelChatRequest): Promise<TravelChatResponse> {
    try {
      // 使用 Mastra agent 调用格式
      const response = await fetch(`${this.baseUrl}/api/agents/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          agentId: 'travelRouteAgent',
          messages: request.messages
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content || data.text || '规划完成',
        toolResults: data.toolResults
      };
    } catch (error) {
      console.error('Travel agent chat API error:', error);
      throw this.createFallbackError(error);
    }
  }

  /**
   * 执行旅游规划工作流
   * 使用正确的 Mastra 工作流调用格式
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
      // 使用 Mastra 工作流调用格式
      const response = await fetch(`${this.baseUrl}/api/workflows/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          workflowId: 'travelRouteWorkflow',
          input: request
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.result || data;
    } catch (error) {
      console.error('Travel workflow API error:', error);
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
    
    if (errorMessage.includes('fetch')) {
      return new Error('🌐 网络连接错误，请检查网络设置或稍后再试');
    } else if (errorMessage.includes('404')) {
      return new Error('🔍 旅游规划服务暂时不可用，请稍后再试');
    } else if (errorMessage.includes('500')) {
      return new Error('⚠️ 服务器内部错误，请稍后再试');
    } else {
      return new Error(`🚫 旅游规划服务遇到问题：${errorMessage}`);
    }
  }

  /**
   * 检查服务健康状态
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.warn('Travel API health check failed:', error);
      return false;
    }
  }

  /**
   * 获取支持的目的地列表
   */
  async getSupportedDestinations(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/travel/destinations`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.destinations || [];
      }
    } catch (error) {
      console.warn('Failed to fetch supported destinations:', error);
    }

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
   */
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log(`Testing connection to: ${this.baseUrl}`);
      
      // 首先测试基础连接
      const healthResponse = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (healthResponse.ok) {
        return {
          success: true,
          message: '✅ API 连接正常',
          details: { status: healthResponse.status, url: this.baseUrl }
        };
      } else {
        return {
          success: false,
          message: `❌ API 健康检查失败 (${healthResponse.status})`,
          details: { status: healthResponse.status, url: this.baseUrl }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ 无法连接到 API: ${error instanceof Error ? error.message : '未知错误'}`,
        details: { error: error instanceof Error ? error.message : error, url: this.baseUrl }
      };
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
