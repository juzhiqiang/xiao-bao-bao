// 应用配置管理
export interface AppConfig {
  graphqlEndpoint: string;
  streamEndpoint: string;
  mastraApiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// 获取环境变量，提供默认值
function getEnvVar(name: string, defaultValue: string): string {
  return import.meta.env[name] || defaultValue;
}

// 创建应用配置
export const appConfig: AppConfig = {
  graphqlEndpoint: getEnvVar('VITE_GRAPHQL_ENDPOINT', 'https://ai-admin.juzhiqiang.shop'),
  streamEndpoint: getEnvVar('VITE_GRAPHQL_ENDPOINT', 'https://ai-admin.juzhiqiang.shop') + '/stream',
  mastraApiUrl: getEnvVar('VITE_MASTRA_API_URL', 'https://agent.juzhiqiang.shop'),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// 验证配置
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // 验证GraphQL端点
    new URL(appConfig.graphqlEndpoint);
  } catch {
    errors.push('GraphQL端点URL格式不正确');
  }

  try {
    // 验证Mastra API端点
    new URL(appConfig.mastraApiUrl);
  } catch {
    errors.push('Mastra API端点URL格式不正确');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 检查网络连通性
export async function checkNetworkConnection(): Promise<boolean> {
  try {
    // 简单的网络检查
    const response = await fetch('/favicon.svg', { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    return response.ok;
  } catch {
    return false;
  }
}

// 获取应用状态信息
export function getAppInfo() {
  return {
    name: '小包包',
    version: '2.0.0',
    build: import.meta.env.MODE,
    config: appConfig,
    validation: validateConfig()
  };
}

export default appConfig;
