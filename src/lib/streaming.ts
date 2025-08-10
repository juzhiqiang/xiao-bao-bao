// 流式响应处理模块
import { ChatMessage } from './graphql';

// 流式响应配置
export interface StreamingConfig {
  endpoint: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

// 默认配置
const DEFAULT_CONFIG: StreamingConfig = {
  endpoint: 'https://ai-admin.juzhiqiang.shop/v1/chat/completions',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
  topP: 0.9
};

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

  // 流式聊天请求
  public async streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    // 创建新的 AbortController
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          stream: true, // 启用流式响应
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          top_p: this.config.topP
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

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
          
          // 处理SSE格式的数据
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

          for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '' || trimmed === 'data: [DONE]') {
              continue;
            }

            if (trimmed.startsWith('data: ')) {
              try {
                const jsonStr = trimmed.slice(6); // 移除 'data: ' 前缀
                const data = JSON.parse(jsonStr);
                
                // 提取内容
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  onChunk(content);
                }
              } catch (parseError) {
                console.warn('解析SSE数据失败:', parseError, 'Raw line:', trimmed);
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

  // 备用非流式请求（用于不支持流式的情况）
  public async fallbackRequest(
    messages: ChatMessage[],
    onComplete: (content: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    this.abortController = new AbortController();

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          stream: false, // 非流式
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          top_p: this.config.topP
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;
      
      if (content) {
        onComplete(content);
      } else {
        throw new Error('响应格式错误');
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
      const response = await fetch(endpoint.replace('/v1/chat/completions', '/v1/models'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch {
      return false;
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
  const chunks = text.split(/([\u3002\uff01\uff1f\uff0c\u3001\uff1b\uff1a\s]+)/).filter(chunk => chunk.length > 0);
  let index = 0;

  const showNextChunk = () => {
    if (index < chunks.length) {
      const chunk = chunks[index];
      onChunk(chunk);
      index++;
      
      // 根据内容类型调整延迟
      let delay = baseDelay;
      if (/[\u3002\uff01\uff1f]/.test(chunk)) {
        delay = baseDelay * 3; // 句号后稍长停顿
      } else if (/[\uff0c\u3001\uff1b\uff1a]/.test(chunk)) {
        delay = baseDelay * 2; // 逗号后短停顿
      }
      
      setTimeout(showNextChunk, delay);
    } else {
      onComplete();
    }
  };

  showNextChunk();
}