import { WorkflowTemplate } from "../types";

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'wf-planner',
    role: '游戏策划',
    title: '策划工作流：从需求到策划案',
    description: '游戏策划使用AI进行竞品分析、玩法方案生成、数值设计和策划案撰写',
    icon: '🧩',
    steps: [
      { id: 's1', label: '需求输入', role: 'human', description: '策划明确活动/系统需求' },
      { id: 's2', label: 'AI竞品分析', role: 'ai', description: 'AI分析同类产品结构和数据' },
      { id: 's3', label: 'AI玩法方案生成', role: 'ai', description: 'AI生成多种可行方案供选择' },
      { id: 's4', label: '人工筛选修改', role: 'human', description: '策划筛选方案、补充创意' },
      { id: 's5', label: 'AI数值草案', role: 'ai', description: 'AI辅助数值平衡设计' },
      { id: 's6', label: '导师评审', role: 'mentor', description: '导师审查策划案合理性' },
      { id: 's7', label: '最终策划案', role: 'human', description: '输出完整策划文档' },
    ],
  },
  {
    id: 'wf-dev',
    role: '程序开发',
    title: '程序工作流：从接口设计到代码合并',
    description: '程序开发使用AI进行模块拆解、接口生成、单元测试和代码审查',
    icon: '💻',
    steps: [
      { id: 's1', label: '需求文档', role: 'human', description: '明确功能需求和边界条件' },
      { id: 's2', label: 'AI模块拆解', role: 'ai', description: 'AI分析需求并拆解为子模块' },
      { id: 's3', label: 'AI生成接口', role: 'ai', description: 'AI生成接口定义和草案代码' },
      { id: 's4', label: '人工修改完善', role: 'human', description: '补充边界条件和业务逻辑' },
      { id: 's5', label: 'AI生成测试用例', role: 'ai', description: 'AI生成单元测试和集成测试' },
      { id: 's6', label: 'Code Review', role: 'mentor', description: '导师审查代码质量和工程规范' },
      { id: 's7', label: '合并到主干', role: 'human', description: '通过审查后合并代码' },
    ],
  },
  {
    id: 'wf-art',
    role: '美术设计',
    title: '美术工作流：从概念到成品',
    description: '美术设计使用AI进行角色设定、风格探索、参考图生成和版权审核',
    icon: '🎨',
    steps: [
      { id: 's1', label: '世界观设定', role: 'human', description: '明确美术风格和世界观方向' },
      { id: 's2', label: 'AI角色设定生成', role: 'ai', description: 'AI根据世界观生成角色设定文档' },
      { id: 's3', label: 'AI视觉关键词提取', role: 'ai', description: 'AI提取视觉关键词用于图像生成' },
      { id: 's4', label: '图像工具生成参考', role: 'ai', description: 'Midjourney/SD生成风格参考图' },
      { id: 's5', label: '人工二次设计', role: 'human', description: '筛选和优化AI生成结果' },
      { id: 's6', label: '风格与版权审核', role: 'mentor', description: '导师审核风格一致性和版权风险' },
    ],
  },
  {
    id: 'wf-qa',
    role: 'QA测试',
    title: 'QA工作流：从功能说明到测试报告',
    description: 'QA测试使用AI生成测试点、测试矩阵、边界分析和Bug聚类',
    icon: '🔍',
    steps: [
      { id: 's1', label: '功能说明输入', role: 'human', description: '提供待测试功能的详细说明' },
      { id: 's2', label: 'AI生成测试点', role: 'ai', description: 'AI分析功能覆盖所有测试维度' },
      { id: 's3', label: 'AI生成测试矩阵', role: 'ai', description: 'AI生成多维度测试矩阵' },
      { id: 's4', label: '人工补充边界', role: 'human', description: '补充边界条件和极端场景' },
      { id: 's5', label: '测试执行', role: 'human', description: '执行测试用例并记录结果' },
      { id: 's6', label: 'Bug聚类分析', role: 'ai', description: 'AI对Bug进行分类和根因分析' },
    ],
  },
  {
    id: 'wf-ops',
    role: '运营发行',
    title: '运营工作流：从活动目标到数据复盘',
    description: '运营发行使用AI进行用户分层、活动文案、A/B测试和数据复盘',
    icon: '📊',
    steps: [
      { id: 's1', label: '活动目标输入', role: 'human', description: '明确活动KPI和目标用户' },
      { id: 's2', label: 'AI用户分层分析', role: 'ai', description: 'AI分析用户画像和分层策略' },
      { id: 's3', label: 'AI文案生成', role: 'ai', description: 'AI生成多版本活动文案和标题' },
      { id: 's4', label: '人工审核调整', role: 'human', description: '审核文案质量和品牌调性' },
      { id: 's5', label: 'A/B测试方案设计', role: 'human', description: '设计多版本对比测试方案' },
      { id: 's6', label: '数据复盘', role: 'human', description: '分析活动数据并输出复盘报告' },
    ],
  },
];

export function getWorkflowByRole(role: string): WorkflowTemplate | undefined {
  return workflowTemplates.find(w => w.role === role);
}
