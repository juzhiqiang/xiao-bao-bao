import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

const XiaoBaoBaoChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是小包包 🎯\n\n我是你的智能AI助手，可以帮助你：\n• 回答各种问题\n• 协助创作和写作\n• 提供学习建议\n• 解决日常困扰\n\n有什么我可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions: QuickAction[] = [
    { id: '1', text: '帮我写一段代码', icon: <span className="text-sm">💻</span> },
    { id: '2', text: '推荐一本书', icon: <span className="text-sm">📚</span> },
    { id: '3', text: '解释一个概念', icon: <span className="text-sm">💡</span> },
    { id: '4', text: '翻译一段文字', icon: <span className="text-sm">🌐</span> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // 自动调整textarea高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模拟AI回复的打字效果
    setTimeout(() => {
      const responses = [
        `关于"${messageContent}"，这是一个很好的问题！\n\n让我来为你详细解答：\n\n这个话题涉及多个方面，我可以从不同角度为你分析。你想了解哪个具体方面呢？`,
        `我理解你提到的"${messageContent}"。\n\n🤔 这确实是个有趣的话题！\n\n根据我的理解，我可以为你提供几个建议：\n1. 首先考虑具体需求\n2. 然后分析可行性\n3. 最后制定行动计划\n\n你觉得哪个方面最重要？`,
        `关于"${messageContent}"，我来帮你分析一下：\n\n✨ 这个问题的关键在于理解核心概念\n🎯 然后找到最适合的解决方案\n💪 最后付诸实践\n\n有什么具体的疑问我可以进一步解答的吗？`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.text);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // 这里可以添加toast通知
  };

  const regenerateResponse = (messageId: string) => {
    // 重新生成AI回复的逻辑
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: '这是重新生成的回复内容，会根据上下文提供不同的答案。' }
          : msg
      ));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              小包包
            </h1>
            <p className="text-sm text-slate-500 font-medium">智能AI助手 · 在线</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group flex items-start gap-4 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            <div className="flex-1 max-w-[85%]">
              {/* Message Bubble */}
              <div
                className={`relative rounded-3xl px-5 py-4 shadow-md transition-all duration-200 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white ml-auto rounded-br-lg'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-lg hover:shadow-lg'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap m-0">
                    {message.content}
                  </p>
                </div>
                
                <div
                  className={`text-xs mt-3 flex items-center justify-between ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : 'text-slate-400'
                  }`}
                >
                  <span>
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Message Actions */}
              {message.sender === 'ai' && hoveredMessageId === message.id && (
                <div className="flex items-center gap-2 mt-2 ml-2">
                  <button 
                    onClick={() => copyMessage(message.content)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="复制"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => regenerateResponse(message.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="重新生成"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="点赞">
                    <ThumbsUp className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="点踩">
                    <ThumbsDown className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-3xl rounded-bl-lg px-5 py-4 shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-slate-500 ml-2">小包包正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all duration-200 hover:shadow-md group"
              >
                {action.icon}
                <span className="text-sm text-slate-600 group-hover:text-indigo-600 font-medium">
                  {action.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-4 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-2xl">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="向小包包提问任何问题..."
              className="flex-1 resize-none border-0 outline-none text-slate-800 placeholder-slate-400 bg-transparent min-h-[24px] max-h-[120px] leading-6"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-3">
            <p className="text-xs text-slate-400 text-center">
              小包包可能会产生不准确的信息，请注意核实重要信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiaoBaoBaoChat;