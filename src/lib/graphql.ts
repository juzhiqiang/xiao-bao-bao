import { gql } from '@apollo/client';

// GraphQL 类型定义
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
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
    finishReason: string;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ModelsResponse {
  data: {
    id: string;
    object: string;
    created: number;
    ownedBy: string;
  }[];
}

// GraphQL 查询定义
export const GET_MODELS = gql`
  query GetModels {
    models {
      data {
        id
        object
        created
        ownedBy
      }
    }
  }
`;

export const CHAT_COMPLETION = gql`
  mutation ChatCompletion($input: ChatCompletionInput!) {
    chatCompletion(input: $input) {
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
        finishReason
      }
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

export const TEXT_COMPLETION = gql`
  mutation TextCompletion($input: TextCompletionInput!) {
    textCompletion(input: $input) {
      id
      object
      created
      model
      choices {
        index
        text
        finishReason
      }
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

// 输入类型定义
export interface ChatCompletionInput {
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface TextCompletionInput {
  model?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}