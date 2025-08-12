# 合同审核功能文档

## 功能概述

小包包新增了专业的合同审核功能，基于 [recodeAgent](https://github.com/juzhiqiang/recodeAgent) 的合同审核代理，使用最新的 `@mastra/client-js` 库进行集成。

## 主要特性

### 🔍 合规性审核
- 检查合同是否符合相关法律法规和行业标准
- 识别潜在的法律风险点和合规漏洞
- 提供专业的法律条款解释

### ⚠️ 风险评估
- 智能识别合同中的高风险条款
- 分析责任分配的合理性
- 评估潜在的商业风险

### 💡 合规建议
- 提供具体的改进建议和解决方案
- 风险缓解措施推荐
- 合规性最佳实践指导

### 📝 专业解释
- 用通俗易懂的语言解释复杂的法律条款
- 结构化的分析报告
- 按风险等级组织信息

## 重点审核领域

### 🛡️ 数据安全与隐私保护
- GDPR 合规性检查
- 个人信息保护法合规
- 数据处理和存储条款审核

### 🏛️ 知识产权保护
- 知识产权归属条款
- 使用权限和许可范围
- 侵权责任和保护措施

### ⚡ 服务等级协议 (SLA)
- 性能指标和可用性保证
- 故障恢复和补救措施
- 服务中断的责任界定

### ⚖️ 责任限制与赔偿
- 责任分配的合理性
- 赔偿限制条款
- 免责条款的有效性

### 🔧 技术规范要求
- 技术标准和规范
- 接口规范和数据格式
- 系统集成要求

### 🎨 用户体验标准
- 界面设计要求
- 交互规范
- 可访问性标准

## 使用方法

### 1. 进入合同审核模式

在主聊天界面，点击右上角的 "合同审核" 按钮，或者点击快捷操作中的 "帮我审核一份合同"。

### 2. 输入合同内容

有两种方式提供合同内容：

#### 方式一：直接粘贴文本
在输入框中直接粘贴合同文本内容。

#### 方式二：上传合同文件
点击 "上传文件" 按钮，支持以下格式：
- `.txt` - 纯文本文件
- `.pdf` - PDF 文档
- `.doc/.docx` - Word 文档

**文件限制：**
- 最大文件大小：10MB
- 确保文件内容清晰可读

### 3. 选择合同类型（可选）

可以通过快捷操作选择常见的合同类型：
- 数据处理服务合同
- 软件开发合同
- SaaS 服务协议
- 可视化大屏合同

### 4. 获取审核结果

系统将进行实时流式审核，并提供：
- 风险等级评估
- 详细的合规性分析
- 具体的改进建议
- 相关法律条文解释

## 技术架构

### 前端组件
- `ContractReviewChat.tsx` - 合同审核聊天界面
- `mastraClient.ts` - Mastra 客户端封装
- React Router 路由管理

### 后端服务
- 基于 [recodeAgent](https://github.com/juzhiqiang/recodeAgent) 的合同审核代理
- 使用 Mastra 框架构建
- DeepSeek AI 模型驱动

### API 集成
- `@mastra/client-js@0.10.20` - 最新版本的 Mastra 客户端
- 支持流式响应
- 完整的错误处理和重试机制

## 环境配置

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# Mastra API 配置
VITE_MASTRA_API_URL=http://localhost:4111

# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# GraphQL API 配置
VITE_GRAPHQL_ENDPOINT=https://ai-admin.juzhiqiang.shop
```

### 依赖安装

```bash
# 安装新增依赖
npm install @mastra/client-js@^0.10.20 react-router-dom@^6.28.0

# 或使用 yarn
yarn add @mastra/client-js@^0.10.20 react-router-dom@^6.28.0
```

### recodeAgent 服务部署

1. 克隆 recodeAgent 仓库：
```bash
git clone https://github.com/juzhiqiang/recodeAgent.git
cd recodeAgent
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
export DEEPSEEK_API_KEY=your_deepseek_api_key
```

4. 启动服务：
```bash
npm run dev
```

服务将在 `http://localhost:4111` 启动。

## API 接口

### Mastra 客户端方法

```typescript
import { contractReviewClient } from '../lib/mastraClient';

// 检查连接状态
const status = await contractReviewClient.checkConnection();

// 审核合同（非流式）
const result = await contractReviewClient.reviewContract(
  contractContent,
  contractType
);

// 审核合同（流式）
await contractReviewClient.reviewContractStream(
  contractContent,
  contractType,
  onChunk,
  onComplete,
  onError
);
```

### 响应格式

```typescript
interface ReviewResult {
  success: boolean;
  data?: {
    // AI 生成的审核结果
    content: string;
    // 其他元数据
  };
  error?: string;
}
```

## 最佳实践

### 1. 合同内容准备
- 确保合同文本完整、清晰
- 如果是扫描文档，建议先进行 OCR 处理
- 移除不必要的格式和特殊字符

### 2. 合同类型选择
- 准确选择合同类型可以获得更精准的审核结果
- 如果不确定类型，可以让系统自动识别

### 3. 审核结果处理
- 仔细阅读风险评估和建议
- 重点关注高风险条款
- 建议咨询专业法律顾问进行最终确认

### 4. 错误处理
- 检查网络连接
- 确认 Mastra 服务状态
- 查看控制台错误日志

## 故障排除

### 常见问题

#### 1. 连接失败
```
错误：无法连接到合同审核服务
解决方案：
- 检查 recodeAgent 服务是否启动
- 确认 VITE_MASTRA_API_URL 配置正确
- 检查防火墙设置
```

#### 2. API 密钥错误
```
错误：DEEPSEEK_API_KEY 无效
解决方案：
- 检查 DeepSeek API Key 是否正确
- 确认 API Key 是否有足够的配额
- 重新生成 API Key
```

#### 3. 文件上传失败
```
错误：文件格式不支持
解决方案：
- 确认文件格式为 .txt、.pdf、.doc 或 .docx
- 检查文件大小是否超过 10MB
- 尝试转换为纯文本格式
```

## 更新日志

### v2.0.0 (2024-08-12)
- ✨ 新增合同审核功能
- 🔧 集成 @mastra/client-js@0.10.20
- 🚀 支持流式响应
- 📁 支持文件上传
- 🎨 全新的合同审核界面设计
- 🔄 添加 React Router 路由管理

## 贡献指南

欢迎为合同审核功能贡献代码！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/contract-review-enhancement`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送到分支：`git push origin feature/contract-review-enhancement`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

## 相关链接

- [recodeAgent 仓库](https://github.com/juzhiqiang/recodeAgent)
- [Mastra 官方文档](https://mastra.ai/)
- [@mastra/client-js 文档](https://www.npmjs.com/package/@mastra/client-js)
- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
