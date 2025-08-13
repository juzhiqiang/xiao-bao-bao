# Mastra客户端升级指南

## 📋 升级概览

本次升级将合同审查模块的Mastra客户端从自定义Mock实现升级到官方的 `@mastra/client-js` 库，并更新了服务端点配置。

## 🔄 主要变更

### 1. 依赖库升级
- ✅ **新增**: `@mastra/client-js@^1.0.0`
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
});

// 使用真实的API
await mastraClient.workflows.run({ ... });
await mastraClient.workflows.stream({ ... });
```

## 🚀 新功能

### 1. 真实的Mastra API集成
- `workflows.run()` - 运行工作流
- `workflows.stream()` - 流式响应
- `workflows.list()` - 获取工作流历史
- `health.check()` - 健康检查
- `agents.list()` - 获取代理列表

### 2. 环境变量支持
```env
# .env 文件
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
```

### 3. 增强的错误处理
- 更好的连接状态检查
- 详细的错误信息
- 自动重试机制

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

## ⚙️ 配置选项

### 环境变量
- `REACT_APP_MASTRA_BASE_URL`: Mastra服务基础URL
- `VITE_MASTRA_API_URL`: Vite环境下的API URL (兼容)

### 自定义配置
```typescript
import { ContractReviewClient } from '@/lib/mastraClient';

const customClient = new ContractReviewClient({
  baseUrl: 'https://your-custom-mastra-server.com',
  apiKey: 'your-api-key',
  headers: {
    'Custom-Header': 'value'
  }
});
```

## 🔧 迁移步骤

如果你有自定义的代码使用了旧的客户端：

1. **更新导入**:
   ```typescript
   // 旧
   import { contractReviewClient } from '@/lib/mastraClient';
   
   // 新 (相同，但实现已更新)
   import { contractReviewClient } from '@/lib/mastraClient';
   ```

2. **API调用保持不变**:
   所有公共接口保持向后兼容，无需修改现有代码。

3. **安装新依赖**:
   ```bash
   npm install @mastra/client-js
   # 或
   yarn add @mastra/client-js
   ```

## 🐛 故障排除

### 连接问题
```typescript
// 检查连接状态
const status = await contractReviewClient.checkConnection();
console.log('连接状态:', status);
```

### 环境变量问题
确保 `.env` 文件包含正确的配置：
```env
REACT_APP_MASTRA_BASE_URL=https://agent.juzhiqiang.shop
```

### CORS问题
如果遇到CORS错误，请确保Mastra服务器配置了正确的CORS设置。

## 📊 性能提升

- ✅ **真实API**: 移除Mock延迟，使用真实的Mastra服务
- ✅ **流式响应**: 支持真正的流式数据传输
- ✅ **连接池**: 使用官方库的连接优化
- ✅ **错误恢复**: 自动重试和错误处理

## 🔒 安全性

- ✅ **HTTPS**: 所有通信使用加密连接
- ✅ **API密钥**: 支持API密钥认证
- ✅ **头部验证**: 自定义安全头部

---

## 🆕 版本信息

- **升级版本**: v2.1.0
- **升级日期**: 2025-08-13
- **兼容性**: 向后兼容
- **破坏性变更**: 无

如有问题，请查看 [GitHub Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues) 或联系维护团队。
