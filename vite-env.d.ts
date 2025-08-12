/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASTRA_API_URL?: string;
  readonly VITE_GRAPHQL_ENDPOINT?: string;
  // 添加更多环境变量类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
