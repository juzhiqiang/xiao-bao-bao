import { gql } from '@apollo/client';

// GraphQL 类型定义 - 确保与后端schema完全匹配
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 注意：这里要确保字段名与后端GraphQL输入类型完全一致
export interface ChatInput {
  model?: string;
  messages: ChatMessage[];  // 确保这个字段名正确
  max_tokens?: number;      // 注意下划线命名
  temperature?: number;
  top_p?: number;          // 注意下划线命名
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

// GraphQL 查询定义
export const GET_MODELS = gql`
  query GetModels {
    models {
      id
      object
      created
      owned_by
    }
  }
`;

// 修正Chat Mutation - 移除可能导致问题的__typename
export const CHAT_MUTATION = gql`
  mutation Chat($input: ChatInput!) {
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

export const COMPLETION_MUTATION = gql`
  mutation Completion($input: CompletionInput!) {
    completion(input: $input) {
      id
      object
      created
      model
      choices {
        text
        index
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

export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

// 输入类型定义
export interface CompletionInput {
  model?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

// GraphQL错误处理类型
export interface GraphQLErrorResponse {
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
  data?: any;
}