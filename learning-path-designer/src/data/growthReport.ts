import { EmployeeProfile, SkillRadar } from "../types";

export interface GrowthRecord {
  month: number;
  skills: SkillRadar;
  highlights: string[];
  completedTasks: string[];
  feedback: string;
}

export interface GrowthReport {
  profile: EmployeeProfile;
  records: GrowthRecord[];
  finalSkills: SkillRadar;
  strengths: string[];
  improvements: string[];
  verdict: 'recommend_pass' | 'conditional_pass' | 'not_recommend';
  verdictNote: string;
  nextPlan: string[];
  aiToolUsage: { tool: string; frequency: string; level: '熟练' | '一般' | '待加强' }[];
}

/* ═══════════════════════════════════════
   新人1：张三 · 游戏策划 · 建议转正
   ═══════════════════════════════════════ */
const reportZhangSan: GrowthReport = {
  profile: {
    employeeId: 'E001',
    name: '张三',
    role: '游戏策划',
    aiExperience: '基础',
    mentor: '李四',
    department: '新项目组',
    startDate: '2026-06-01',
    avatar: '',
  },
  records: [
    {
      month: 1,
      skills: { aiToolSkill: 30, promptSkill: 25, workflowSkill: 20, riskAwareness: 40, collaboration: 35, deliveryQuality: 25 },
      highlights: ['完成公司 AI Native 认知学习', '掌握 ChatGPT 和 Claude 基本使用'],
      completedTasks: ['AI Native 组织认知', 'AI 工具链基础', '安全规范承诺书'],
      feedback: '学习态度积极，对 AI 工具从陌生到能完成基本操作，进步明显。',
    },
    {
      month: 2,
      skills: { aiToolSkill: 55, promptSkill: 48, workflowSkill: 40, riskAwareness: 55, collaboration: 60, deliveryQuality: 42 },
      highlights: ['独立完成第一个 AI 辅助策划案', '学会使用 AI 进行竞品分析'],
      completedTasks: ['Prompt 模板库建立', '岗位 AI 应用机会清单', '7日新手活动策划案'],
      feedback: '第二个月进步很大，已经能把 AI 嵌入策划工作流，Prompt 质量显著提升。',
    },
    {
      month: 3,
      skills: { aiToolSkill: 72, promptSkill: 65, workflowSkill: 58, riskAwareness: 68, collaboration: 75, deliveryQuality: 70 },
      highlights: ['完成导师分配的真实项目策划', '沉淀2个可复用的 AI 策划工作流模板'],
      completedTasks: ['真实业务课题策划', 'AI 协同执行项目', '最终交付物', '复盘报告'],
      feedback: '已具备独立使用 AI 完成策划任务的能力，交付质量达到预期。建议转正。',
    },
  ],
  finalSkills: { aiToolSkill: 72, promptSkill: 65, workflowSkill: 58, riskAwareness: 68, collaboration: 75, deliveryQuality: 70 },
  strengths: [
    '对 AI 工具的学习速度快，能够快速适应新技术',
    '策划结构化思维清晰，Prompt 设计质量高',
    '团队协作积极，乐于分享 AI 使用经验',
  ],
  improvements: [
    '数值平衡感仍需在实际项目中积累经验',
    'AI 输出校验的深度有待提升',
    '需要有意识地培养跨岗位的 AI 协作能力',
  ],
  verdict: 'recommend_pass',
  verdictNote: '该员工已具备基础 AI Native 工作能力，能够独立使用 AI 完成任务拆解、初稿生成和结果优化。建议转正，并进入"AI 高阶工作流训练"阶段。',
  nextPlan: [
    '参与至少2个正式项目的策划工作',
    '深入掌握 AI 数据分析工具（如 SQL Copilot）',
    '培养团队 AI 工作流布道能力',
    '建立个人 AI 策划方法论并分享',
  ],
  aiToolUsage: [
    { tool: 'ChatGPT', frequency: '每日使用', level: '熟练' },
    { tool: 'Claude', frequency: '每周3-4次', level: '熟练' },
    { tool: 'Midjourney', frequency: '每周1-2次', level: '一般' },
    { tool: 'Perplexity', frequency: '每周2-3次', level: '熟练' },
    { tool: 'Notion AI', frequency: '每日使用', level: '一般' },
  ],
};

/* ═══════════════════════════════════════
   新人2：王小明 · 程序开发 · 有条件通过
   ═══════════════════════════════════════ */
const reportWangXiaoming: GrowthReport = {
  profile: {
    employeeId: 'E002',
    name: '王小明',
    role: '程序开发',
    aiExperience: '熟练',
    mentor: '赵六',
    department: '技术中台',
    startDate: '2026-05-15',
    avatar: '',
  },
  records: [
    {
      month: 1,
      skills: { aiToolSkill: 55, promptSkill: 45, workflowSkill: 35, riskAwareness: 40, collaboration: 30, deliveryQuality: 50 },
      highlights: ['快速配置本地 AI 开发环境', '掌握 GitHub Copilot 基础用法'],
      completedTasks: ['开发环境 AI 化配置', 'Copilot 代码补全训练', 'Code Review 规范学习'],
      feedback: '技术底子扎实，AI 工具上手快，但团队协作主动性不足。',
    },
    {
      month: 2,
      skills: { aiToolSkill: 72, promptSkill: 62, workflowSkill: 50, riskAwareness: 48, collaboration: 35, deliveryQuality: 68 },
      highlights: ['独立使用 AI 完成接口开发', '编写了3个内部工具脚本'],
      completedTasks: ['AI 辅助接口开发', '自动化测试脚本编写', '技术文档 AI 生成'],
      feedback: '代码产出效率高，但 code review 参与率仅 20%，团队协作是明显短板。',
    },
    {
      month: 3,
      skills: { aiToolSkill: 78, promptSkill: 70, workflowSkill: 60, riskAwareness: 55, collaboration: 42, deliveryQuality: 75 },
      highlights: ['完成核心模块 AI 辅助重构', '沉淀1个团队级 Prompt 模板'],
      completedTasks: ['核心模块重构', 'AI 代码审查流程建立', '团队分享会'],
      feedback: '技术能力达标，但团队协作评分仍然偏低。建议给予条件转正，明确协作改进目标。',
    },
  ],
  finalSkills: { aiToolSkill: 78, promptSkill: 70, workflowSkill: 60, riskAwareness: 55, collaboration: 42, deliveryQuality: 75 },
  strengths: [
    '技术基础扎实，AI 辅助编码效率高',
    '独立解决问题能力强，善于使用 AI 排查 Bug',
    '代码质量意识好，能主动优化代码结构',
  ],
  improvements: [
    '团队协作意识薄弱，需强制参与 code review',
    '跨部门沟通能力有待提升',
    '技术分享和知识沉淀主动性不足',
  ],
  verdict: 'conditional_pass',
  verdictNote: '技术能力已达到岗位要求，但团队协作评分（42分）低于及格线。建议条件转正，设定1个月协作改进观察期，要求每周至少参与3次 code review。',
  nextPlan: [
    '每周至少参与 3 次团队 code review',
    '主导1次技术分享（AI 辅助开发主题）',
    '结对编程，与资深工程师配对完成1个任务',
    '建立个人技术博客，每月至少1篇分享',
  ],
  aiToolUsage: [
    { tool: 'GitHub Copilot', frequency: '每日使用', level: '熟练' },
    { tool: 'ChatGPT', frequency: '每日使用', level: '熟练' },
    { tool: 'Cursor', frequency: '每周3-4次', level: '熟练' },
    { tool: 'Claude', frequency: '每周1-2次', level: '一般' },
    { tool: 'Warp Terminal', frequency: '每日使用', level: '一般' },
  ],
};

/* ═══════════════════════════════════════
   新人3：李小花 · 美术设计 · 建议转正
   ═══════════════════════════════════════ */
const reportLiXiaohua: GrowthReport = {
  profile: {
    employeeId: 'E003',
    name: '李小花',
    role: '美术设计',
    aiExperience: '基础',
    mentor: '孙七',
    department: '美术中心',
    startDate: '2026-04-20',
    avatar: '',
  },
  records: [
    {
      month: 1,
      skills: { aiToolSkill: 50, promptSkill: 40, workflowSkill: 35, riskAwareness: 55, collaboration: 60, deliveryQuality: 45 },
      highlights: ['掌握 Midjourney 和 Stable Diffusion 基础', '建立个人 AI 美术资源库'],
      completedTasks: ['AI 美术工具链认知', '风格一致性训练', 'Prompt 美学库建立'],
      feedback: '美术功底深厚，对 AI 生成图像的审美把控很好，学习非常主动。',
    },
    {
      month: 2,
      skills: { aiToolSkill: 68, promptSkill: 58, workflowSkill: 50, riskAwareness: 68, collaboration: 78, deliveryQuality: 62 },
      highlights: ['独立完成 AI 辅助角色设计', '风格迁移技术掌握'],
      completedTasks: ['AI 辅助角色设计', '场景概念图生成', '团队美术规范制定'],
      feedback: '第二个月就能独立完成高质量 AI 辅助设计，团队协作也非常出色。',
    },
    {
      month: 3,
      skills: { aiToolSkill: 82, promptSkill: 72, workflowSkill: 65, riskAwareness: 78, collaboration: 88, deliveryQuality: 78 },
      highlights: ['主导1个完整美术资源包', '建立团队 AI 美术工作流 SOP'],
      completedTasks: ['完整美术资源包交付', 'AI 美术工作流 SOP', '新人带教分享'],
      feedback: '表现远超预期，不仅个人能力突出，还能带动团队。强烈建议转正并给予晋升机会。',
    },
  ],
  finalSkills: { aiToolSkill: 82, promptSkill: 72, workflowSkill: 65, riskAwareness: 78, collaboration: 88, deliveryQuality: 78 },
  strengths: [
    '美术审美能力突出，AI 生成结果质量高',
    '学习速度极快，三个月达到熟练水平',
    '团队协作优秀，乐于帮助其他成员',
    '有方法论沉淀意识，主动建立 SOP',
  ],
  improvements: [
    'AI 工具的深度定制能力仍有提升空间',
    '可以尝试更多跨风格融合实验',
  ],
  verdict: 'recommend_pass',
  verdictNote: '表现优异，三个月内从 AI 零基础成长为团队标杆。不仅个人能力强，还能沉淀方法论、带动团队。建议转正并考虑提前进入高级美术设计师培养通道。',
  nextPlan: [
    '负责1个完整项目的美术风格定义',
    '深入研究 ControlNet + LoRA 组合工作流',
    '建立团队 AI 美术素材共享平台',
    '开始带教下一批新人',
  ],
  aiToolUsage: [
    { tool: 'Midjourney', frequency: '每日使用', level: '熟练' },
    { tool: 'Stable Diffusion', frequency: '每日使用', level: '熟练' },
    { tool: 'ComfyUI', frequency: '每周3-4次', level: '熟练' },
    { tool: 'Photoshop AI', frequency: '每日使用', level: '熟练' },
    { tool: 'Runway', frequency: '每周1-2次', level: '一般' },
  ],
};

/* ═══════════════════════════════════════
   新人4：陈小刚 · QA测试 · 不建议转正
   ═══════════════════════════════════════ */
const reportChenXiaogang: GrowthReport = {
  profile: {
    employeeId: 'E004',
    name: '陈小刚',
    role: 'QA测试',
    aiExperience: '基础',
    mentor: '周八',
    department: 'QA中心',
    startDate: '2026-06-05',
    avatar: '',
  },
  records: [
    {
      month: 1,
      skills: { aiToolSkill: 20, promptSkill: 15, workflowSkill: 15, riskAwareness: 30, collaboration: 35, deliveryQuality: 25 },
      highlights: ['完成 AI 测试工具基础培训'],
      completedTasks: ['AI 测试工具认知', '基础测试用例编写'],
      feedback: '对 AI 工具使用感到吃力，学习进度明显慢于同期新人。',
    },
    {
      month: 2,
      skills: { aiToolSkill: 25, promptSkill: 22, workflowSkill: 20, riskAwareness: 38, collaboration: 42, deliveryQuality: 30 },
      highlights: ['在导师帮助下完成 AI 辅助测试用例生成'],
      completedTasks: ['AI 辅助用例生成', '自动化测试脚本学习'],
      feedback: '第二个月有所进步，但 AI 工具熟练度仍然严重不足，独立完成任务有困难。',
    },
    {
      month: 3,
      skills: { aiToolSkill: 32, promptSkill: 28, workflowSkill: 25, riskAwareness: 45, collaboration: 50, deliveryQuality: 35 },
      highlights: ['能独立完成简单测试任务'],
      completedTasks: ['独立测试任务执行', 'Bug 报告编写'],
      feedback: '三个月过去，AI 能力仍远低于岗位要求。虽然态度端正，但学习效率和适应能力不足。',
    },
  ],
  finalSkills: { aiToolSkill: 32, promptSkill: 28, workflowSkill: 25, riskAwareness: 45, collaboration: 50, deliveryQuality: 35 },
  strengths: [
    '工作态度端正，愿意学习',
    '基础测试理论知识扎实',
    '团队协作态度好，配合度高',
  ],
  improvements: [
    'AI 工具学习能力严重不足，三个月仍无法独立使用',
    '技术敏感度低，对新工具接受慢',
    '自主学习能力弱，过度依赖导师手把手指导',
    '交付质量不稳定，需要反复修改',
  ],
  verdict: 'not_recommend',
  verdictNote: '经过三个月培养，该员工的 AI Native 能力仍未达到岗位最低要求。虽然态度端正，但学习效率和适应能力与团队期望存在较大差距。建议不予转正，可考虑调整至对 AI 能力要求较低的岗位或协商离职。',
  nextPlan: [
    '安排额外1个月延长试用期（如公司政策允许）',
    '每日1小时强制 AI 工具练习',
    '安排与表现优异的新人结对学习',
    '如仍无显著改善，启动岗位调整或离职流程',
  ],
  aiToolUsage: [
    { tool: 'ChatGPT', frequency: '每周1-2次', level: '待加强' },
    { tool: 'Selenium IDE', frequency: '每周3-4次', level: '一般' },
    { tool: 'Postman', frequency: '每周2-3次', level: '一般' },
    { tool: 'TestRail', frequency: '每日使用', level: '一般' },
    { tool: 'Applitools', frequency: '从未使用', level: '待加强' },
  ],
};

/* ═══════════════════════════════════════
   新人5：赵晓雨 · 运营发行 · 建议转正（优秀）
   ═══════════════════════════════════════ */
const reportZhaoXiaoyu: GrowthReport = {
  profile: {
    employeeId: 'E005',
    name: '赵晓雨',
    role: '运营发行',
    aiExperience: '专家',
    mentor: '吴九',
    department: '发行中心',
    startDate: '2026-05-01',
    avatar: '',
  },
  records: [
    {
      month: 1,
      skills: { aiToolSkill: 70, promptSkill: 65, workflowSkill: 55, riskAwareness: 60, collaboration: 65, deliveryQuality: 62 },
      highlights: ['快速搭建运营 AI 工作流', '完成首批 AI 生成素材上线'],
      completedTasks: ['运营 AI 工具链搭建', 'AI 素材生成规范', '数据报表自动化'],
      feedback: '入职即有专家级 AI 能力，上手速度极快，能快速产出高质量内容。',
    },
    {
      month: 2,
      skills: { aiToolSkill: 82, promptSkill: 78, workflowSkill: 70, riskAwareness: 68, collaboration: 72, deliveryQuality: 78 },
      highlights: ['独立负责1个渠道的内容投放', 'AI 数据分析模型建立'],
      completedTasks: ['渠道内容投放', '用户画像 AI 分析', 'A/B 测试方案设计'],
      feedback: '第二个月就能独立负责渠道，AI 数据分析能力尤其突出，远超同期水平。',
    },
    {
      month: 3,
      skills: { aiToolSkill: 92, promptSkill: 88, workflowSkill: 82, riskAwareness: 75, collaboration: 80, deliveryQuality: 88 },
      highlights: ['主导季度运营方案制定', '建立团队 AI 运营知识库'],
      completedTasks: ['季度运营方案', 'AI 运营知识库', '团队培训（2场）', '跨部门协作项目'],
      feedback: '三个月达到资深运营水平，AI 能力在整个团队中名列前茅。强烈建议转正并重点培养。',
    },
  ],
  finalSkills: { aiToolSkill: 92, promptSkill: 88, workflowSkill: 82, riskAwareness: 75, collaboration: 80, deliveryQuality: 88 },
  strengths: [
    'AI 工具使用已达专家水平，能创造性地解决复杂问题',
    '数据敏感度极高，善于用 AI 挖掘数据洞察',
    '跨部门协作能力强，能推动项目落地',
    '知识沉淀意识强，主动建立团队知识库',
  ],
  improvements: [
    '可以进一步深耕垂直领域的 AI 应用',
    '在团队管理方面可以开始积累经验',
  ],
  verdict: 'recommend_pass',
  verdictNote: '该员工表现卓越，AI 能力在团队中处于顶尖水平。不仅个人产出质量高，还能带动团队、沉淀知识。建议转正后立即进入"高潜人才培养计划"，考虑提前晋升。',
  nextPlan: [
    '独立负责1个完整发行项目',
    '建立部门级 AI 运营中台',
    '开始带教新人，培养领导力',
    '参与公司 AI Native 战略制定',
  ],
  aiToolUsage: [
    { tool: 'ChatGPT', frequency: '每日使用', level: '熟练' },
    { tool: 'Claude', frequency: '每日使用', level: '熟练' },
    { tool: 'Midjourney', frequency: '每日使用', level: '熟练' },
    { tool: 'Runway', frequency: '每周3-4次', level: '熟练' },
    { tool: 'Notion AI', frequency: '每日使用', level: '熟练' },
    { tool: 'Tableau + GPT', frequency: '每周2-3次', level: '熟练' },
  ],
};

/* ═══════════════════════════════════════
   导出
   ═══════════════════════════════════════ */
export const mockGrowthReports: Record<string, GrowthReport> = {
  E001: reportZhangSan,
  E002: reportWangXiaoming,
  E003: reportLiXiaohua,
  E004: reportChenXiaogang,
  E005: reportZhaoXiaoyu,
};

/** 获取指定新人的成长报告 */
export function getGrowthReport(employeeId: string): GrowthReport | undefined {
  return mockGrowthReports[employeeId];
}

/** 获取所有新人的报告列表（HR用） */
export function getAllGrowthReports(): GrowthReport[] {
  return Object.values(mockGrowthReports);
}

/** 根据员工档案生成报告（员工视角用，默认返回张三的数据但替换名字） */
export function getPersonalizedReport(name: string): GrowthReport {
  const report = { ...reportZhangSan };
  report.profile = { ...report.profile, name };
  return report;
}
