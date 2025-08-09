import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

const XiaoBaoBaoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是小包包，你的AI助手。有什么我可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了你的消息："${userMessage.content}"。作为小包包AI助手，我会尽力为你提供帮助！这是一个演示回复。`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-center py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              小包包
            </h1>
            <p className="text-sm text-gray-500">AI智能助手</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-green-400 to-blue-500'
                  : 'bg-gradient-to-r from-purple-400 to-pink-500'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                  : 'bg-white shadow-md border border-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div
                className={`text-xs mt-2 ${
                  message.sender === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ));

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white shadow-md border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-white rounded-2xl shadow-lg border border-gray-200/50 p-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你想说的话..."
              className="flex-1 resize-none border-0 outline-none text-gray-800 placeholder-gray-400 bg-transparent min-h-[20px] max-h-32"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '20px'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiaoBaoBaoChat;