import { gql } from '@apollo/client';

// GraphQL 类型定义
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatInput {
  model?: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
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

// GraphQL 查询定义 - 根据实际schema调整
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

// 修正的 Chat Mutation - 确保字段名称匹配后端schema
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