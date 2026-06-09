/**
 * AI 学习路径生成服务
 * 调用 OpenAI API 生成个性化的 12 周学习路径
 */

import { WeekTask, PhaseName, EmployeeProfile } from "../types";

export interface LearningPathGenerationResult {
  phases: Array<{
    name: PhaseName;
    weeks: number[];
    color: string;
    description: string;
  }>;
  weekTasks: WeekTask[];
}

const PHASE_COLORS = ['#00C9FF', '#7B61FF', '#FF6B35'];

/**
 * 构建学习路径生成的 Prompt
 */
function buildPrompt(role: string, aiExperience: string, department: string): string {
  return `你是一个游戏行业 AI Native 组织的新人融入专家。请为以下新员工生成一份个性化的 12 周学习与融入计划。

## 新员工信息
- 岗位：${role}
- AI 使用经验：${aiExperience}
- 部门：${department}

## 生成要求

### 整体框架
12 周分为三个阶段，每阶段 4 周：

**阶段 1 - 基础融入期（第 1-4 周）**
目标：帮助新人完成从"使用AI工具"到"理解AI协作方式"的转变
- 第 1 周：公司文化与 AI Native 认知
- 第 2 周：AI 工具链基础与安全规范
- 第 3 周：Prompt 工程与任务拆解
- 第 4 周：行业 AI 应用案例学习

**阶段 2 - 岗位训练期（第 5-8 周）**
目标：将 AI 嵌入岗位真实任务，形成可复用的工作流
- 第 5 周：岗位任务拆解训练
- 第 6 周：AI 辅助产出实战
- 第 7 周：人工审查与质量控制
- 第 8 周：团队协作与知识沉淀

**阶段 3 - 业务实战期（第 9-12 周）**
目标：参与真实项目，完成可评估的人机协同交付
- 第 9 周：真实业务课题选择
- 第 10 周：AI 协同执行项目
- 第 11 周：复盘优化与迭代
- 第 12 周：成果展示与转正评估

### 输出格式
请以 JSON 格式输出，结构如下：
\`\`\`json
{
  "phases": [
    {
      "name": "基础融入期",
      "weeks": [1, 2, 3, 4],
      "color": "#00C9FF",
      "description": "阶段描述"
    }
  ],
  "weekTasks": [
    {
      "week": 1,
      "title": "周主题",
      "type": "learning",
      "status": "pending",
      "deliverables": ["交付物1", "交付物2"]
    }
  ]
}
\`\`\`

### 注意事项
1. 根据岗位（${role}）个性化调整每周的具体内容和交付物
2. 交付物要具体、可检查、与岗位相关
3. 学习方式要体现 AI 辅助特色（如：AI 教练辅助、AI 代码审查、AI 设计探索等）
4. 只输出 JSON，不要输出其他内容`;
}

/**
 * 使用 AI 生成个性化的学习路径
 * @param onProgress 进度回调
 * @returns 生成的学习路径
 */
export async function generateLearningPathWithAI(
  profile: EmployeeProfile,
  onProgress?: (status: string) => void
): Promise<LearningPathGenerationResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('未配置 API Key');
  }

  onProgress?.('正在分析岗位需求...');

  const apiBase = import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1';
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4';

  const prompt = buildPrompt(profile.role, profile.aiExperience, profile.department);

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的游戏行业新人培养专家，擅长设计学习路径。请严格按照要求的 JSON 格式输出。'
        },
        { role: 'user', content: prompt }
      ],
      stream: false,
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `API 调用失败 (${response.status})`;
    try {
      const err = JSON.parse(errorText);
      errorMsg = err.error?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  onProgress?.('AI 正在设计学习路径...');

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('AI 返回内容为空');
  }

  onProgress?.('正在解析学习路径...');

  // 解析 AI 返回的 JSON
  let result: LearningPathGenerationResult;
  try {
    // 尝试提取 JSON 内容（可能被 markdown 代码块包裹）
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonStr = jsonMatch[1]?.trim() || content.trim();
    result = JSON.parse(jsonStr);

    // 验证数据结构
    if (!result.phases || !result.weekTasks || result.weekTasks.length !== 12) {
      throw new Error('返回的学习路径格式不正确');
    }

    // 为每个阶段设置默认颜色，确保 name 类型正确
    result.phases = result.phases.map((phase, i) => ({
      ...phase,
      name: (phase.name || '基础融入期') as '基础融入期' | '岗位训练期' | '业务实战期',
      color: phase.color || PHASE_COLORS[i % PHASE_COLORS.length],
    }));

    // 确保所有周任务状态为 pending
    result.weekTasks = result.weekTasks.map(task => ({
      ...task,
      status: 'pending' as const,
    }));

  } catch (parseError) {
    throw new Error('解析 AI 返回的学习路径失败，请重试');
  }

  onProgress?.('学习路径生成完成！');

  return result;
}
