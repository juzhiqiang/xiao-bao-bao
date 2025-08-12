// 流式响应处理模块 - 基于 DeepSeek GraphQL API
import { ChatMessage } from './graphql';
import { appConfig } from './config';

// 流式响应配置
export interface StreamingConfig {
  endpoint: string;
  streamEndpoint: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

// 默认配置 - 使用应用配置
const DEFAULT_CONFIG: StreamingConfig = {
  endpoint: appConfig.graphqlEndpoint,
  streamEndpoint: appConfig.streamEndpoint,
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9
};

// GraphQL 查询定义
const CHAT_STREAM_SUBSCRIPTION = `
  subscription($input: ChatInput!) {
    chatStream(input: $input) {
      id
      object
      created
      model
      choices {
        index
        delta {
          role
          content
        }
        finish_reason
      }
    }
  }
`;

const CHAT_MUTATION = `
  mutation($input: ChatInput!) {
    chat(input: $input) {
      id
      object
      created
      model
      choices {
        index
        message {
          role
          content
        }
        finish_reason
      }
      usage {
        prompt_tokens
        completion_tokens
        total_tokens
      }
    }
  }
`;

const MODELS_QUERY = `
  query {
    models {
      id
      object
      created
      owned_by
    }
  }
`;

// 流式响应处理器
export class StreamingChatHandler {
  private config: StreamingConfig;
  private abortController: AbortController | null = null;

  constructor(config: Partial<StreamingConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // 停止当前流式请求
  public abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // 流式聊天请求 - 使用 GraphQL Subscription
  public async streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // 创建新的 AbortController
    this.abortController = new AbortController();

    try {
      // 转换消息格式为 GraphQL 输入格式
      const graphqlMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(this.config.streamEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          query: CHAT_STREAM_SUBSCRIPTION,
          variables: {
            input: {
              model: this.config.model,
              messages: graphqlMessages,
              max_tokens: this.config.maxTokens,
              temperature: this.config.temperature,
              top_p: this.config.topP,
              stream: true
            }
          }
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          // 解码数据块
          buffer += decoder.decode(value, { stream: true });
          
          // 处理 Server-Sent Events 格式的数据
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

          for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '' || trimmed.startsWith(':')) {
              continue;
            }

            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6); // 移除 'data: ' 前缀
              
              // 处理完成信号
              if (dataStr === '{"type":"complete"}' || dataStr === '[DONE]') {
                onComplete();
                return;
              }

              try {
                const data = JSON.parse(dataStr);
                
                // 处理 GraphQL 响应格式
                if (data.data?.chatStream?.choices?.[0]?.delta?.content) {
                  const content = data.data.chatStream.choices[0].delta.content;
                  onChunk(content);
                }
              } catch (parseError) {
                console.warn('解析 SSE 数据失败:', parseError, 'Raw line:', trimmed);
              }
            }
          }
        }

        onComplete();
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('流式请求被中止');
          return;
        }
        onError(error);
      } else {
        onError(new Error('未知错误'));
      }
    } finally {
      this.abortController = null;
    }
  }

  // 备用非流式请求（使用 GraphQL Mutation）
  public async fallbackRequest(
    messages: ChatMessage[],
    onComplete: (content: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    this.abortController = new AbortController();

    try {
      // 转换消息格式为 GraphQL 输入格式
      const graphqlMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          query: CHAT_MUTATION,
          variables: {
            input: {
              model: this.config.model,
              messages: graphqlMessages,
              max_tokens: this.config.maxTokens,
              temperature: this.config.temperature,
              top_p: this.config.topP,
              stream: false
            }
          }
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // 处理 GraphQL 错误
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL错误');
      }

      const content = result.data?.chat?.choices?.[0]?.message?.content;
      
      if (content) {
        onComplete(content);
      } else {
        throw new Error('响应格式错误：未找到消息内容');
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('请求被中止');
          return;
        }
        onError(error);
      } else {
        onError(new Error('未知错误'));
      }
    } finally {
      this.abortController = null;
    }
  }

  // 检查是否支持流式响应
  public static async checkStreamingSupport(endpoint: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: MODELS_QUERY
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return !result.errors && result.data?.models;
    } catch (error) {
      console.warn('流式支持检查失败:', error);
      return false;
    }
  }

  // 获取可用模型
  public async getModels(): Promise<any[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          query: MODELS_QUERY
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL错误');
      }

      return result.data?.models || [];
    } catch (error) {
      console.error('获取模型列表失败:', error);
      return [];
    }
  }
}

// 导出默认实例
export const streamingHandler = new StreamingChatHandler();

// 工具函数：将文本逐字显示
export function simulateTypingEffect(
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  delay: number = 30
): void {
  let index = 0;
  const timer = setInterval(() => {
    if (index < text.length) {
      onChunk(text[index]);
      index++;
    } else {
      clearInterval(timer);
      onComplete();
    }
  }, delay);
}

// 优化的分块显示（按词语分块，更自然）
export function simulateNaturalTyping(
  text: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  baseDelay: number = 50
): void {
  // 按标点符号和空格分割文本，保持更自然的显示
  const chunks = text.split(/([。！？，、；：\s]+)/).filter(chunk => chunk.length > 0);
  let index = 0;

  const showNextChunk = () => {
    if (index < chunks.length) {
      const chunk = chunks[index];
      onChunk(chunk);
      index++;
      
      // 根据内容类型调整延迟
      let delay = baseDelay;
      if (/[。！？]/.test(chunk)) {
        delay = baseDelay * 3; // 句号后稍长停顿
      } else if (/[，、；：]/.test(chunk)) {
        delay = baseDelay * 2; // 逗号后短停顿
      }
      
      setTimeout(showNextChunk, delay);
    } else {
      onComplete();
    }
  };

  showNextChunk();
}
