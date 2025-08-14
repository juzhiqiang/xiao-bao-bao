# 旅游规划功能使用指南

## 🗺️ 功能概述

旅游规划功能是小包包 (XiaoBaoBao) 项目中的核心模块之一，基于 **@mastra/client-js SDK** 构建，提供智能化、个性化的旅游路线规划服务。

### ✨ 核心特性

- **🤖 基于 Mastra SDK**: 使用官方 @mastra/client-js 进行 AI Agent 集成
- **🎯 智能路线规划**: 根据目的地和偏好自动优化旅行路线
- **💰 预算智能估算**: 支持经济型、舒适型、奢华型三种旅行风格
- **🌍 全球目的地支持**: 涵盖全球主要旅游城市和景点
- **📱 多种交互方式**: 支持自然语言对话和快捷表单两种规划方式
- **🔧 完整调试功能**: 内置 API 连接测试和详细调试信息

## 🚀 快速开始

### 1. 环境配置

确保在 `.env` 文件中配置了正确的 Mastra API 地址：

```bash
# Mastra API 配置 (旅游规划功能)
VITE_RECODE_AGENT_API_URL=https://agent.juzhiqiang.shop
VITE_MASTRA_API_URL=https://agent.juzhiqiang.shop
```

### 2. 基本使用

1. **访问旅游规划页面**: 点击导航栏的"旅游规划"按钮
2. **选择交互方式**:
   - **快速规划**: 使用表单快速输入目的地、风格、天数等信息
   - **自然对话**: 直接描述您的旅游需求，AI 会理解并规划

### 3. 使用示例

#### 快速规划表单
```
目的地: 巴黎, 伦敦, 阿姆斯特丹
旅行风格: 舒适型
旅行天数: 10天
出发地: 北京 (可选)
```

#### 自然语言对话
```
"我想去欧洲旅游，预算充足，时间大概2周，希望能去法国、意大利和西班牙"

"帮我规划一个日本7日游，我比较喜欢文化古迹，预算中等"

"想要一个经济实惠的东南亚行程，10天左右，从广州出发"
```

## 🎯 旅行风格说明

### 🎒 经济型 (Budget)
- **预算范围**: ¥200-300/天
- **住宿标准**: 青年旅社、经济型酒店
- **交通方式**: 公共交通、廉价航空
- **餐饮标准**: 当地小吃、快餐为主
- **适合人群**: 背包客、学生、预算有限的旅行者

### 🏨 舒适型 (Comfort)
- **预算范围**: ¥500-800/天
- **住宿标准**: 三星级酒店、精品民宿
- **交通方式**: 火车、正常航班、偶尔打车
- **餐饮标准**: 当地特色餐厅、中档餐饮
- **适合人群**: 普通旅行者、家庭出游、商务休闲

### 💎 奢华型 (Luxury)
- **预算范围**: ¥1200-2600/天
- **住宿标准**: 五星级酒店、豪华度假村
- **交通方式**: 商务舱、头等舱、专车服务
- **餐饮标准**: 米其林餐厅、高端料理
- **适合人群**: 高端旅行者、蜜月旅行、商务高管

## 🛠️ 技术架构

### 核心技术栈

```typescript
// 主要依赖
- @mastra/client-js: 官方 Mastra SDK
- React + TypeScript: 前端框架
- Tailwind CSS: 样式框架
- React Markdown: Markdown 渲染
```

### API 服务层架构

```
src/lib/travelAPI.ts
├── TravelAPIService: 主服务类
├── Mastra Client: SDK 客户端
├── Agent 调用: travelRouteAgent
├── Tool 调用: travelRouteTool  
├── Workflow 调用: travelRouteWorkflow
└── 错误处理 & 调试功能
```

### Mastra SDK 集成

```typescript
// 初始化 Mastra 客户端
const mastraClient = new Mastra({
  baseUrl: 'https://agent.juzhiqiang.shop'
});

// Agent 调用示例
const result = await mastraClient.agents.run({
  agentId: 'travelRouteAgent',
  input: '请为我规划日本7日游'
});

// Tool 调用示例
const routeResult = await mastraClient.tools.run({
  toolId: 'travelRouteTool',
  input: {
    destinations: ['东京', '京都', '大阪'],
    travelStyle: 'comfort',
    duration: 7
  }
});

// Workflow 调用示例
const workflowResult = await mastraClient.workflows.run({
  workflowId: 'travelRouteWorkflow',
  input: { /* 旅游请求数据 */ }
});
```

## 🔧 调试功能

### 内置调试工具

旅游规划模块提供了完整的调试功能，帮助开发者和用户诊断问题：

#### 1. API 连接测试
- **位置**: 页面右上角"测试连接"按钮
- **功能**: 检测 Mastra API 连接状态
- **显示**: 连接状态指示器 (绿色✅/红色❌/黄色🔄)

#### 2. 调试信息面板
- **位置**: 页面右上角"调试信息"按钮
- **内容**: 
  - Mastra API 连接详情
  - 可用 Agents、Tools、Workflows 列表
  - 错误信息和诊断建议

#### 3. 系统消息
- **自动显示**: 连接成功/失败的详细信息
- **实时更新**: API 状态变化时自动提示
- **用户友好**: 清晰的错误说明和解决建议

### 调试 API 调用

```typescript
// 获取可用服务
const agents = await travelAPIService.getAvailableAgents();
const tools = await travelAPIService.getAvailableTools();
const workflows = await travelAPIService.getAvailableWorkflows();

// 测试连接
const connectionTest = await travelAPIService.testConnection();
console.log('Connection result:', connectionTest);

// 检查健康状态
const isHealthy = await travelAPIService.checkHealth();
console.log('API Health:', isHealthy);
```

## 📋 API 接口说明

### 主要接口

#### 1. 智能旅游规划
```typescript
// 文本输入
const response = await travelAPIService.smartTravelPlanning(
  "我想去日本旅游7天，预算充足"
);

// 结构化输入
const response = await travelAPIService.smartTravelPlanning({
  destinations: ['东京', '京都', '大阪'],
  travelStyle: 'comfort',
  duration: 7,
  startLocation: '北京'
});
```

#### 2. Agent 对话
```typescript
const response = await travelAPIService.chatWithTravelAgent({
  messages: [
    { role: 'user', content: '帮我规划欧洲三国游' }
  ]
});
```

#### 3. 路线规划工具
```typescript
const routeResult = await travelAPIService.planTravelRoute({
  destinations: ['巴黎', '伦敦', '罗马'],
  travelStyle: 'luxury',
  duration: 14
});
```

#### 4. 工作流执行
```typescript
const workflowResult = await travelAPIService.executeTravelWorkflow({
  destinations: ['泰国', '马来西亚', '新加坡'],
  travelStyle: 'budget',
  duration: 10
});
```

## 🌍 支持的目的地

### 欧洲
- 法国: 巴黎、尼斯、里昂
- 英国: 伦敦、爱丁堡、曼彻斯特
- 意大利: 罗马、佛罗伦萨、威尼斯
- 西班牙: 巴塞罗那、马德里、塞维利亚
- 荷兰: 阿姆斯特丹、海牙
- 比利时: 布鲁塞尔、布鲁日

### 亚洲
- 日本: 东京、京都、大阪、名古屋
- 韩国: 首尔、釜山、济州岛
- 新加坡: 新加坡市
- 泰国: 曼谷、清迈、普吉岛
- 马来西亚: 吉隆坡、槟城

### 北美
- 美国: 纽约、洛杉矶、旧金山、芝加哥、拉斯维加斯
- 加拿大: 多伦多、温哥华、蒙特利尔

### 中国
- 一线城市: 北京、上海、广州、深圳
- 古都: 西安、南京、洛阳
- 旅游城市: 杭州、成都、厦门、青岛

## 📱 使用技巧

### 1. 最佳实践

**描述需求时包含以下信息**:
- 🎯 明确的目的地或地区
- ⏰ 旅行时间长度
- 💰 预算范围或旅行风格偏好
- 🏃‍♂️ 旅行节奏 (紧凑/休闲)
- 🎨 兴趣偏好 (文化/自然/美食/购物)

**示例**:
```
"我想去日本关西地区旅游8天，预算中等，比较喜欢传统文化和美食，
不想行程太紧张，希望有充足时间体验当地生活"
```

### 2. 快捷操作

- **快速开始**: 使用预设的快捷选项开始对话
- **表单规划**: 结构化输入获得更精确的规划
- **实时调整**: 根据 AI 建议进行对话式调整
- **保存结果**: 复制规划结果进行后续编辑

### 3. 问题排查

**常见问题及解决方案**:

1. **API 连接失败**
   - 检查网络连接
   - 点击"测试连接"按钮查看详细错误
   - 查看"调试信息"面板了解服务状态

2. **没有得到预期结果**
   - 尝试更详细地描述需求
   - 使用快速规划表单提供结构化输入
   - 分步骤进行对话，逐步细化需求

3. **响应时间较长**
   - 复杂的多城市规划需要更多计算时间
   - 可以先规划单一目的地，再扩展
   - 网络状况可能影响响应速度

## 🔄 错误处理

### 自动错误恢复

系统具备智能的错误恢复机制：

1. **工具调用失败** → 自动降级到 Agent 对话
2. **网络超时** → 重试机制和友好提示
3. **API 错误** → 详细错误信息和解决建议
4. **输入验证** → 实时表单验证和错误提示

### 错误类型说明

```typescript
// 网络错误
"🌐 网络连接错误，请检查网络设置或稍后再试"

// 服务不可用
"🔍 旅游规划服务暂时不可用，请稍后再试"

// 服务器错误
"⚠️ 服务器内部错误，请稍后再试"

// 请求超时
"⏱️ 请求超时，请稍后再试"
```

## 📈 性能优化

### 1. 智能路由
- 根据输入类型自动选择最合适的 API 调用方式
- 结构化数据优先使用 Tool 调用
- 自然语言优先使用 Agent 对话

### 2. 缓存机制
- 常用目的地信息本地缓存
- API 响应结果适当缓存
- 减少重复的 API 调用

### 3. 用户体验
- 实时状态指示器
- 流式响应显示 (Planning...)
- 智能错误恢复和降级

## 🚀 未来规划

### v2.3 计划功能
- **🎫 预订集成**: 集成酒店、机票预订功能
- **📊 预算跟踪**: 详细的预算分解和跟踪
- **🗓️ 日程管理**: 精确到小时的行程安排
- **📱 移动优化**: 响应式设计优化
- **🌐 多语言**: 支持英文、日文等多语言规划

### 技术改进
- **⚡ 性能优化**: 更快的响应速度
- **🔧 工具扩展**: 更多专业旅游工具
- **🤖 AI 增强**: 更智能的推荐算法
- **📊 数据分析**: 用户偏好学习和个性化

## 🤝 贡献指南

### 开发环境设置

```bash
# 1. 克隆项目
git clone https://github.com/juzhiqiang/xiao-bao-bao.git
cd xiao-bao-bao

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置 VITE_RECODE_AGENT_API_URL

# 4. 启动开发服务器
npm run dev
```

### 代码结构

```
src/components/TravelPlanningChat.tsx  # 主组件
src/lib/travelAPI.ts                   # API 服务层
docs/travel-planning-guide.md          # 使用文档
```

### 提交代码

1. 遵循现有的代码风格
2. 添加适当的类型注解
3. 更新相关文档
4. 提交前进行充分测试

## 📞 支持与反馈

- **项目地址**: [GitHub Repository](https://github.com/juzhiqiang/xiao-bao-bao)
- **在线演示**: [旅游规划演示](https://juzhiqiang.github.io/xiao-bao-bao/travel-planning)
- **问题反馈**: [GitHub Issues](https://github.com/juzhiqiang/xiao-bao-bao/issues)
- **功能建议**: 欢迎在 Issues 中提出改进建议

---

🌟 **享受您的智能旅游规划体验！** 让 AI 帮您发现世界上最美好的地方！ ✈️🗺️
