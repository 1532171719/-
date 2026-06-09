/**
 * 本地智能学习路径生成器
 *
 * 当 CloudBase 云函数不可用时，根据员工画像在客户端生成个性化学习路径。
 * 支持 5 种岗位 × 3 种经验等级 的组合，输出与 AI API 完全一致的数据结构。
 */

import { WeekTask, PhaseName, EmployeeProfile, JobRole } from "../types";
import { LearningPathGenerationResult } from "./learningPathGenerator";

const PHASE_COLORS = ["#00C9FF", "#7B61FF", "#FF6B35"];

interface RoleTemplate {
  weeks: Array<{
    title: string;
    type: WeekTask["type"];
    deliverables: string[];
  }>;
}

// ========== 岗位 × 经验 模板库 ==========

const roleTemplates: Record<JobRole, Record<string, RoleTemplate>> = {
  游戏策划: {
    基础: {
      weeks: [
        { title: "AI Native组织认知与策划岗位定位", type: "learning", deliverables: ["策划岗位AI认知地图", "组织架构理解笔记"] },
        { title: "AI工具链入门：GPT-4与Copilot", type: "learning", deliverables: ["AI工具使用清单", "安全规范承诺书"] },
        { title: "Prompt工程：从模糊需求到精确指令", type: "practice", deliverables: ["个人Prompt模板库（10条）", "任务拆解练习记录"] },
        { title: "游戏策划AI应用案例研习", type: "learning", deliverables: ["竞品AI应用分析报告", "岗位AI机会清单"] },
        { title: "AI辅助玩法拆解与数值模拟", type: "practice", deliverables: ["玩法拆解思维导图", "数值模拟初稿"] },
        { title: "用AI生成剧情与世界观草案", type: "practice", deliverables: ["剧情生成Prompt记录", "世界观设定初稿"] },
        { title: "导师评审：剧情质量与一致性检查", type: "practice", deliverables: ["导师评审记录", "修改版世界观文档"] },
        { title: "沉淀可复用的策划AI工作流", type: "collaboration", deliverables: ["策划AI工作流模板", "团队协作记录"] },
        { title: "选择真实业务课题：新手活动设计", type: "collaboration", deliverables: ["项目任务书", "课题可行性分析"] },
        { title: "AI协同执行：7日登录活动方案", type: "practice", deliverables: ["活动方案中期版", "AI协同开发日志"] },
        { title: "复盘优化：活动数值与体验调优", type: "practice", deliverables: ["最终活动方案", "AI Review优化记录"] },
        { title: "成果展示与转正答辩准备", type: "collaboration", deliverables: ["个人AI Native成长报告", "转正评估PPT"] },
      ],
    },
    熟练: {
      weeks: [
        { title: "AI Native工作流深度理解与优化", type: "learning", deliverables: ["现有工作流诊断报告", "优化建议清单"] },
        { title: "进阶AI工具：Claude、Midjourney与专用Agent", type: "learning", deliverables: ["进阶工具掌握清单", "工具对比评估表"] },
        { title: "复杂Prompt设计：多轮迭代与链式思考", type: "practice", deliverables: ["复杂Prompt案例库（15条）", "迭代优化记录"] },
        { title: "跨岗位AI协作：策划×程序×美术", type: "collaboration", deliverables: ["跨岗位协作案例总结", "AI协作规范建议"] },
        { title: "AI驱动的竞品深度分析", type: "practice", deliverables: ["竞品AI应用深度报告", "可借鉴方案清单"] },
        { title: "AI辅助关卡设计与数值平衡", type: "practice", deliverables: ["关卡设计初稿", "数值平衡模拟报告"] },
        { title: "质量把控：AI输出的策划案审查", type: "practice", deliverables: ["AI输出审查清单", "修改版策划案"] },
        { title: "建立团队策划Prompt知识库", type: "collaboration", deliverables: ["团队Prompt知识库", "最佳实践分享文档"] },
        { title: "业务实战：Roguelike玩法系统设计", type: "collaboration", deliverables: ["系统设计任务书", "核心机制草案"] },
        { title: "AI协同：怪物AI与道具系统策划", type: "practice", deliverables: ["怪物行为树设计", "道具系统中期版"] },
        { title: "系统复盘：可玩性与留存优化", type: "practice", deliverables: ["玩法系统终稿", "留存优化建议"] },
        { title: "转正答辩与三个月成长汇报", type: "collaboration", deliverables: ["成长汇报PPT", "导师推荐信"] },
      ],
    },
    专家: {
      weeks: [
        { title: "AI Native组织战略与策划前沿趋势", type: "learning", deliverables: ["行业趋势研究报告", "组织AI战略建议"] },
        { title: "高阶AI工具链定制与Agent搭建", type: "learning", deliverables: ["定制工具链配置", "专属Agent使用说明"] },
        { title: "Prompt即产品：可复用的Prompt工程体系", type: "practice", deliverables: ["Prompt工程体系文档", "自动化Prompt测试脚本"] },
        { title: "AI辅助创新玩法探索与验证", type: "practice", deliverables: ["创新玩法概念集", "AI验证实验报告"] },
        { title: "主导岗位AI工作流标准制定", type: "collaboration", deliverables: ["策划AI工作流标准V1.0", "团队培训材料"] },
        { title: "复杂系统AI辅助设计：经济系统与社交系统", type: "practice", deliverables: ["经济系统模拟报告", "社交系统设计草案"] },
        { title: "AI输出质量评估体系搭建", type: "practice", deliverables: ["质量评估SOP", "自动化审查清单"] },
        { title: "导师辅导：带教新人使用策划AI工具", type: "collaboration", deliverables: ["新人辅导记录", "教学案例集"] },
        { title: "真实项目：主导核心玩法系统迭代", type: "collaboration", deliverables: ["项目主导计划书", "迭代方案草案"] },
        { title: "AI协同项目管理与进度把控", type: "practice", deliverables: ["项目中期评审报告", "风险应对预案"] },
        { title: "项目复盘与知识沉淀", type: "practice", deliverables: ["项目复盘报告", "可复用模板库"] },
        { title: "转正评估与下一阶段发展规划", type: "collaboration", deliverables: ["三个月成果汇编", "下一阶段发展计划"] },
      ],
    },
  },

  程序开发: {
    基础: {
      weeks: [
        { title: "AI Native开发文化与编码规范", type: "learning", deliverables: ["开发规范认知测试", "团队编码规范笔记"] },
        { title: "AI编程助手：Copilot、CodeWhisperer入门", type: "learning", deliverables: ["AI编程工具配置清单", "安全编码承诺书"] },
        { title: "Prompt驱动开发：用AI生成代码与注释", type: "practice", deliverables: ["Prompt生成代码案例集", "代码审查练习记录"] },
        { title: "游戏开发AI应用案例与技术选型", type: "learning", deliverables: ["技术选型分析报告", "AI辅助开发案例库"] },
        { title: "AI辅助模块拆解与接口设计", type: "practice", deliverables: ["模块拆解图", "接口设计初稿（AI生成+人工修改）"] },
        { title: "AI协同编码：战斗系统模块实现", type: "practice", deliverables: ["战斗系统代码", "AI辅助开发日志"] },
        { title: "代码审查：AI Review + 导师人工复核", type: "practice", deliverables: ["AI代码审查报告", "修改后代码提交记录"] },
        { title: "沉淀可复用代码模板与开发工作流", type: "collaboration", deliverables: ["代码模板库", "开发工作流SOP"] },
        { title: "业务课题：任务系统接口设计与实现", type: "collaboration", deliverables: ["项目任务书", "技术方案文档"] },
        { title: "AI协同执行：任务系统编码与单元测试", type: "practice", deliverables: ["任务系统代码中期版", "单元测试用例"] },
        { title: "复盘优化：性能分析与Bug修复", type: "practice", deliverables: ["性能优化报告", "最终代码提交"] },
        { title: "技术分享与转正答辩", type: "collaboration", deliverables: ["技术分享PPT", "个人成长报告"] },
      ],
    },
    熟练: {
      weeks: [
        { title: "高阶AI开发工作流与最佳实践", type: "learning", deliverables: ["现有开发流程诊断", "AI开发最佳实践清单"] },
        { title: "进阶工具：Cursor、Aider与本地LLM", type: "learning", deliverables: ["进阶工具配置指南", "工具效率对比报告"] },
        { title: "复杂系统AI辅助架构设计", type: "practice", deliverables: ["架构设计Prompt案例", "AI辅助架构评审记录"] },
        { title: "AI辅助技术文档生成与维护", type: "practice", deliverables: ["AI生成技术文档", "文档维护工作流"] },
        { title: "AI驱动的代码重构与性能优化", type: "practice", deliverables: ["重构前后代码对比", "性能优化方案"] },
        { title: "AI辅助测试用例生成与自动化测试", type: "practice", deliverables: ["AI生成测试用例集", "自动化测试覆盖率报告"] },
        { title: "代码质量：AI静态分析与安全审查", type: "practice", deliverables: ["静态分析报告", "安全漏洞修复记录"] },
        { title: "建立团队代码Prompt与知识库", type: "collaboration", deliverables: ["代码Prompt知识库", "团队分享会记录"] },
        { title: "业务实战：多人协作的战斗系统重构", type: "collaboration", deliverables: ["重构计划书", "技术债务分析报告"] },
        { title: "AI协同：数据库优化与缓存策略", type: "practice", deliverables: ["数据库优化方案", "缓存策略实现"] },
        { title: "系统复盘：可观测性与监控搭建", type: "practice", deliverables: ["监控仪表盘配置", "告警规则文档"] },
        { title: "转正评估与技术能力汇报", type: "collaboration", deliverables: ["技术能力报告", "导师评价表"] },
      ],
    },
    专家: {
      weeks: [
        { title: "AI Native架构演进与工程文化", type: "learning", deliverables: ["架构演进研究报告", "工程文化改进建议"] },
        { title: "定制开发Agent与自动化工作流", type: "learning", deliverables: ["定制Agent配置", "自动化工作流脚本"] },
        { title: "Prompt工程化：可维护的代码生成体系", type: "practice", deliverables: ["代码生成体系设计", "Prompt版本管理规范"] },
        { title: "AI辅助新技术调研与原型验证", type: "practice", deliverables: ["技术调研报告", "原型验证Demo"] },
        { title: "主导程序AI工作流标准制定", type: "collaboration", deliverables: ["程序AI工作流标准", "团队技术培训材料"] },
        { title: "复杂系统AI辅助实现：AI行为树与ECS", type: "practice", deliverables: ["AI行为树实现", "ECS框架集成方案"] },
        { title: "代码质量体系建设：AI审查+人工把关", type: "practice", deliverables: ["质量评估体系", "审查SOP文档"] },
        { title: "导师辅导：带教新人AI编程实践", type: "collaboration", deliverables: ["新人辅导记录", "编程练习案例集"] },
        { title: "真实项目：主导核心系统架构升级", type: "collaboration", deliverables: ["架构升级方案", "迁移计划书"] },
        { title: "AI协同项目管理与代码评审", type: "practice", deliverables: ["项目中期技术评审", "代码评审记录"] },
        { title: "项目复盘与技术债务清偿", type: "practice", deliverables: ["项目复盘报告", "技术债务清偿计划"] },
        { title: "转正答辩与职业发展规划", type: "collaboration", deliverables: ["技术成果汇编", "下一阶段技术规划"] },
      ],
    },
  },

  美术设计: {
    基础: {
      weeks: [
        { title: "AI Native美术创作文化与版权规范", type: "learning", deliverables: ["版权规范认知测试", "AI美术创作伦理笔记"] },
        { title: "AI图像工具入门：Midjourney与Stable Diffusion", type: "learning", deliverables: ["工具使用清单", "版权风险承诺书"] },
        { title: "Prompt工程：视觉描述与风格控制", type: "practice", deliverables: ["风格控制Prompt库", "图像生成练习集"] },
        { title: "游戏美术AI应用案例与风格研究", type: "learning", deliverables: ["风格参考图集", "AI美术应用案例报告"] },
        { title: "AI辅助角色概念设计", type: "practice", deliverables: ["角色概念草图", "Prompt迭代记录"] },
        { title: "AI辅助场景与道具设计", type: "practice", deliverables: ["场景概念图", "道具设计稿"] },
        { title: "质量把控：风格一致性与版权审查", type: "practice", deliverables: ["风格一致性检查表", "版权风险排查报告"] },
        { title: "沉淀美术AI工作流与模板", type: "collaboration", deliverables: ["美术AI工作流模板", "团队分享记录"] },
        { title: "业务课题：NPC角色完整视觉设计", type: "collaboration", deliverables: ["项目任务书", "角色设定文档"] },
        { title: "AI协同执行：角色立绘与三视图", type: "practice", deliverables: ["角色立绘中期版", "三视图草稿"] },
        { title: "复盘优化：风格统一与细节打磨", type: "practice", deliverables: ["最终角色设计稿", "优化对比记录"] },
        { title: "作品集整理与转正展示", type: "collaboration", deliverables: ["三个月作品集", "个人成长报告"] },
      ],
    },
    熟练: {
      weeks: [
        { title: "高阶AI美术工作流与风格迁移", type: "learning", deliverables: ["现有工作流优化方案", "风格迁移技术掌握清单"] },
        { title: "进阶工具：ComfyUI、LoRA与ControlNet", type: "learning", deliverables: ["进阶工具配置", "LoRA训练记录"] },
        { title: "复杂场景AI辅助设计：光影与构图", type: "practice", deliverables: ["复杂场景设计稿", "光影控制技巧总结"] },
        { title: "AI辅助UI/UX设计与动效探索", type: "practice", deliverables: ["UI设计稿", "动效概念探索"] },
        { title: "AI驱动的批量资产生成与管线搭建", type: "practice", deliverables: ["批量生成工作流", "资产管线方案"] },
        { title: "材质贴图与3D辅助AI生成", type: "practice", deliverables: ["材质贴图集", "3D辅助生成记录"] },
        { title: "质量评估：AI美术输出的专业审查", type: "practice", deliverables: ["质量评估SOP", "审查记录表"] },
        { title: "建立团队美术Prompt与资源库", type: "collaboration", deliverables: ["美术Prompt知识库", "资源共享平台"] },
        { title: "业务实战：游戏主城场景完整设计", type: "collaboration", deliverables: ["场景设计任务书", "概念氛围图"] },
        { title: "AI协同：场景拆分与资产清单", type: "practice", deliverables: ["场景拆分图", "资产清单中期版"] },
        { title: "复盘优化：风格统一与性能适配", type: "practice", deliverables: ["最终场景设计稿", "性能适配方案"] },
        { title: "转正评估与美术能力汇报", type: "collaboration", deliverables: ["美术作品集", "导师推荐信"] },
      ],
    },
    专家: {
      weeks: [
        { title: "AI Native美术趋势与创新探索", type: "learning", deliverables: ["行业趋势研究报告", "创新方向提案"] },
        { title: "定制AI美术管线与自动化工具", type: "learning", deliverables: ["定制管线搭建", "自动化工具使用说明"] },
        { title: "Prompt即风格：可复用的视觉生成体系", type: "practice", deliverables: ["视觉生成体系文档", "风格一致性测试报告"] },
        { title: "AI辅助新风格探索与原型验证", type: "practice", deliverables: ["新风格概念集", "原型验证记录"] },
        { title: "主导美术AI工作流标准制定", type: "collaboration", deliverables: ["美术AI工作流标准", "团队培训计划"] },
        { title: "复杂项目AI美术统筹与质量把控", type: "practice", deliverables: ["美术统筹方案", "质量标准文档"] },
        { title: "版权合规与AI生成内容风险管理", type: "practice", deliverables: ["风险管理SOP", "合规检查清单"] },
        { title: "导师辅导：带教新人AI美术实践", type: "collaboration", deliverables: ["辅导记录", "教学案例集"] },
        { title: "真实项目：主导游戏美术风格定调", type: "collaboration", deliverables: ["风格定调方案", "主视觉设计稿"] },
        { title: "AI协同：美术资产生产与进度管理", type: "practice", deliverables: ["资产生产计划", "中期进度报告"] },
        { title: "项目复盘与美术知识沉淀", type: "practice", deliverables: ["项目复盘报告", "可复用模板库"] },
        { title: "转正答辩与职业发展规划", type: "collaboration", deliverables: ["美术成果汇编", "下一阶段发展规划"] },
      ],
    },
  },

  QA测试: {
    基础: {
      weeks: [
        { title: "AI Native测试文化与质量意识", type: "learning", deliverables: ["质量意识测试", "测试规范认知笔记"] },
        { title: "AI测试工具入门：测试用例生成与Bug分析", type: "learning", deliverables: ["测试工具清单", "数据安全承诺书"] },
        { title: "Prompt工程：测试需求描述与用例生成", type: "practice", deliverables: ["测试Prompt模板库", "用例生成练习记录"] },
        { title: "游戏测试AI应用案例与方法论", type: "learning", deliverables: ["测试方法对比报告", "AI测试案例库"] },
        { title: "AI辅助测试用例设计与矩阵生成", type: "practice", deliverables: ["测试用例矩阵", "AI生成用例评审记录"] },
        { title: "AI辅助Bug报告与聚类分析", type: "practice", deliverables: ["Bug聚类分析报告", "AI辅助Bug描述优化"] },
        { title: "质量把控：AI测试输出的准确性验证", type: "practice", deliverables: ["准确性验证清单", "修正后测试文档"] },
        { title: "沉淀可复用测试模板与工作流", type: "collaboration", deliverables: ["测试模板库", "测试工作流SOP"] },
        { title: "业务课题：新玩法系统测试方案设计", type: "collaboration", deliverables: ["测试任务书", "测试策略文档"] },
        { title: "AI协同执行：测试用例执行与缺陷跟踪", type: "practice", deliverables: ["测试执行中期报告", "缺陷跟踪记录"] },
        { title: "复盘优化：覆盖率提升与回归测试", type: "practice", deliverables: ["覆盖率提升方案", "回归测试报告"] },
        { title: "测试经验分享与转正答辩", type: "collaboration", deliverables: ["测试经验分享PPT", "个人成长报告"] },
      ],
    },
    熟练: {
      weeks: [
        { title: "高阶AI测试工作流与自动化策略", type: "learning", deliverables: ["测试流程诊断", "自动化策略清单"] },
        { title: "进阶工具：AI辅助性能测试与安全测试", type: "learning", deliverables: ["进阶工具掌握清单", "性能测试环境配置"] },
        { title: "复杂系统AI辅助测试方案设计", type: "practice", deliverables: ["复杂系统测试方案", "边界条件分析记录"] },
        { title: "AI辅助自动化脚本生成与维护", type: "practice", deliverables: ["自动化脚本集", "脚本维护工作流"] },
        { title: "AI驱动的探索性测试与风险预测", type: "practice", deliverables: ["探索性测试报告", "风险预测模型"] },
        { title: "AI辅助兼容性测试与用户体验评估", type: "practice", deliverables: ["兼容性测试报告", "用户体验评估"] },
        { title: "测试质量：AI输出与人工验证的平衡", type: "practice", deliverables: ["质量评估SOP", "人机协作测试记录"] },
        { title: "建立团队测试Prompt与知识库", type: "collaboration", deliverables: ["测试Prompt知识库", "团队分享会记录"] },
        { title: "业务实战：版本发布前全量回归测试", type: "collaboration", deliverables: ["回归测试计划", "风险评估报告"] },
        { title: "AI协同：缺陷根因分析与预防策略", type: "practice", deliverables: ["根因分析报告", "预防策略文档"] },
        { title: "复盘优化：测试效率度量与改进", type: "practice", deliverables: ["效率度量报告", "改进实施方案"] },
        { title: "转正评估与测试能力汇报", type: "collaboration", deliverables: ["测试能力报告", "导师评价表"] },
      ],
    },
    专家: {
      weeks: [
        { title: "AI Native测试体系与质量工程", type: "learning", deliverables: ["测试体系研究报告", "质量工程改进建议"] },
        { title: "定制测试Agent与智能缺陷预测", type: "learning", deliverables: ["定制Agent配置", "缺陷预测模型"] },
        { title: "Prompt工程化：可复用的测试生成体系", type: "practice", deliverables: ["测试生成体系设计", "Prompt版本管理规范"] },
        { title: "AI辅助测试新技术调研与验证", type: "practice", deliverables: ["技术调研报告", "验证实验记录"] },
        { title: "主导测试AI工作流标准制定", type: "collaboration", deliverables: ["测试AI工作流标准", "团队培训材料"] },
        { title: "复杂项目AI测试统筹与质量门禁", type: "practice", deliverables: ["测试统筹方案", "质量门禁配置"] },
        { title: "测试质量体系：AI审查+人工把关", type: "practice", deliverables: ["质量体系文档", "审查SOP"] },
        { title: "导师辅导：带教新人AI测试实践", type: "collaboration", deliverables: ["辅导记录", "测试练习案例集"] },
        { title: "真实项目：主导发布质量保障体系搭建", type: "collaboration", deliverables: ["质量保障方案", "发布检查清单"] },
        { title: "AI协同：测试数据管理与环境搭建", type: "practice", deliverables: ["数据管理方案", "环境配置文档"] },
        { title: "项目复盘与测试知识沉淀", type: "practice", deliverables: ["项目复盘报告", "可复用模板库"] },
        { title: "转正答辩与职业发展规划", type: "collaboration", deliverables: ["测试成果汇编", "下一阶段发展规划"] },
      ],
    },
  },

  运营发行: {
    基础: {
      weeks: [
        { title: "AI Native运营文化与数据思维", type: "learning", deliverables: ["数据思维测试", "运营规范认知笔记"] },
        { title: "AI运营工具入门：数据分析与文案生成", type: "learning", deliverables: ["运营工具清单", "数据安全承诺书"] },
        { title: "Prompt工程：运营需求描述与方案生成", type: "practice", deliverables: ["运营Prompt模板库", "方案生成练习记录"] },
        { title: "游戏运营AI应用案例与策略研究", type: "learning", deliverables: ["运营策略对比报告", "AI运营案例库"] },
        { title: "AI辅助用户分层与画像分析", type: "practice", deliverables: ["用户分层报告", "画像分析PPT"] },
        { title: "AI辅助活动方案设计与文案生成", type: "practice", deliverables: ["活动方案初稿", "AI生成文案集"] },
        { title: "质量把控：活动方案的数据验证与风险评估", type: "practice", deliverables: ["数据验证报告", "风险评估清单"] },
        { title: "沉淀可复用运营模板与工作流", type: "collaboration", deliverables: ["运营模板库", "工作流SOP"] },
        { title: "业务课题：节日活动运营全案设计", type: "collaboration", deliverables: ["项目任务书", "活动策略文档"] },
        { title: "AI协同执行：活动上线与数据监控", type: "practice", deliverables: ["活动中期数据报告", "监控日报"] },
        { title: "复盘优化：活动ROI分析与迭代", type: "practice", deliverables: ["ROI分析报告", "迭代优化方案"] },
        { title: "运营经验分享与转正答辩", type: "collaboration", deliverables: ["运营经验分享PPT", "个人成长报告"] },
      ],
    },
    熟练: {
      weeks: [
        { title: "高阶AI运营工作流与自动化策略", type: "learning", deliverables: ["运营流程诊断", "自动化策略清单"] },
        { title: "进阶工具：AI用户预测与智能投放", type: "learning", deliverables: ["进阶工具掌握清单", "投放策略配置"] },
        { title: "复杂活动AI辅助策划与资源统筹", type: "practice", deliverables: ["复杂活动策划案", "资源统筹表"] },
        { title: "AI辅助社区管理与舆情监控", type: "practice", deliverables: ["社区管理方案", "舆情监控报告"] },
        { title: "AI驱动的数据洞察与增长策略", type: "practice", deliverables: ["数据洞察报告", "增长策略方案"] },
        { title: "AI辅助A/B测试设计与效果评估", type: "practice", deliverables: ["A/B测试方案", "效果评估报告"] },
        { title: "运营质量：AI输出的业务准确性验证", type: "practice", deliverables: ["准确性验证SOP", "验证记录表"] },
        { title: "建立团队运营Prompt与知识库", type: "collaboration", deliverables: ["运营Prompt知识库", "团队分享会记录"] },
        { title: "业务实战：版本上线全周期运营支撑", type: "collaboration", deliverables: ["运营支撑计划", "风险应对预案"] },
        { title: "AI协同：用户反馈分析与产品优化建议", type: "practice", deliverables: ["反馈分析报告", "产品优化建议"] },
        { title: "复盘优化：运营效率度量与流程改进", type: "practice", deliverables: ["效率度量报告", "流程改进方案"] },
        { title: "转正评估与运营能力汇报", type: "collaboration", deliverables: ["运营能力报告", "导师评价表"] },
      ],
    },
    专家: {
      weeks: [
        { title: "AI Native运营战略与行业洞察", type: "learning", deliverables: ["行业洞察报告", "运营战略建议"] },
        { title: "定制运营Agent与智能决策系统", type: "learning", deliverables: ["定制Agent配置", "智能决策模型"] },
        { title: "Prompt工程化：可复用的运营生成体系", type: "practice", deliverables: ["运营生成体系设计", "Prompt版本管理规范"] },
        { title: "AI辅助新市场拓展与竞品监控", type: "practice", deliverables: ["市场拓展方案", "竞品监控报告"] },
        { title: "主导运营AI工作流标准制定", type: "collaboration", deliverables: ["运营AI工作流标准", "团队培训计划"] },
        { title: "复杂项目AI运营统筹与资源协调", type: "practice", deliverables: ["运营统筹方案", "资源协调计划"] },
        { title: "运营质量体系：AI辅助+人工决策", type: "practice", deliverables: ["质量体系文档", "决策SOP"] },
        { title: "导师辅导：带教新人AI运营实践", type: "collaboration", deliverables: ["辅导记录", "运营练习案例集"] },
        { title: "真实项目：主导大型活动运营全案", type: "collaboration", deliverables: ["活动全案方案", "执行计划书"] },
        { title: "AI协同：跨部门协作与资源整合", type: "practice", deliverables: ["协作方案", "资源整合报告"] },
        { title: "项目复盘与运营知识沉淀", type: "practice", deliverables: ["项目复盘报告", "可复用模板库"] },
        { title: "转正答辩与职业发展规划", type: "collaboration", deliverables: ["运营成果汇编", "下一阶段发展规划"] },
      ],
    },
  },
};

// 部门定制描述映射
const departmentDescriptions: Record<string, string> = {
  新项目组: "探索创新玩法，快速验证创意",
  核心项目组: "打磨精品内容，追求极致体验",
  技术中台: "建设基础能力，赋能业务团队",
  发行运营部: "推动用户增长，提升商业价值",
};

// 经验等级对阶段描述的微调
const experienceModifiers: Record<string, Record<string, string>> = {
  基础: {
    基础融入期: "循序渐进，夯实AI基础认知",
    岗位训练期: "手把手带教，建立岗位AI工作流",
    业务实战期: "在导师指导下完成首个实战项目",
  },
  熟练: {
    基础融入期: "快速梳理，补齐知识短板",
    岗位训练期: "自主探索，深化岗位AI应用",
    业务实战期: "独立承担业务模块，追求高质量交付",
  },
  专家: {
    基础融入期: "战略性审视，建立组织级认知",
    岗位训练期: "主导标准制定，推动团队能力提升",
    业务实战期: "牵头核心项目，创造业务价值",
  },
};

/**
 * 根据员工画像生成本地个性化学习路径
 */
export function generateLocalLearningPath(
  profile: EmployeeProfile
): LearningPathGenerationResult {
  const { role, aiExperience, department } = profile;

  // 获取模板，不存在则使用策划-基础作为兜底
  const roleKey = roleTemplates[role] ? role : "游戏策划";
  const expKey = roleTemplates[roleKey][aiExperience] ? aiExperience : "基础";
  const template = roleTemplates[roleKey][expKey];

  // 部门信息附加到第1周交付物中
  const deptDesc = departmentDescriptions[department] || `${department}专项融入`;

  const weekTasks: WeekTask[] = template.weeks.map((w, i) => ({
    week: i + 1,
    title: w.title,
    type: w.type,
    status: "pending" as const,
    deliverables:
      i === 0
        ? [...w.deliverables, `${department}业务背景了解记录`]
        : w.deliverables,
  }));

  const phases: Array<{
    name: PhaseName;
    weeks: number[];
    color: string;
    description: string;
  }> = [
    {
      name: "基础融入期",
      weeks: [1, 2, 3, 4],
      color: PHASE_COLORS[0],
      description: experienceModifiers[expKey]["基础融入期"],
    },
    {
      name: "岗位训练期",
      weeks: [5, 6, 7, 8],
      color: PHASE_COLORS[1],
      description: experienceModifiers[expKey]["岗位训练期"],
    },
    {
      name: "业务实战期",
      weeks: [9, 10, 11, 12],
      color: PHASE_COLORS[2],
      description: experienceModifiers[expKey]["业务实战期"],
    },
  ];

  // 根据部门微调第9周标题（真实业务课题）
  if (weekTasks[8]) {
    weekTasks[8].title = `${deptDesc}——${weekTasks[8].title}`;
  }

  return { phases, weekTasks };
}
