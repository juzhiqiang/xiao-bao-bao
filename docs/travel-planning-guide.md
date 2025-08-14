# 旅游规划模块使用指南

## 概述

小包包项目新增了旅游规划功能，通过集成 `recodeAgent` 项目中的旅游 agent，为用户提供智能的旅游路线规划服务。

## 功能特点

### 🎯 核心功能
- **智能路线规划**: 根据地理位置优化旅行路线
- **个性化推荐**: 支持经济型、舒适型、奢华型三种旅行风格
- **详细行程安排**: 提供逐日行程和景点推荐
- **预算估算**: 根据旅行风格估算费用
- **实用建议**: 提供旅行贴士和注意事项

### 🌍 支持的目的地
- **欧洲**: 巴黎、伦敦、罗马、巴塞罗那、阿姆斯特丹、布鲁塞尔
- **亚洲**: 东京、京都、大阪、首尔、新加坡、曼谷
- **北美**: 纽约、洛杉矶、旧金山、芝加哥、多伦多
- **中国**: 北京、上海、广州、西安、成都、杭州

## 项目架构

### 新增文件

```
src/
├── components/
│   ├── TravelPlanningChat.tsx     # 旅游规划聊天组件
│   └── Navigation.tsx             # 导航组件
├── lib/
│   └── travelAPI.ts              # 旅游 API 服务层
└── App.tsx                       # 更新的路由配置
```

### 技术架构

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   前端界面      │────│   API 服务层     │────│   recodeAgent   │
│ TravelPlanning  │    │   travelAPI.ts   │    │   旅游 Agent    │
│     Chat        │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 使用方法

### 1. 访问旅游规划模块

通过以下方式访问旅游规划功能：

- **URL 直接访问**: `https://your-domain.com/travel-planning`
- **导航栏切换**: 点击页面顶部的"旅游规划"按钮
- **路由跳转**: 使用 React Router 导航到 `/travel-planning`

### 2. 快速规划表单

点击"快速规划"按钮，填写以下信息：

```typescript
interface TravelForm {
  destinations: string;     // 目的地（逗号分隔）
  travelStyle: string;      // 旅行风格
  duration: number;         // 旅行天数
  startLocation?: string;   // 出发地（可选）
}
```

**示例**:
- 目的地: `巴黎, 伦敦, 罗马`
- 旅行风格: `舒适型`
- 旅行天数: `7`
- 出发地: `北京`

### 3. 自然语言对话

直接在聊天框中输入需求：

**示例输入**:
- "我想去日本旅游7天，预算充足"
- "帮我规划一个欧洲三国游，经济实惠一点"
- "推荐一个美国西海岸的自驾路线"

### 4. 快捷选项

使用预设的快捷选项快速开始对话：
- 🇪🇺 欧洲三国游（法国-意大利-西班牙）
- 🇯🇵 日本深度游（东京-京都-大阪）
- 🇺🇸 美国西海岸（洛杉矶-旧金山-西雅图）
- 🇨🇳 中国古都游（北京-西安-南京）
- 🌴 东南亚海岛游（泰国-马来西亚-新加坡）
- 🏔️ 瑞士阿尔卑斯山区游

## API 集成

### 环境配置

在 `.env` 文件中配置：

```bash
# RecodeAgent API Configuration
VITE_RECODE_AGENT_API_URL=https://hello-mastra.juzhiqiang.workers.dev
```

### API 服务层

`src/lib/travelAPI.ts` 提供了完整的 API 服务：

#### 主要方法

```typescript
// 智能旅游规划（推荐使用）
await travelAPIService.smartTravelPlanning(input);

// 直接调用路线规划工具
await travelAPIService.planTravelRoute(request);

// 与旅游 agent 对话
await travelAPIService.chatWithTravelAgent(request);

// 执行完整工作流
await travelAPIService.executeTravelWorkflow(request);
```

#### 数据结构

```typescript
// 请求参数
interface TravelRouteRequest {
  destinations: string[];
  travelStyle?: 'budget' | 'comfort' | 'luxury';
  duration?: number;
  startLocation?: string;
}

// 响应数据
interface TravelRouteResponse {
  route: TravelDestination[];
  totalDistance: number;
  totalDuration: number;
  estimatedBudget: string;
  bestTravelTime: string;
  tips: string[];
}
```

## 旅行风格说明

### 🎒 经济型 (Budget)
- **交通**: 公共交通、经济航班
- **住宿**: 青年旅社、经济型酒店
- **餐饮**: 当地美食街、市场
- **预算**: ¥200-300/天

### 🏨 舒适型 (Comfort)
- **交通**: 高铁、商务航班
- **住宿**: 中档酒店、精品民宿
- **餐饮**: 特色餐厅、当地美食
- **预算**: ¥500-800/天

### 💎 奢华型 (Luxury)
- **交通**: 头等舱、私人包车
- **住宿**: 五星级酒店、度假村
- **餐饮**: 米其林餐厅、私人厨师
- **预算**: ¥1200-2600/天

## 示例输出

### 路线规划结果

```markdown
# 🗺️ 您的专属旅游路线规划

## 📋 行程概览
🎯 **目的地**: 巴黎 → 伦敦 → 罗马
⏰ **总天数**: 7天
🛣️ **总距离**: 2845公里
💰 **预算范围**: ¥8,500 - ¥11,050
🌟 **最佳时间**: 春季和秋季是大多数目的地的最佳旅行时间

## 🛤️ 详细路线安排

### 📍 第1站：巴黎
**📍 位置**: 法国, 法兰西岛
**⏱️ 建议停留**: 3天
**🚗 交通方式**: 商务航班
**💵 预估花费**: ¥500-750/天

**🎯 必游景点**:
- 埃菲尔铁塔
- 卢浮宫
- 圣母院
- 香榭丽舍大街
- 凯旋门

**📝 目的地介绍**: 浪漫之都巴黎，拥有世界级的艺术博物馆、优雅的建筑和美食文化

---

### 📍 第2站：伦敦
**📍 位置**: 英国, 英格兰
**⏱️ 建议停留**: 2天
**🚗 交通方式**: 高铁/快车
**💵 预估花费**: ¥500-750/天

**🎯 必游景点**:
- 大本钟
- 白金汉宫
- 伦敦眼
- 大英博物馆
- 塔桥

---

### 📍 第3站：罗马
**📍 位置**: 意大利, 拉齐奥
**⏱️ 建议停留**: 2天
**🚗 交通方式**: 商务航班
**💵 预估花费**: ¥500-750/天

**🎯 必游景点**:
- 斗兽场
- 梵蒂冈
- 特雷维喷泉
- 万神殿
- 西班牙阶梯

## 💡 实用旅行贴士
- 提前预订住宿和交通，可以获得更好的价格
- 建议购买旅行保险，确保旅途安全
- 准备好各国的签证和护照，检查有效期
- 下载离线地图和翻译APP，方便出行
```

## 错误处理

### 常见错误及处理

1. **网络连接错误**
   ```
   🌐 网络连接错误，请检查网络设置或稍后再试
   ```

2. **服务不可用**
   ```
   🔍 旅游规划服务暂时不可用，请稍后再试
   ```

3. **输入验证错误**
   ```
   请至少输入一个目的地
   目的地数量不能超过10个
   旅行天数应在1-30天之间
   ```

### 错误恢复机制

- 自动重试机制
- 降级到基础功能
- 用户友好的错误提示
- 快捷操作建议

## 性能优化

### 前端优化
- React.memo 优化组件渲染
- 防抖处理用户输入
- 虚拟滚动处理长消息列表
- 图片懒加载

### API 优化
- 请求缓存机制
- 智能路由选择
- 错误重试策略
- 超时处理

## 开发指南

### 本地开发

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
   # 编辑 .env 文件，配置 API 地址
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问旅游规划模块**
   ```
   http://localhost:3000/travel-planning
   ```

### 组件使用

```tsx
import { TravelPlanningChat } from './components';

function App() {
  return (
    <div className="App">
      <TravelPlanningChat />
    </div>
  );
}
```

### API 服务使用

```tsx
import { travelAPIService } from './lib/travelAPI';

// 使用智能规划服务
const response = await travelAPIService.smartTravelPlanning({
  destinations: ['巴黎', '伦敦'],
  travelStyle: 'comfort',
  duration: 5
});

console.log(response.content);
```

## 部署配置

### 环境变量

```bash
# 生产环境
VITE_RECODE_AGENT_API_URL=https://hello-mastra.juzhiqiang.workers.dev

# 开发环境
VITE_RECODE_AGENT_API_URL=http://localhost:8000
```

### 构建部署

```bash
npm run build
npm run deploy
```

## 故障排除

### 常见问题

1. **API 调用失败**
   - 检查网络连接
   - 验证 API 地址配置
   - 查看浏览器控制台错误

2. **组件渲染异常**
   - 检查 React 版本兼容性
   - 验证依赖安装完整性
   - 查看开发者工具错误信息

3. **路由不工作**
   - 确认 react-router-dom 版本
   - 检查路由配置
   - 验证导航组件设置

### 调试技巧

1. **开启详细日志**
   ```typescript
   // 在 travelAPI.ts 中开启调试
   console.log('API Request:', requestData);
   console.log('API Response:', response);
   ```

2. **网络请求监控**
   - 使用浏览器开发者工具
   - 查看 Network 标签页
   - 检查 API 请求和响应

3. **组件状态调试**
   - 使用 React Developer Tools
   - 监控组件状态变化
   - 检查 props 传递

## 版本更新

### v2.2.0 新功能
- ✨ 新增旅游规划聊天组件
- 🗺️ 集成 recodeAgent 旅游 agent
- 🧭 添加智能导航组件
- 📱 响应式设计优化
- 🎨 全新的旅游主题UI

### 兼容性说明
- React 18+
- TypeScript 5+
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)

## 贡献指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 组件使用函数式写法
- API 调用需要错误处理

### 提交规范
```bash
git commit -m "feat(travel): add route optimization algorithm"
git commit -m "fix(travel): resolve API timeout issue"
git commit -m "docs(travel): update usage guide"
```

## 技术支持

- **GitHub Issues**: [提交问题](https://github.com/juzhiqiang/xiao-bao-bao/issues)
- **文档站点**: [完整文档](https://juzhiqiang.github.io/xiao-bao-bao)
- **示例演示**: [在线演示](https://juzhiqiang.github.io/xiao-bao-bao/travel-planning)

---

🎉 享受您的智能旅游规划体验！
