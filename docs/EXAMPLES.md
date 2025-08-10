# 使用示例

本文档提供了小包包AI对话组件的详细使用示例。

## 基础使用

### 1. 快速开始 - 流式模式

```tsx
import React from 'react';
import { XiaoBaoBaoStreamingChat } from 'xiao-bao-bao';
import 'xiao-bao-bao/dist/style.css';

function App() {
  return (
    <div className="h-screen">
      <XiaoBaoBaoStreamingChat />
    </div>
  );
}

export default App;
```

### 2. 传统GraphQL模式

```tsx
import React from 'react';
import { XiaoBaoBaoChat } from 'xiao-bao-bao';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apollo';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="h-screen">
        <XiaoBaoBaoChat />
      </div>
    </ApolloProvider>
  );
}
```

### 3. 模式选择器

```tsx
import React from 'react';
import { ChatModeSelector } from 'xiao-bao-bao';

function App() {
  return <ChatModeSelector />;
}
```

## 自定义配置

### 1. 自定义流式处理器

```tsx
import React, { useState, useEffect } from 'react';
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

function CustomStreamingChat() {
  const [handler] = useState(() => new StreamingChatHandler({
    endpoint: 'https://your-api-endpoint.com/v1/chat/completions',
    model: 'your-model',
    temperature: 0.8,
    maxTokens: 4000,
    topP: 0.95,
    apiKey: 'your-api-key'
  }));

  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (content: string) => {
    setIsStreaming(true);
    
    const newMessage = {
      id: Date.now().toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);

    await handler.streamChat(
      [{ role: 'user', content }],
      (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, content: msg.content + chunk }
            : msg
        ));
      },
      () => setIsStreaming(false),
      (error) => {
        console.error('流式错误:', error);
        setIsStreaming(false);
      }
    );
  };

  return (
    <div className="chat-container">
      {/* 渲染消息 */}
      {messages.map(msg => (
        <div key={msg.id} className="message">
          {msg.content}
        </div>
      ))}
      
      {/* 输入区域 */}
      <input 
        type="text" 
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !isStreaming) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
        disabled={isStreaming}
      />
    </div>
  );
}
```

### 2. 环境配置

```tsx
// config/streaming.ts
export const getStreamingConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    endpoint: isDev 
      ? 'http://localhost:3001/api/chat'
      : 'https://api.yourapp.com/v1/chat/completions',
    model: isDev ? 'gpt-3.5-turbo' : 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000,
    apiKey: process.env.REACT_APP_API_KEY
  };
};

// components/ConfigurableChat.tsx
import { getStreamingConfig } from '../config/streaming';

function ConfigurableChat() {
  const [handler] = useState(() => 
    new StreamingChatHandler(getStreamingConfig())
  );
  
  // ... 其他代码
}
```

## 高级功能

### 1. 带有状态管理的聊天

```tsx
import React, { useReducer, useCallback } from 'react';
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'connecting' | 'error';
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTION_STATUS'; payload: ChatState['connectionStatus'] };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id 
            ? { ...msg, content: action.payload.content }
            : msg
        )
      };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    default:
      return state;
  }
};

function AdvancedChat() {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isStreaming: false,
    error: null,
    connectionStatus: 'connecting'
  });

  const [handler] = useState(() => new StreamingChatHandler());

  const sendMessage = useCallback(async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user' as const,
      timestamp: new Date()
    };

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'ai' as const,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    dispatch({ type: 'SET_STREAMING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await handler.streamChat(
        [{ role: 'user', content }],
        (chunk) => {
          dispatch({ 
            type: 'UPDATE_MESSAGE', 
            payload: { id: aiMessage.id, content: aiMessage.content + chunk }
          });
        },
        () => {
          dispatch({ type: 'SET_STREAMING', payload: false });
        },
        (error) => {
          dispatch({ type: 'SET_ERROR', payload: error.message });
          dispatch({ type: 'SET_STREAMING', payload: false });
        }
      );
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_STREAMING', payload: false });
    }
  }, [handler]);

  return (
    <div className="advanced-chat">
      {/* 状态显示 */}
      <div className="status-bar">
        <span>状态: {state.connectionStatus}</span>
        {state.isStreaming && <span>正在生成...</span>}
        {state.error && <span className="error">错误: {state.error}</span>}
      </div>

      {/* 消息列表 */}
      <div className="messages">
        {state.messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <input 
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !state.isStreaming) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
        disabled={state.isStreaming}
        placeholder="输入消息..."
      />
    </div>
  );
}
```

### 2. 带有持久化的聊天

```tsx
import React, { useState, useEffect } from 'react';
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

function PersistentChat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat-messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [handler] = useState(() => new StreamingChatHandler());

  // 保存消息到localStorage
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  // 清除历史记录
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chat-messages');
  };

  const sendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    await handler.streamChat(
      [{ role: 'user', content }],
      (chunk) => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: msg.content + chunk }
            : msg
        ));
      },
      () => console.log('完成'),
      (error) => console.error('错误:', error)
    );
  };

  return (
    <div className="persistent-chat">
      <div className="header">
        <h2>持久化聊天</h2>
        <button onClick={clearHistory}>清除历史</button>
      </div>
      
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="content">{msg.content}</div>
            <div className="timestamp">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <input 
        type="text"
        placeholder="输入消息..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

### 3. 多模型支持

```tsx
import React, { useState } from 'react';
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

const MODELS = [
  { id: 'deepseek-chat', name: 'DeepSeek Chat', endpoint: 'https://api.deepseek.com' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', endpoint: 'https://api.openai.com' },
  { id: 'claude-3', name: 'Claude 3', endpoint: 'https://api.anthropic.com' }
];

function MultiModelChat() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [handler, setHandler] = useState(() => 
    new StreamingChatHandler({
      endpoint: selectedModel.endpoint + '/v1/chat/completions',
      model: selectedModel.id
    })
  );
  
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // 切换模型
  const switchModel = (model) => {
    setSelectedModel(model);
    setHandler(new StreamingChatHandler({
      endpoint: model.endpoint + '/v1/chat/completions',
      model: model.id
    }));
  };

  const sendMessage = async (content: string) => {
    // ... 发送消息逻辑
  };

  return (
    <div className="multi-model-chat">
      {/* 模型选择器 */}
      <div className="model-selector">
        <label>选择模型:</label>
        <select 
          value={selectedModel.id}
          onChange={(e) => {
            const model = MODELS.find(m => m.id === e.target.value);
            if (model) switchModel(model);
          }}
          disabled={isStreaming}
        >
          {MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* 当前模型状态 */}
      <div className="current-model">
        当前使用: <strong>{selectedModel.name}</strong>
      </div>

      {/* 消息列表 */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.content}
            {msg.model && (
              <div className="model-tag">by {msg.model}</div>
            )}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <input 
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !isStreaming) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
        disabled={isStreaming}
        placeholder={`向 ${selectedModel.name} 提问...`}
      />
    </div>
  );
}
```

## 工具函数示例

### 1. 自定义打字效果

```tsx
import { simulateNaturalTyping } from 'xiao-bao-bao/lib/streaming';

function TypingEffectDemo() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = () => {
    setIsTyping(true);
    setDisplayText('');
    
    const text = '这是一段要模拟打字效果显示的文本。你可以看到它正在一字一字地出现。';
    
    simulateNaturalTyping(
      text,
      (chunk) => setDisplayText(prev => prev + chunk),
      () => setIsTyping(false),
      50 // 基础延迟50ms
    );
  };

  return (
    <div className="typing-demo">
      <button onClick={startTyping} disabled={isTyping}>
        {isTyping ? '正在打字...' : '开始打字效果'}
      </button>
      
      <div className="text-display">
        {displayText}
        {isTyping && <span className="cursor">|</span>}
      </div>
    </div>
  );
}
```

### 2. 流式数据处理

```tsx
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

function DataStreamingExample() {
  const [streamData, setStreamData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [handler] = useState(() => new StreamingChatHandler());

  const processData = async (input: string) => {
    setIsProcessing(true);
    setStreamData('');

    try {
      await handler.streamChat(
        [{ role: 'user', content: `处理这些数据: ${input}` }],
        (chunk) => {
          // 实时处理数据块
          setStreamData(prev => {
            const newData = prev + chunk;
            // 可以在这里添加实时数据验证或格式化
            return newData;
          });
        },
        () => {
          setIsProcessing(false);
          console.log('数据处理完成');
        },
        (error) => {
          console.error('数据处理错误:', error);
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error('处理失败:', error);
      setIsProcessing(false);
    }
  };

  const stopProcessing = () => {
    handler.abort();
    setIsProcessing(false);
  };

  return (
    <div className="data-streaming">
      <div className="controls">
        <input 
          type="text"
          placeholder="输入要处理的数据"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isProcessing) {
              processData(e.target.value);
            }
          }}
          disabled={isProcessing}
        />
        
        {isProcessing && (
          <button onClick={stopProcessing}>
            停止处理
          </button>
        )}
      </div>

      <div className="output">
        <h3>处理结果:</h3>
        <pre>{streamData}</pre>
        {isProcessing && (
          <div className="processing-indicator">
            <span>正在处理中...</span>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 错误处理示例

### 1. 完整的错误处理

```tsx
import React, { useState } from 'react';
import { StreamingChatHandler } from 'xiao-bao-bao/lib/streaming';

function RobustChat() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [handler] = useState(() => new StreamingChatHandler());

  const sendMessageWithRetry = async (content: string, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setError(null);
        
        await handler.streamChat(
          [{ role: 'user', content }],
          (chunk) => {
            // 处理数据块
            setMessages(prev => /* 更新逻辑 */);
          },
          () => {
            // 成功完成
            setRetryCount(0);
          },
          (error) => {
            throw error; // 重新抛出错误进行重试
          }
        );
        
        break; // 成功，跳出重试循环
        
      } catch (error) {
        setRetryCount(attempt + 1);
        
        if (attempt === maxRetries) {
          // 所有重试都失败了
          setError({
            message: error.message,
            type: 'max_retries_exceeded',
            retryCount: attempt + 1
          });
        } else {
          // 等待后重试
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }
    }
  };

  const handleRetry = () => {
    const lastUserMessage = messages
      .filter(msg => msg.sender === 'user')
      .pop();
    
    if (lastUserMessage) {
      sendMessageWithRetry(lastUserMessage.content);
    }
  };

  return (
    <div className="robust-chat">
      {/* 错误显示 */}
      {error && (
        <div className="error-banner">
          <div className="error-message">
            错误: {error.message}
          </div>
          <div className="error-details">
            重试次数: {error.retryCount}/{3}
          </div>
          <button onClick={handleRetry}>重试</button>
        </div>
      )}

      {/* 重试指示器 */}
      {retryCount > 0 && (
        <div className="retry-indicator">
          正在重试 ({retryCount}/3)...
        </div>
      )}

      {/* 消息列表 */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <input 
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessageWithRetry(e.target.value);
            e.target.value = '';
          }
        }}
        placeholder="输入消息..."
      />
    </div>
  );
}
```

## 性能优化示例

### 1. 虚拟滚动长对话

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';

function VirtualizedChat() {
  const [messages, setMessages] = useState([]);
  
  // 使用useMemo优化消息渲染
  const messageItems = useMemo(() => {
    return messages.map((msg, index) => ({
      ...msg,
      index
    }));
  }, [messages]);

  // 使用useCallback优化消息项渲染
  const MessageItem = useCallback(({ index, style }) => {
    const message = messageItems[index];
    return (
      <div style={style} className={`message ${message.sender}`}>
        <div className="content">{message.content}</div>
        <div className="timestamp">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    );
  }, [messageItems]);

  return (
    <div className="virtualized-chat">
      <FixedSizeList
        height={400}
        itemCount={messageItems.length}
        itemSize={80}
        className="message-list"
      >
        {MessageItem}
      </FixedSizeList>
      
      {/* 输入区域 */}
      <input 
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            // 添加新消息逻辑
          }
        }}
      />
    </div>
  );
}
```

### 2. 节流和防抖

```tsx
import React, { useState, useCallback } from 'react';
import { debounce, throttle } from 'lodash';

function OptimizedChat() {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 防抖输入处理
  const debouncedSave = useCallback(
    debounce((value: string) => {
      // 保存草稿
      localStorage.setItem('draft-message', value);
      setIsTyping(false);
    }, 1000),
    []
  );

  // 节流状态更新
  const throttledTyping = useCallback(
    throttle(() => {
      setIsTyping(true);
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    throttledTyping();
    debouncedSave(value);
  };

  return (
    <div className="optimized-chat">
      {/* 打字指示器 */}
      {isTyping && (
        <div className="typing-indicator">
          正在输入...
        </div>
      )}

      <textarea
        value={inputValue}
        onChange={handleInputChange}
        placeholder="输入消息..."
        rows={3}
      />
    </div>
  );
}
```

这些示例展示了小包包AI对话组件的各种使用方式，从基础使用到高级功能，帮助你在项目中更好地集成和使用这个组件。