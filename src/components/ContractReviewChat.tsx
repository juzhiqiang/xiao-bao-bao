import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  User,
  Bot,
  FileText,
  Upload,
  Copy,
  RefreshCw,
  AlertCircle,
  Square,
  ArrowLeft,
  FileCheck,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { contractReviewClient } from '../lib/mastraClient';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
  contractType?: string;
}

interface QuickAction {
  id: string;
  text: string;
  icon: string;
  description: string;
}

const ContractReviewChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        '你好！我是小包包的合同审核助手 📋\n\n我可以帮助你审核各类企业合同的合规性，特别是**可视化大屏企业合同**。\n\n## 我的核心功能\n\n🔍 **合规性审核** - 检查合同是否符合相关法律法规\n⚠️ **风险评估** - 识别潜在风险点和法律漏洞\n💡 **合规建议** - 提供具体的改进建议\n📝 **专业解释** - 用通俗易懂的语言解释复杂条款\n\n## 重点审核领域\n\n- 🛡️ 数据安全与隐私保护\n- 🏛️ 知识产权保护\n- ⚡ 服务等级协议(SLA)\n- ⚖️ 责任限制与赔偿\n- 🔧 技术规范要求\n- 🎨 用户体验标准\n\n你可以直接**粘贴合同文本**或**上传合同文件**，我将为你提供专业的合规性分析报告！\n\n现在就开始合同审核吧！ ✨',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [contractType, setContractType] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'connecting' | 'error'
  >('connecting');
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentStreamingMessage = useRef<string>('');
  const currentAiMessageId = useRef<string>('');
  const isInitialized = useRef(false);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      text: '数据处理服务合同',
      icon: '🛡️',
      description: '审核数据安全与隐私保护条款',
    },
    {
      id: '2',
      text: '软件开发合同',
      icon: '💻',
      description: '检查知识产权和技术规范条款',
    },
    {
      id: '3',
      text: 'SaaS服务协议',
      icon: '☁️',
      description: '分析SLA和服务等级保证条款',
    },
    {
      id: '4',
      text: '可视化大屏合同',
      icon: '📊',
      description: '专业审核可视化项目合同',
    },
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 初始化连接检查
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('connecting');
    try {
      const result = await contractReviewClient.checkConnection();
      setConnectionStatus(result.connected ? 'connected' : 'error');
      if (!result.connected) {
        setError(result.error || 'Mastra服务连接失败');
      } else {
        setError(null);
      }
    } catch (error) {
      setConnectionStatus('error');
      setError('无法连接到合同审核服务');
      console.error('Connection check failed:', error);
    }
  };

  // 停止当前流式响应
  const stopStreaming = () => {
    setIsStreaming(false);

    // 如果有未完成的流式消息，将其标记为完成，但保留内容
    if (currentAiMessageId.current) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === currentAiMessageId.current && msg.sender === 'ai') {
            return { ...msg, isStreaming: false };
          }
          return msg;
        })
      );
      currentAiMessageId.current = '';
    }
  };

  // 处理流式响应
  const handleStreamingResponse = async (
    userMessage: string,
    currentMessages: Message[],
    type?: string
  ) => {
    // 创建AI响应消息
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true,
      contractType: type,
    };

    // 设置当前AI消息ID
    currentAiMessageId.current = aiMessage.id;

    // 添加AI消息到状态
    setMessages((prev) => [...prev, aiMessage]);
    setIsStreaming(true);
    currentStreamingMessage.current = '';

    // 流式响应处理
    const onChunk = (chunk: string) => {
      currentStreamingMessage.current += chunk;
      const targetMessageId = currentAiMessageId.current;

      setMessages((prev) =>
        prev.map((msg) => {
          // 只更新目标AI消息，不影响其他消息
          if (msg.id === targetMessageId && msg.sender === 'ai') {
            return { ...msg, content: currentStreamingMessage.current };
          }
          return msg;
        })
      );
    };

    const onComplete = (fullResponse: string) => {
      const targetMessageId = currentAiMessageId.current;

      setIsStreaming(false);

      // 确保最终内容被正确保存
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === targetMessageId && msg.sender === 'ai') {
            return {
              ...msg,
              content: fullResponse,
              isStreaming: false,
            };
          }
          return msg;
        })
      );

      // 清理refs
      currentAiMessageId.current = '';
      currentStreamingMessage.current = '';
    };

    const onError = (error: Error) => {
      const targetMessageId = currentAiMessageId.current;
      setIsStreaming(false);
      console.error('合同审核流式响应错误:', error);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === targetMessageId && msg.sender === 'ai') {
            return {
              ...msg,
              content: `抱歉，合同审核过程中遇到了技术问题：**${error.message}**\n\n请稍后重试或检查网络连接。`,
              isStreaming: false,
            };
          }
          return msg;
        })
      );
      // 清理refs
      currentAiMessageId.current = '';
      currentStreamingMessage.current = '';
    };

    // 开始流式请求
    try {
      await contractReviewClient.reviewContractStream(
        userMessage,
        type,
        onChunk,
        onComplete,
        onError
      );
    } catch (error) {
      onError(error instanceof Error ? error : new Error('未知错误'));
    }
  };

  const handleSendMessage = async (content?: string, type?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      contractType: type || contractType,
    };

    // 先添加用户消息到状态
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setContractType('');
    setError(null);

    // 处理AI响应，传递包含新用户消息的列表
    await handleStreamingResponse(messageContent, updatedMessages, type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (!isStreaming) {
      setContractType(action.text);
      handleSendMessage(
        `请帮我审核一份${action.text}，我需要你关注${action.description}方面的内容。请告诉我审核重点和注意事项。`,
        action.text
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('暂只支持文本文件(.txt)、PDF文件(.pdf)和Word文档(.doc/.docx)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError('文件大小不能超过10MB');
        return;
      }

      setUploadedFile(file);
      setError(null);

      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          handleSendMessage(
            `我上传了一份合同文件（${file.name}），请帮我审核其合规性：\n\n${content}`
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // 可以添加toast通知
      })
      .catch(() => {
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
    if (isStreaming) return;

    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.sender !== 'user') return;

    // 重置目标消息
    currentAiMessageId.current = messageId;
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.sender === 'ai') {
          return { ...msg, content: '', isStreaming: true };
        }
        return msg;
      })
    );

    setIsStreaming(true);
    currentStreamingMessage.current = '';

    // 流式响应处理
    const onChunk = (chunk: string) => {
      currentStreamingMessage.current += chunk;
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.sender === 'ai') {
            return { ...msg, content: currentStreamingMessage.current };
          }
          return msg;
        })
      );
    };

    const onComplete = (fullResponse: string) => {
      setIsStreaming(false);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.sender === 'ai') {
            return { ...msg, content: fullResponse, isStreaming: false };
          }
          return msg;
        })
      );

      // 清理refs
      currentAiMessageId.current = '';
      currentStreamingMessage.current = '';
    };

    const onError = (error: Error) => {
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.sender === 'ai') {
            return {
              ...msg,
              content: `抱歉，重新生成过程中遇到了技术问题：**${error.message}**\n\n请稍后重试。`,
              isStreaming: false,
            };
          }
          return msg;
        })
      );
      // 清理refs
      currentAiMessageId.current = '';
      currentStreamingMessage.current = '';
    };

    // 开始流式请求
    try {
      await contractReviewClient.reviewContractStream(
        userMessage.content,
        userMessage.contractType,
        onChunk,
        onComplete,
        onError
      );
    } catch (error) {
      onError(error instanceof Error ? error : new Error('未知错误'));
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
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Mastra合同审核服务已连接';
      case 'connecting':
        return '正在连接Mastra合同审核服务...';
      case 'error':
        return 'Mastra合同审核服务连接失败';
      default:
        return '未知状态';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-400 animate-pulse';
      case 'connecting':
        return 'bg-yellow-400 animate-pulse';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            title="返回主页"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div
              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${getConnectionStatusColor()}`}
            ></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              合同审核助手
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {isStreaming ? '正在审核合同中...' : getConnectionStatusText()}
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors disabled:opacity-50"
            title="上传合同文件"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">上传文件</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">错误提示</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={checkConnection}
            className="text-red-400 hover:text-red-600 transition-colors"
            title="重新连接"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* API Status */}
      {connectionStatus === 'connected' && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-emerald-800">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <Shield className="w-4 h-4" />
            <span>合同审核服务已启用 · Mastra Agent · 专业合规性分析</span>
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
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <FileCheck className="w-5 h-5 text-white" />
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
                {/* Contract Type Tag */}
                {message.contractType && message.sender === 'user' && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-xs font-medium mb-2">
                    <FileText className="w-3 h-3" />
                    {message.contractType}
                  </div>
                )}

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

                {/* Streaming Indicator */}
                {message.isStreaming && message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">正在审核中...</span>
                  </div>
                )}

                <div
                  className={`text-xs mt-3 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Message Actions */}
              {message.sender === 'ai' &&
                hoveredMessageId === message.id &&
                !message.isStreaming && (
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
                      title="重新审核"
                      disabled={isStreaming}
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-slate-400 ${
                          isStreaming ? 'animate-spin' : ''
                        }`}
                      />
                    </button>
                  </div>
                )}
            </div>
          </div>
        ))}

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
                className="flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all duration-200 hover:shadow-md group"
                disabled={isStreaming}
              >
                <span className="text-lg">{action.icon}</span>
                <div className="text-left">
                  <div className="text-sm text-slate-800 group-hover:text-emerald-600 font-medium">
                    {action.text}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-4 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-4 transition-all duration-200 focus-within:border-emerald-300 focus-within:shadow-2xl">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="粘贴合同内容或描述您的合同审核需求..."
              className="flex-1 resize-none border-0 outline-none text-slate-800 placeholder-slate-400 bg-transparent min-h-[24px] max-h-[120px] leading-6"
              rows={1}
              disabled={isStreaming}
            />

            {/* Stop/Send Button */}
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 active:scale-95"
                title="停止审核"
              >
                <Square className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || connectionStatus === 'error'}
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  inputValue.trim() && connectionStatus !== 'error'
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center mt-3">
            <p className="text-xs text-slate-400 text-center">
              {isStreaming
                ? '正在进行合同合规性审核...'
                : 'Mastra合同审核服务 · 支持多种文件格式 · 专业法律分析'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractReviewChat;