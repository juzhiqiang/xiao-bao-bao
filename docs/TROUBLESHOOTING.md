# 故障排除指南

## 🚨 常见问题与解决方案

### 1. @mastra/client-js 导入错误

#### 问题描述
```
error TS2305: Module '"@mastra/client-js"' has no exported member 'Mastra'.
```

#### 解决方案
✅ **已修复**: 系统已添加兼容性导入和 fallback 机制。

**检查步骤**:
1. 确认依赖已安装：`npm install @mastra/client-js`
2. 查看浏览器控制台，确认是否使用 fallback 模式
3. 如果使用 fallback，旅游规划功能仍然可用（使用模拟数据）

#### Fallback 模式说明
- 系统检测到导入失败时会自动启用
- 提供基本的旅游规划功能
- 显示 "⚠️ 使用回退模式" 的状态信息

### 2. API 连接失败 (404 错误)

#### 问题描述
```
https://agent.juzhiqiang.shop/api/agents/run - 404 Not Found
```

#### 解决方案
✅ **已修复**: 改用 @mastra/client-js SDK 而非直接 REST 调用。

**检查步骤**:
1. 点击页面右上角的"测试连接"按钮
2. 查看"调试信息"面板了解详细状态
3. 检查环境变量配置是否正确

#### API 调用方式更新
- **旧方式**: 直接 fetch() 调用 REST API
- **新方式**: 使用 MastraClient SDK

### 3. 旅游规划功能无响应

#### 问题排查

1. **检查 API 连接状态**
   ```
   页面右上角查看连接状态指示器：
   - 🟢 绿色: API 连接正常
   - 🔴 红色: API 连接失败
   - 🟡 黄色: 正在检测中
   ```

2. **查看调试信息**
   - 点击"调试信息"按钮
   - 查看可用的 Agents、Tools、Workflows
   - 确认是否找到 travelRouteAgent

3. **检查浏览器控制台**
   ```javascript
   // 查看详细的 API 调用日志
   console.log('Mastra connection test:', result);
   console.log('Available agents:', agents);
   ```

#### 常见解决方案

**方案 1: 重新测试连接**
- 点击"测试连接"按钮
- 等待连接状态更新

**方案 2: 使用 Fallback 模式**
- 即使 API 不可用，fallback 模式仍提供基本功能
- 可以体验旅游规划的界面和流程

**方案 3: 检查网络环境**
- 确认可以访问 https://agent.juzhiqiang.shop
- 检查防火墙或代理设置

### 4. 环境变量配置问题

#### 检查配置文件

1. **复制环境变量模板**
   ```bash
   cp .env.example .env
   ```

2. **确认必要的环境变量**
   ```bash
   # 必须配置
   VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
   VITE_RECODE_AGENT_API_URL=https://agent.juzhiqiang.shop
   VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

### 5. 构建错误

#### TypeScript 编译错误

**常见错误**: 类型定义问题
```
Property 'agents' does not exist on type '...'
```

**解决方案**: 已添加 `any` 类型处理
```typescript
private mastraClient: any; // 使用 any 类型避免编译错误
```

#### 依赖安装问题

**检查依赖**:
```bash
npm install
# 或
yarn install
```

**清理重装**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. 运行时错误

#### 网络请求失败

**错误信息**: `fetch failed` 或 `network error`

**解决步骤**:
1. 检查网络连接
2. 确认 API 服务器状态
3. 查看浏览器网络面板
4. 检查 CORS 配置

#### React 组件错误

**错误信息**: 组件渲染失败

**检查步骤**:
1. 打开 React Developer Tools
2. 查看组件状态和 props
3. 检查控制台错误信息
4. 确认所有必要的 props 都已传递

### 7. 功能测试

#### 基础功能测试

1. **页面加载**
   - ✅ 导航栏显示正常
   - ✅ 页面内容完整显示
   - ✅ 没有控制台错误

2. **API 连接测试**
   - ✅ 连接状态指示器显示状态
   - ✅ "测试连接"按钮可点击
   - ✅ 调试信息面板可打开

3. **旅游规划测试**
   - ✅ 快速规划表单可填写
   - ✅ 自然语言输入可发送
   - ✅ 系统有响应（真实 API 或 fallback）

#### 高级功能测试

1. **真实 API 模式**
   - ✅ 连接状态显示绿色
   - ✅ 能获取到真实的 Agents 列表
   - ✅ 旅游规划返回 AI 生成的内容

2. **Fallback 模式**
   - ✅ 连接状态显示错误信息
   - ✅ 系统消息提示使用 fallback
   - ✅ 仍能生成模拟的旅游规划

### 8. 开发环境设置

#### 本地开发配置

1. **克隆项目**
   ```bash
   git clone https://github.com/juzhiqiang/xiao-bao-bao.git
   cd xiao-bao-bao
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件中的 API 地址
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   ```
   http://localhost:5173/travel-planning
   ```

#### 生产环境部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **部署到 GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **访问在线版本**
   ```
   https://juzhiqiang.github.io/xiao-bao-bao/travel-planning
   ```

## 🔧 调试技巧

### 1. 使用浏览器开发者工具

**Console 面板**:
- 查看 API 调用日志
- 检查错误信息
- 监控系统状态

**Network 面板**:
- 监控 API 请求
- 检查响应状态码
- 查看请求/响应内容

**React Developer Tools**:
- 检查组件状态
- 监控 props 变化
- 调试组件渲染

### 2. 系统内置调试功能

**连接测试**:
```typescript
const result = await travelAPIService.testConnection();
console.log('Connection test result:', result);
```

**获取服务信息**:
```typescript
const agents = await travelAPIService.getAvailableAgents();
const tools = await travelAPIService.getAvailableTools();
const workflows = await travelAPIService.getAvailableWorkflows();
```

**检查健康状态**:
```typescript
const isHealthy = await travelAPIService.checkHealth();
console.log('API Health:', isHealthy);
```

### 3. 日志分析

**正常运行日志**:
```
Testing Mastra connection to: https://agent.juzhiqiang.shop
Connection test - Available agents: [...]
✅ Mastra API 连接正常，已找到旅游规划 Agent
```

**Fallback 模式日志**:
```
Failed to import @mastra/client-js, using fallback implementation
⚠️ 使用回退模式，@mastra/client-js 导入失败
```

## 📞 获取帮助

如果以上解决方案都无法解决问题，请：

1. **提交 Issue**: [GitHub Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues)
2. **包含信息**:
   - 错误信息截图
   - 浏览器控制台日志
   - 环境信息（操作系统、浏览器版本）
   - 重现步骤

3. **查看文档**:
   - [旅游规划使用指南](./travel-planning-guide.md)
   - [项目 README](../README.md)

---

💡 **提示**: 大多数问题都可以通过页面右上角的"测试连接"和"调试信息"功能快速诊断！
