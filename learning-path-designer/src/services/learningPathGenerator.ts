/**
 * AI 学习路径生成服务
 * 优先通过 CloudBase 云函数 ai-proxy 代理调用 OpenAI 兼容 API
 * 云函数不可用时，自动降级到本地智能生成器
 */

import { WeekTask, PhaseName, EmployeeProfile } from "../types";
import { app } from "../config/cloudbase";
import { generateLocalLearningPath } from "./localPathGenerator";

export interface LearningPathGenerationResult {
  phases: Array<{
    name: PhaseName;
    weeks: number[];
    color: string;
    description: string;
  }>;
  weekTasks: WeekTask[];
}

const PHASE_COLORS = ["#00C9FF", "#7B61FF", "#FF6B35"];

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
请以 JSON 格式输出，结构如下（注意 phases[].name 只能是"基础融入期"、"岗位训练期"、"业务实战期"三者之一）：
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

async function callAiProxy(messages: { role: string; content: string }[]): Promise<string> {
  const res: any = await (app as any).callFunction({
    name: "ai-proxy",
    data: { messages, model: undefined, max_tokens: 4096, temperature: 0.7 },
  });

  if (!res.result?.success) {
    const errMsg = res.result?.error || `云函数调用失败 (code: ${res.result?.code || "unknown"})`;
    throw new Error(errMsg);
  }

  const content = res.result.content || "";
  if (!content) {
    throw new Error("AI 返回内容为空");
  }
  return content;
}

/**
 * 使用 AI 生成个性化的学习路径
 * 优先尝试云函数，失败时自动降级到本地智能生成
 */
export async function generateLearningPathWithAI(
  profile: EmployeeProfile,
  onProgress?: (status: string) => void
): Promise<LearningPathGenerationResult> {
  onProgress?.("正在分析岗位需求...");

  const prompt = buildPrompt(profile.role, profile.aiExperience, profile.department);

  // 尝试通过云函数调用 AI API
  try {
    const content = await callAiProxy([
      {
        role: "system",
        content:
          "你是一个专业的游戏行业新人培养专家，擅长设计学习路径。请严格按照要求的 JSON 格式输出，只输出 JSON 不要输出其他内容。",
      },
      { role: "user", content: prompt },
    ]);

    onProgress?.("AI 正在设计学习路径...");

    let parsedResult: LearningPathGenerationResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      parsedResult = JSON.parse(jsonStr);

      if (!parsedResult.phases || !parsedResult.weekTasks || parsedResult.weekTasks.length !== 12) {
        throw new Error("返回的学习路径格式不正确，缺少 phases 或 weekTasks");
      }

      parsedResult.phases = parsedResult.phases.map((phase, i) => ({
        ...phase,
        name: (phase.name || "基础融入期") as "基础融入期" | "岗位训练期" | "业务实战期",
        color: phase.color || PHASE_COLORS[i % PHASE_COLORS.length],
      }));

      const validTypes = ["learning", "practice", "collaboration"] as const;
      parsedResult.weekTasks = parsedResult.weekTasks.map((task, i) => ({
        ...task,
        week: task.week || i + 1,
        type: validTypes.includes(task.type as any) ? task.type as typeof validTypes[number] : "learning",
        status: "pending" as const,
      }));
    } catch (e: any) {
      throw new Error(`解析 AI 返回的学习路径失败: ${e.message}`);
    }

    onProgress?.("学习路径生成完成！");
    return parsedResult;
  } catch (cloudErr: any) {
    // 云函数调用失败，降级到本地智能生成
    console.warn("[AI Path] 云函数调用失败，降级到本地生成:", cloudErr.message || cloudErr);
    onProgress?.("云端 AI 服务暂不可用，正在使用本地智能引擎生成...");

    // 模拟 AI "思考" 延迟，让用户体验更自然
    await new Promise((r) => setTimeout(r, 800));
    onProgress?.("正在根据岗位特征匹配最佳学习方案...");
    await new Promise((r) => setTimeout(r, 600));
    onProgress?.("正在生成个性化交付物清单...");
    await new Promise((r) => setTimeout(r, 500));

    const localResult = generateLocalLearningPath(profile);

    onProgress?.("学习路径生成完成！");
    return localResult;
  }
}
