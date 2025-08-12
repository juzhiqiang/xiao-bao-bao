import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { appConfig } from './config';
import { GET_MODELS } from './graphql';

// GraphQL API 端点 - 使用配置系统
const httpLink = createHttpLink({
  uri: appConfig.graphqlEndpoint,
  // 添加更多选项
  fetch: (uri, options) => {
    return fetch(uri, {
      ...options,
      // 添加超时
      signal: AbortSignal.timeout(30000)
    });
  }
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
    
    // 如果是网络错误，可以尝试重试
    if (networkError.message.includes('fetch')) {
      console.log('Network error detected, you may want to implement retry logic');
    }
  }
});

// 设置请求头
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 添加用户代理
      'User-Agent': 'XiaoBaoBao/2.0.0',
    }
  }
});

// 创建Apollo Client实例
export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    authLink.concat(httpLink)
  ]),
  cache: new InMemoryCache({
    // 优化缓存策略
    typePolicies: {
      Query: {
        fields: {
          // 可以在这里定义特定字段的缓存策略
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network', // 优先使用缓存，同时获取最新数据
    },
    query: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first', // 查询优先使用缓存
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // 开发环境下连接到DevTools
  connectToDevTools: appConfig.isDevelopment,
  // 设置默认超时
  queryDeduplication: true,
});

// 健康检查函数
export async function checkApolloHealth(): Promise<{ connected: boolean; error?: string }> {
  try {
    const result = await apolloClient.query({
      query: GET_MODELS,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    });
    
    if (result.errors && result.errors.length > 0) {
      return {
        connected: false,
        error: result.errors[0].message
      };
    }
    
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export default apolloClient;
