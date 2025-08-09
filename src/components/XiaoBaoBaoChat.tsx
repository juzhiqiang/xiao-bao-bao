import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { 
  CHAT_MUTATION, 
  GET_MODELS,
  HELLO_QUERY,
  type ChatMessage as GraphQLChatMessage,
  type ChatInput
} from '../lib/graphql';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  icon: string;
}

const XiaoBaoBaoChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是小包包 🎯\n\n我现在接入了真实的 **DeepSeek AI**，通过 **GraphQL API** 提供服务，支持 Markdown 格式回复，可以为你提供：\n\n• **智能问答** - 回答各种问题和深度对话\n• **代码编程** - 生成、解释和调试代码\n• **创意写作** - 文案、诗歌、故事创作\n• **学习指导** - 概念解释和学习建议\n• **技术支持** - 编程技术和最佳实践\n\n支持的格式包括：\n- 代码高亮 `console.log("Hello World")`\n- **粗体** 和 *斜体* 文字\n- 列表和表格\n- 链接和引用\n\n现在使用 GraphQL 接口，更加高效稳定！✨',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // GraphQL Hooks
  const { data: modelsData, loading: modelsLoading, error: modelsError } = useQuery(GET_MODELS);
  const { data: helloData } = useQuery(HELLO_QUERY);
  const [chatMutation, { loading: chatLoading, error: chatError }] = useMutation(CHAT_MUTATION);

  const isLoading = chatLoading;
  const error = chatError?.message || modelsError?.message || null;

  const quickActions: QuickAction[] = [
    { id: '1', text: '写一个Python快速排序算法', icon: '🐍' },
    { id: '2', text: '解释什么是React Hooks', icon: '⚛️' },
    { id: '3', text: '创建一个Markdown表格示例', icon: '📊' },
    { id: '4', text: '用代码实现斐波那契数列', icon: '🔢' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 使用GraphQL调用DeepSeek API
  const callDeepSeekGraphQL = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      // 构建消息历史（只取最近8条消息以控制token消耗）
      const recentMessages = conversationHistory.slice(-7); // 最近7条 + 当前1条 = 8条
      
      // 转换消息格式，确保字段正确
      const apiMessages: GraphQLChatMessage[] = [];
      
      // 添加历史消息
      recentMessages.forEach(msg => {
        if (msg.sender === 'ai') {
          // 跳过初始欢迎消息，避免混淆
          if (msg.id !== '1') {
            apiMessages.push({
              role: 'assistant',
              content: msg.content
            });
          }
        } else {
          apiMessages.push({
            role: 'user',
            content: msg.content
          });
        }
      });

      // 添加当前用户消息
      apiMessages.push({
        role: 'user',
        content: userMessage
      });

      // 确保消息数组格式正确
      const cleanMessages = apiMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 准备GraphQL输入，确保字段名正确
      const input: ChatInput = {
        model: 'deepseek-chat',
        messages: cleanMessages,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9
      };

      console.log('发送GraphQL请求:');
      console.log('Input object:', JSON.stringify(input, null, 2));
      console.log('Messages array:', cleanMessages);

      const result = await chatMutation({
        variables: { 
          input: input
        }
      });

      console.log('GraphQL完整响应:');
      console.log('Result:', JSON.stringify(result, null, 2));

      // 解析响应
      if (result.data?.chat?.choices?.[0]?.message?.content) {
        const content = result.data.chat.choices[0].message.content;
        console.log('提取的内容:', content);
        return content;
      } else {
        console.error('响应格式不正确:', result.data);
        throw new Error('响应格式不匹配: 未找到choices[0].message.content');
      }
    } catch (error) {
      console.error('DeepSeek GraphQL详细错误:', error);
      
      // 输出详细错误信息
      if (error instanceof Error) {
        console.error('错误消息:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      
      throw error;
    }
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // 调用GraphQL API
      const aiContent = await callDeepSeekGraphQL(messageContent, messages);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('GraphQL API Error:', error);
      
      // 更详细的错误处理
      let errorMessage = 'GraphQL API调用失败';
      
      if (error instanceof Error) {
        if (error.message.includes('Cannot read properties of undefined')) {
          errorMessage = '请求参数格式错误 - 可能是messages字段未正确传递';
        } else if (error.message.includes('Network error')) {
          errorMessage = '网络连接错误 - 请检查网络连接';
        } else {
          errorMessage = error.message;
        }
      }
      
      // 添加错误消息
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: `抱歉，我遇到了一些技术问题：**${errorMessage}**\n\n**调试信息：**\n- 错误类型: ${error instanceof Error ? error.constructor.name : typeof error}\n- 错误详情: ${error instanceof Error ? error.message : String(error)}\n\n请稍后重试，或点击右上角的"调试模式"查看详细信息。`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
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
    navigator.clipboard.writeText(content).then(() => {
      // 可以添加toast通知
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    // 找到该AI消息对应的用户消息
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.sender !== 'user') return;

    try {
      // 获取该消息之前的对话历史
      const conversationHistory = messages.slice(0, messageIndex - 1);
      const aiContent = await callDeepSeekGraphQL(userMessage.content, conversationHistory);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: aiContent, timestamp: new Date() }
          : msg
      ));
    } catch (error) {
      console.error('Regenerate Error:', error);
    }
  };

  // Markdown 自定义组件
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <pre className="hljs">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre({ children, ...props }: any) {
      return <pre {...props}>{children}</pre>;
    },
    a({ href, children, ...props }: any) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          {...props}
        >
          {children}
        </a>
      );
    }
  };

  // 获取当前可用的模型
  const availableModel = modelsData?.models?.[0]?.id || 'deepseek-chat';
  const connectionStatus = helloData?.hello || '连接中...';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-center py-4 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${
              error ? 'bg-red-400' : modelsLoading ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'
            }`}></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              小包包
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {isLoading ? '正在思考中...' : 
               modelsLoading ? '连接GraphQL中...' : 
               error ? 'GraphQL连接失败' :
               `GraphQL API + ${availableModel} · ${connectionStatus}`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">GraphQL连接错误</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-red-400 hover:text-red-600 transition-colors"
            title="重新连接"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GraphQL Status */}
      {!error && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>GraphQL状态: {connectionStatus}</span>
            {modelsData && (
              <span className="ml-4">可用模型: {modelsData.models?.length || 0}个</span>
            )}
          </div>
        </div>
      )}

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
                <div className="markdown-content">
                  {message.sender === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap m-0">
                      {message.content}
                    </p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={MarkdownComponents}
                      className="text-sm leading-relaxed"
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                
                <div
                  className={`text-xs mt-3 ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
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
                <span className="text-sm text-slate-500 ml-2">小包包正在通过 GraphQL 生成回复...</span>
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
                disabled={isLoading}
              >
                <span className="text-lg">{action.icon}</span>
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="向小包包提问任何问题..."
              className="flex-1 resize-none border-0 outline-none text-slate-800 placeholder-slate-400 bg-transparent min-h-[24px] max-h-[120px] leading-6"
              rows={1}
              disabled={isLoading || !!error}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading || !!error}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isLoading && !error
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-3">
            <p className="text-xs text-slate-400 text-center">
              支持 Markdown 格式 · 基于 DeepSeek AI · GraphQL API: deepseek.jzq1020814597.workers.dev
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiaoBaoBaoChat;