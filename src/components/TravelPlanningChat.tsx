import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Calendar, DollarSign, Plane, LoaderIcon, Info, Star, Clock, Navigation } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TravelPlanningMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    destinations?: string[];
    travelStyle?: string;
    duration?: number;
    budget?: string;
  };
}

interface TravelRouteResult {
  route: Array<{
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
  }>;
  totalDistance: number;
  totalDuration: number;
  estimatedBudget: string;
  bestTravelTime: string;
  tips: string[];
}

const TravelPlanningChat: React.FC = () => {
  const [messages, setMessages] = useState<TravelPlanningMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '🗺️ 你好！我是您的专属旅游规划助手！✈️\n\n我可以帮您：\n- 🎯 规划多城市旅游路线\n- 💰 根据预算推荐旅行方案\n- 🏛️ 推荐必游景点和活动\n- 🚗 安排最优交通路线\n- 📅 制定详细行程计划\n\n请告诉我您想去的地方，我会为您量身定制完美的旅行计划！',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [quickActions, setQuickActions] = useState([
    '🇪🇺 欧洲三国游（法国-意大利-西班牙）',
    '🇯🇵 日本深度游（东京-京都-大阪）',
    '🇺🇸 美国西海岸（洛杉矶-旧金山-西雅图）',
    '🇨🇳 中国古都游（北京-西安-南京）',
    '🌴 东南亚海岛游（泰国-马来西亚-新加坡）',
    '🏔️ 瑞士阿尔卑斯山区游'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [travelForm, setTravelForm] = useState({
    destinations: '',
    travelStyle: 'comfort',
    duration: 7,
    startLocation: ''
  });
  const [showForm, setShowForm] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callTravelAPI = async (prompt: string, useForm: boolean = false) => {
    try {
      const apiUrl = import.meta.env.VITE_MASTRA_API_URL || 'https://your-mastra-api-url.com';
      
      let requestBody;
      
      if (useForm) {
        // 使用表单数据直接调用工具
        const destinations = travelForm.destinations.split(/[,，、]/).map(d => d.trim()).filter(d => d);
        requestBody = {
          tool: 'travelRouteTool',
          input: {
            destinations,
            travelStyle: travelForm.travelStyle,
            duration: travelForm.duration,
            startLocation: travelForm.startLocation || undefined
          }
        };
      } else {
        // 使用对话模式
        requestBody = {
          agent: 'travelRouteAgent',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        };
      }

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API调用失败:', error);
      throw error;
    }
  };

  const formatTravelRoute = (routeData: TravelRouteResult): string => {
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
  };

  const handleSubmit = async (e: React.FormEvent, useFormData: boolean = false) => {
    e.preventDefault();
    
    let messageContent = currentMessage.trim();
    let metadata: any = {};
    
    if (useFormData) {
      const destinations = travelForm.destinations.split(/[,，、]/).map(d => d.trim()).filter(d => d);
      if (destinations.length === 0) {
        alert('请至少输入一个目的地');
        return;
      }
      
      messageContent = `请为我规划一个旅游路线：\n目的地：${destinations.join(', ')}\n旅行风格：${travelForm.travelStyle}\n总天数：${travelForm.duration}天${travelForm.startLocation ? '\n出发地：' + travelForm.startLocation : ''}`;
      metadata = {
        destinations,
        travelStyle: travelForm.travelStyle,
        duration: travelForm.duration
      };
    }
    
    if (!messageContent) return;

    const userMessage: TravelPlanningMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      metadata
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const response = await callTravelAPI(messageContent, useFormData);
      
      let assistantContent = '';
      
      if (response.toolResults && response.toolResults.length > 0) {
        // 处理工具调用结果
        const toolResult = response.toolResults[0].result;
        assistantContent = formatTravelRoute(toolResult);
      } else if (response.content) {
        // 处理普通对话结果
        assistantContent = response.content;
      } else {
        assistantContent = '抱歉，我暂时无法为您规划旅游路线。请稍后再试或提供更具体的信息。';
      }

      const assistantMessage: TravelPlanningMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (useFormData) {
        setShowForm(false);
        setTravelForm({
          destinations: '',
          travelStyle: 'comfort',
          duration: 7,
          startLocation: ''
        });
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage: TravelPlanningMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '🚫 抱歉，旅游规划服务暂时不可用。请检查网络连接或稍后再试。\n\n您也可以尝试：\n- 描述更具体的旅游需求\n- 使用快捷选项开始对话\n- 重新发送您的消息',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
  };

  const getTravelStyleIcon = (style: string) => {
    switch (style) {
      case 'budget': return '🎒';
      case 'comfort': return '🏨';
      case 'luxury': return '💎';
      default: return '🏨';
    }
  };

  const getTravelStyleText = (style: string) => {
    switch (style) {
      case 'budget': return '经济型';
      case 'comfort': return '舒适型';
      case 'luxury': return '奢华型';
      default: return '舒适型';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">🗺️ 旅游规划助手</h1>
                <p className="text-sm text-gray-600">为您量身定制完美旅行计划</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>快速规划</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Planning Form */}
      {showForm && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    目的地（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={travelForm.destinations}
                    onChange={(e) => setTravelForm({...travelForm, destinations: e.target.value})}
                    placeholder="例如：巴黎, 伦敦, 罗马"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Plane className="w-4 h-4 inline mr-1" />
                    出发地（可选）
                  </label>
                  <input
                    type="text"
                    value={travelForm.startLocation}
                    onChange={(e) => setTravelForm({...travelForm, startLocation: e.target.value})}
                    placeholder="例如：北京"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    旅行风格
                  </label>
                  <select
                    value={travelForm.travelStyle}
                    onChange={(e) => setTravelForm({...travelForm, travelStyle: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="budget">🎒 经济型 (¥200-300/天)</option>
                    <option value="comfort">🏨 舒适型 (¥500-800/天)</option>
                    <option value="luxury">💎 奢华型 (¥1200-2600/天)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    旅行天数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={travelForm.duration}
                    onChange={(e) => setTravelForm({...travelForm, duration: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>开始规划</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4 shadow-sm`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">旅游规划助手</span>
                  </div>
                )}
                {message.metadata && message.type === 'user' && (
                  <div className="mb-3 p-3 bg-white/20 rounded-lg">
                    <div className="flex flex-wrap gap-2 text-sm">
                      {message.metadata.destinations && (
                        <span className="bg-white/30 px-2 py-1 rounded">
                          📍 {message.metadata.destinations.join(', ')}
                        </span>
                      )}
                      {message.metadata.travelStyle && (
                        <span className="bg-white/30 px-2 py-1 rounded">
                          {getTravelStyleIcon(message.metadata.travelStyle)} {getTravelStyleText(message.metadata.travelStyle)}
                        </span>
                      )}
                      {message.metadata.duration && (
                        <span className="bg-white/30 px-2 py-1 rounded">
                          ⏰ {message.metadata.duration}天
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className={`prose prose-sm max-w-none ${message.type === 'user' ? 'prose-invert' : ''}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'} mt-2`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isStreaming && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">旅游规划助手</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LoaderIcon className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-gray-600">正在为您规划专属旅游路线...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">快速开始</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={(e) => handleSubmit(e, false)} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="输入您的旅游需求，例如：我想去日本旅游7天，预算充足..."
                disabled={isLoading}
                className="w-full p-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !currentMessage.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanningChat;
