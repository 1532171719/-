# AI HR - 游戏行业 AI Native 组织新员工融入平台

> 为游戏行业 AI Native 组织的新员工提供为期三个月的"学习—实践—协作—评估"一体化融入路径。

## 📖 项目简介

本项目是一个面向游戏行业 AI Native 组织的新员工学习与融入平台 Demo，通过 AI 驱动的个性化学习路径、人机协同实战项目和游戏化学习体验，帮助新员工在 3 个月内完成从"AI 工具使用者"到"人机协同共创者"的蜕变。

**产品名称**：Nexus Forge - AI 原生游戏人才熔炉

*"Nexus"代表连接与协作，"Forge"象征锻造与成长，寓意在 AI 与人力的交融中锻造新一代游戏行业 AI Native 人才。*

## ✨ 核心功能

### 1. AI 个性化学习路径引擎
- 入职 AI 测评（多模态测评 + AI 对话面试）
- 动态学习路径调整（实时进度追踪 + 智能难度调整）
- 岗位定制化内容（策划/美术/程序/运营/测试五大岗位）

### 2. AI 学习助手与导师系统
- 多模态 AI 助手（文本/代码/图像/语音交互）
- 实时答疑与代码审查
- 智能导师匹配系统
- 学习进度跟踪与风险预警

### 3. 人机协同实战项目平台
- 50+ 实战项目库（真实游戏开发场景）
- AI 任务拆解与智能分配
- 协作工具集成（Git/Figma/Notion/企业微信）
- 项目进度管理与复盘

### 4. AI 驱动的评估与反馈系统
- 多维度评估（AI 自动评估 + 导师评价 + 同伴评价 + 自我评估）
- 技能图谱可视化与成长轨迹
- 实时反馈与最佳实践推荐
- 自动生成学习报告

### 5. 游戏化学习与社区
- 任务系统（主线/支线/每日/限时活动）
- 成就与徽章系统（100+ 成就，4 级稀有度）
- 排行榜（个人/团队/公司）
- 知识分享社区（论坛/问答/资源分享）

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm / pnpm / yarn

### 本地开发

```bash
# 进入前端项目目录
cd learning-path-designer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → 访问 http://localhost:5174/
```

### 环境变量配置

本地开发需要配置 OpenAI API Key 和 CloudBase 环境 ID：

```bash
# 复制环境变量示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API Key
# VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
# VITE_CLOUDBASE_ENV_ID=personal-d9gneosnn8b41f1a5
```

获取 API Key：访问 [OpenAI Platform](https://platform.openai.com/api-keys)

### 生产构建

```bash
cd learning-path-designer
npm run build
# 构建产物在 dist/ 目录
```

## 🌐 在线访问

**Demo 地址**: [https://personal-d9gneosnn8b41f1a5-1325664181.tcloudbaseapp.com/](https://personal-d9gneosnn8b41f1a5-1325664181.tcloudbaseapp.com/)

---

*Built with ❤️ for the future of AI-native game industry.*
