# 学习路径设计器 (Learning Path Designer) Demo

融合 AI Native Onboarding Copilot + Nexus Forge 设计理念的游戏行业新人智能陪跑平台 Demo。

## 🚀 公网访问

> **🔗 在线地址**: [https://study-v1-d1gyvvebx98b3bd65-1325664181.tcloudbaseapp.com/](https://study-v1-d1gyvvebx98b3bd65-1325664181.tcloudbaseapp.com/?v=20260607)

## 📦 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 路由 | React Router v6 (HashRouter) |
| 动画 | Framer Motion 11 |
| 图标 | Lucide React |
| 图表 | Recharts |
| 部署 | 腾讯云 CloudBase 静态托管 |

## 🎯 Demo 页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 Dashboard | `#/` | 能力雷达图 + 入职天数 + 功能入口 |
| AI 任务教练 | `#/coach` | 对话式任务拆解 + 子任务/Prompt/工具 |
| 学习路径 | `#/path` | 三阶段12周时间轴 + 周任务卡片 |
| 工作流库 | `#/workflow` | 5岗位切换 + 流程图展开 |

## 🛠️ 本地开发

```bash
cd learning-path-designer
npm install
npm run dev          # → http://localhost:5174/
npm run build        # 构建 dist/
```

## ☁️ CloudBase 部署信息

| 项目 | 值 |
|------|-----|
| 环境 ID | `study-v1-d1gyvvebx98b3bd65` |
| 环境名称 | study-v1 |
| 区域 | 上海 (ap-shanghai) |
| 静态托管域名 | `study-v1-d1gyvvebx98b3bd65-1325664181.tcloudbaseapp.com` |
| 控制台 | [CloudBase 管理后台](https://tcb.cloud.tencent.com/dev?envId=study-v1-d1gyvvebx98b3bd65#/static-hosting) |

## 🔑 环境变量配置

### 本地开发

1. 复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，填入你的 OpenAI API Key：
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 点击 "Create new secret key"
3. 复制生成的 API Key（以 `sk-` 开头）
4. 注意：API Key 仅在创建时显示一次，请妥善保存

### EdgeOne 部署配置

在 EdgeOne Pages 部署时，需要在部署配置中设置环境变量：

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 找到你的项目（study-v1）
3. 进入"部署配置" → "环境变量"
4. 添加环境变量：
   - 名称：`VITE_OPENAI_API_KEY`
   - 值：你的 OpenAI API Key（以 `sk-` 开头）
5. 保存并重新部署
