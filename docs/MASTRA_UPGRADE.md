# Mastra客户端升级指南

## 📋 升级概览

本次升级将合同审查模块的Mastra客户端从自定义Mock实现升级到官方的 `@mastra/client-js@0.10.20` 库，并更新了服务端点配置。

## 🔄 主要变更

### 1. 依赖库升级
- ✅ **新增**: `@mastra/client-js@^0.10.20` (官方最新版本)
- ❌ **移除**: 自定义Mock实现

### 2. 服务端点更新
- **旧**: `http://localhost:4111/`
- **新**: `https://agent.juzhiqiang.shop`
- ✅ **安全提升**: HTTP → HTTPS

### 3. API调用方式变更

#### 之前 (Mock实现)
```typescript
// 自定义Mock类
class MockMastraClient {
  constructor(config) { ... }
  getAgent(agentId) { ... }
}
```

#### 现在 (官方库)
```typescript
import { MastraClient } from '@mastra/client-js';

const mastraClient = new MastraClient({
  baseUrl: 'https://agent.juzhiqiang.shop',
  retries: 3,
  backoffMs: 300,
  maxBackoffMs: 5000,
});

// 使用真实的API
const agent = mastraClient.getAgent('contractAuditAgent');
await agent.generate({ messages: [...] });
await agent.stream({ messages: [...] });
```

## 🚀 新功能

### 1. 真实的Mastra Agent集成
- `client.getAgent(id)` - 获取代理实例
- `agent.generate()` - 生成响应
- `agent.stream()` - 流式响应
- 连接状态检查和代理测试

### 2. 环境变量支持
```env
# .env 文件
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
```

### 3. 增强的错误处理
- 更好的连接状态检查
- 详细的错误信息
- 自动重试机制（3次重试，指数退避）

## 📝 使用方法

### 基本用法
```typescript
import { contractReviewClient } from '@/lib/mastraClient';

// 合同审查
const result = await contractReviewClient.reviewContract(
  contractContent, 
  contractType
);

// 流式合同审查
await contractReviewClient.reviewContractStream(
  contractContent,
  contractType,
  (chunk) => console.log(chunk),      // onChunk
  (full) => console.log('Done:', full), // onComplete
  (error) => console.error(error)     // onError
);
```

### 连接检查
```typescript
const status = await contractReviewClient.checkConnection();
if (status.connected) {
  console.log('Mastra服务连接正常');
} else {
  console.error('连接失败:', status.error);
}
```

### 代理测试
```typescript
const testResult = await contractReviewClient.testAgent('测试消息');
if (testResult.success) {
  console.log('代理响应:', testResult.response);
}
```

## ⚙️ 配置选项

### 环境变量
- `REACT_APP_MASTRA_BASE_URL`: Mastra服务基础URL
- `VITE_MASTRA_API_URL`: Vite环境下的API URL (兼容)

### 自定义配置
```typescript
import { ContractReviewClient } from '@/lib/mastraClient';

const customClient = new ContractReviewClient({
  baseUrl: 'https://your-custom-mastra-server.com',
  retries: 5,
  backoffMs: 500,
  maxBackoffMs: 10000,
  headers: {
    'Authorization': 'Bearer your-token',
    'Custom-Header': 'value'
  }
});
```

## 🔧 迁移步骤

如果你有自定义的代码使用了旧的客户端：

1. **更新依赖**:
   ```bash
   npm install @mastra/client-js@^0.10.20
   ```

2. **更新环境变量**:
   ```bash
   # .env 文件
   REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
   ```

3. **API调用保持不变**:
   所有公共接口保持向后兼容，无需修改现有代码。

4. **启动应用**:
   ```bash
   npm run dev
   ```

## 🐛 故障排除

### 依赖安装问题
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 连接问题
```typescript
// 检查连接状态
const status = await contractReviewClient.checkConnection();
console.log('连接状态:', status);

// 测试代理功能
const test = await contractReviewClient.testAgent();
console.log('代理测试:', test);
```

### 环境变量问题
确保 `.env` 文件包含正确的配置：
```env
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
```

### 构建错误
如果遇到构建错误，请确保：
- Node.js 版本 >= 18.0.0
- 所有依赖已正确安装
- TypeScript 类型检查通过

### CORS问题
如果遇到CORS错误，请确保Mastra服务器配置了正确的CORS设置。

## 📊 性能提升

- ✅ **官方优化**: 使用官方库的性能优化
- ✅ **流式响应**: 支持真正的流式数据传输
- ✅ **连接复用**: 使用官方库的连接池管理
- ✅ **错误恢复**: 自动重试和错误处理
- ✅ **类型安全**: 完整的TypeScript类型支持

## 🔒 安全性

- ✅ **HTTPS**: 所有通信使用加密连接
- ✅ **头部验证**: 自定义安全头部支持
- ✅ **错误隐藏**: 敏感错误信息不会暴露给客户端

## 🧪 测试

```typescript
// 测试连接
const connectionTest = await contractReviewClient.checkConnection();

// 测试代理
const agentTest = await contractReviewClient.testAgent('Hello World');

// 测试合同审查
const reviewTest = await contractReviewClient.reviewContract(
  '这是一个测试合同内容', 
  '服务合同'
);
```

---

## 🆕 版本信息

- **升级版本**: v2.1.0
- **库版本**: @mastra/client-js@0.10.20
- **升级日期**: 2025-08-13
- **兼容性**: 向后兼容
- **破坏性变更**: 无

## 🔄 API版本对照

| 功能 | v2.0 (Mock) | v2.1 (官方库) |
|------|-------------|---------------|
| 客户端初始化 | MockMastraClient | MastraClient |
| 代理获取 | getAgent() | getAgent() |
| 响应生成 | generate() | generate() |
| 流式响应 | Mock实现 | agent.stream() |
| 连接检查 | Mock测试 | 真实连接测试 |
| 错误处理 | 基础处理 | 指数退避重试 |

如有问题，请查看 [GitHub Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues) 或联系维护团队。

---

## 📚 相关文档

- [Mastra官方文档](https://mastra.ai/docs)
- [@mastra/client-js NPM页面](https://www.npmjs.com/package/@mastra/client-js)
- [项目README](../README.md)
- [合同审查功能文档](./CONTRACT_REVIEW.md)
