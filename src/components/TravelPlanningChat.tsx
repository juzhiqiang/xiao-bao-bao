import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, LoaderIcon, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { travelAPIService } from '../lib/travelAPI';

interface TravelPlanningMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
  const [quickActions] = useState([
    '🇪🇺 欧洲三国游（法国-意大利-西班牙）',
    '🇯🇵 日本深度游（东京-京都-大阪）',
    '🇺🇸 美国西海岸（洛杉矶-旧金山-西雅图）',
    '🇨🇳 中国古都游（北京-西安-南京）',
    '🌴 东南亚海岛游（泰国-马来西亚-新加坡）',
    '🏔️ 瑞士阿尔卑斯山区游'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageContent = currentMessage.trim();
    if (!messageContent) return;

    const userMessage: TravelPlanningMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await travelAPIService.smartTravelPlanning(messageContent);
      
      const assistantMessage: TravelPlanningMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

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
    }
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">🗺️ 旅游规划助手</h1>
              <p className="text-sm text-gray-600">基于 Mastra SDK 的智能旅游规划</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white border border-gray-200'
              } rounded-2xl p-4 shadow-sm`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">旅游规划助手</span>
                  </div>
                )}
                <div className={`prose prose-sm max-w-none ${
                  message.type === 'user' ? 'prose-invert' : ''
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className={`text-xs ${
                  message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                } mt-2`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
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
          <form onSubmit={handleSubmit} className="flex space-x-3">
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