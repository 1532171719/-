import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, TrendingUp, Award, AlertCircle,
  Star, ArrowRight, Calendar, CheckCircle, Brain,
  ChevronRight, Wrench, Target, Users
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import GlassCard from "../components/ui/GlassCard";
import ParticleBg from "../components/ui/ParticleBg";
import { useApp } from "../context/AppContext";
import { getAllGrowthReports, getGrowthReport, getPersonalizedReport, type GrowthReport as GrowthReportType, type GrowthRecord } from "../data/growthReport";

/* ═══════════════════════════════════════
   能力雷达图
   ═══════════════════════════════════════ */
function SkillComparison({ report }: { report: GrowthReportType }) {
  const monthlyData = report.records.map((r, i) => ({
    month: `第${i + 1}个月`,
    'AI工具': r.skills.aiToolSkill,
    'Prompt': r.skills.promptSkill,
    '工作流': r.skills.workflowSkill,
    '风险意识': r.skills.riskAwareness,
    '协作': r.skills.collaboration,
    '交付质量': r.skills.deliveryQuality,
  }));

  const chartData = [
    { name: 'AI工具', M1: monthlyData[0]?.['AI工具'] || 0, M2: monthlyData[1]?.['AI工具'] || 0, M3: monthlyData[2]?.['AI工具'] || 0 },
    { name: 'Prompt', M1: monthlyData[0]?.['Prompt'] || 0, M2: monthlyData[1]?.['Prompt'] || 0, M3: monthlyData[2]?.['Prompt'] || 0 },
    { name: '工作流', M1: monthlyData[0]?.['工作流'] || 0, M2: monthlyData[1]?.['工作流'] || 0, M3: monthlyData[2]?.['工作流'] || 0 },
    { name: '风险意识', M1: monthlyData[0]?.['风险意识'] || 0, M2: monthlyData[1]?.['风险意识'] || 0, M3: monthlyData[2]?.['风险意识'] || 0 },
    { name: '协作', M1: monthlyData[0]?.['协作'] || 0, M2: monthlyData[1]?.['协作'] || 0, M3: monthlyData[2]?.['协作'] || 0 },
    { name: '交付质量', M1: monthlyData[0]?.['交付质量'] || 0, M2: monthlyData[1]?.['交付质量'] || 0, M3: monthlyData[2]?.['交付质量'] || 0 },
  ];

  return (
    <RadarChart width={380} height={300} data={chartData} className="mx-auto">
      <PolarGrid stroke="rgba(255,255,255,0.08)" />
      <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
      <Radar dataKey="M1" stroke="#00C9FF" fill="#00C9FF" fillOpacity={0.1} name="第1个月" />
      <Radar dataKey="M2" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.15} name="第2个月" />
      <Radar dataKey="M3" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.15} name="第3个月" />
      <Legend wrapperStyle={{ fontSize: 11 }} />
    </RadarChart>
  );
}

/* ═══════════════════════════════════════
   月度记录卡片
   ═══════════════════════════════════════ */
function MonthCard({ record, index }: { record: GrowthRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const months = ['一', '二', '三'];

  return (
    <GlassCard className="overflow-hidden">
      <div
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text-primary">第{months[index]}个月</h4>
          <p className="text-xs text-text-secondary">
            {record.completedTasks.length} 项任务完成 · {record.highlights.length} 项亮点
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-purple-400">
            {Math.round(Object.values(record.skills).reduce((a, b) => a + b, 0) / 6)}
          </div>
          <p className="text-xs text-text-secondary">综合分</p>
        </div>
        <ChevronRight
          size={18}
          className={`text-text-secondary transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden border-t border-white/10"
        >
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-cyan-400 mb-1.5 flex items-center gap-1">
                <Star size={12} /> 亮点
              </p>
              {record.highlights.map((h, i) => (
                <p key={i} className="text-sm text-text-secondary ml-1">• {h}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-green-400 mb-1.5 flex items-center gap-1">
                <CheckCircle size={12} /> 完成任务
              </p>
              {record.completedTasks.map((t, i) => (
                <p key={i} className="text-sm text-text-secondary ml-1">• {t}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-purple-400 mb-1.5 flex items-center gap-1">
                <Brain size={12} /> 导师点评
              </p>
              <p className="text-sm text-text-secondary">{record.feedback}</p>
            </div>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   新人选择标签栏（HR 视角）
   ═══════════════════════════════════════ */
function EmployeeSelector({
  reports,
  selectedId,
  onSelect,
}: {
  reports: GrowthReportType[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const getRiskColor = (verdict: string) => {
    if (verdict === 'recommend_pass') return 'bg-green-500';
    if (verdict === 'conditional_pass') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-text-primary">选择新人查看报告</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {reports.map((r) => {
          const isActive = r.profile.employeeId === selectedId;
          const avgSkill = Math.round(Object.values(r.finalSkills).reduce((a, b) => a + b, 0) / 6);
          return (
            <button
              key={r.profile.employeeId}
              onClick={() => onSelect(r.profile.employeeId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400 shadow-lg shadow-purple-500/10'
                  : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${getRiskColor(r.verdict)}`} />
              <span>{r.profile.name}</span>
              <span className="text-xs opacity-60">{r.profile.role}</span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-text-secondary'
              }`}>
                {avgSkill}分
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   报告主体内容
   ═══════════════════════════════════════ */
function ReportContent({ report }: { report: GrowthReportType }) {
  const avgSkill = Math.round(Object.values(report.finalSkills).reduce((a, b) => a + b, 0) / 6);

  return (
    <>
      {/* 员工信息头 */}
      <GlassCard className="p-5 mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/20"
            whileHover={{ scale: 1.05 }}
          >
            {report.profile.name.slice(0, 1)}
          </motion.div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary">{report.profile.name}</h2>
            <p className="text-sm text-text-secondary">{report.profile.role} · {report.profile.department}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <Calendar size={12} />
                入职：{report.profile.startDate}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <Target size={12} />
                导师：{report.profile.mentor}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Award size={12} className="text-yellow-400" />
                <span className="text-yellow-400 font-semibold">综合评分：{avgSkill}</span>
              </span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
            report.verdict === 'recommend_pass' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
            report.verdict === 'conditional_pass' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/15 text-red-400 border border-red-500/30'
          }`}>
            {report.verdict === 'recommend_pass' ? '✅ 建议转正' :
             report.verdict === 'conditional_pass' ? '⚠️ 有条件通过' : '❌ 不建议转正'}
          </div>
        </div>
      </GlassCard>

      {/* 三个月能力对比雷达图 */}
      <GlassCard className="p-5 mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-400" />
          三个月能力成长对比
        </h3>
        <SkillComparison report={report} />
      </GlassCard>

      {/* 三阶段卡片 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-cyan-400" />
          月度成长记录
        </h3>
        <div className="space-y-2">
          {report.records.map((record, i) => (
            <MonthCard key={i} record={record} index={i} />
          ))}
        </div>
      </div>

      {/* 双栏：优势与改进 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-1.5">
            <Star size={15} /> 个人优势
          </h4>
          {report.strengths.map((s, i) => (
            <p key={i} className="text-sm text-text-secondary mb-2 last:mb-0">• {s}</p>
          ))}
        </GlassCard>
        <GlassCard className="p-4">
          <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-1.5">
            <AlertCircle size={15} /> 待提升方向
          </h4>
          {report.improvements.map((s, i) => (
            <p key={i} className="text-sm text-text-secondary mb-2 last:mb-0">• {s}</p>
          ))}
        </GlassCard>
      </div>

      {/* 转正意见 */}
      <GlassCard className="p-4 mb-6 border-l-4 border-purple-500/50">
        <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
          <Brain size={15} /> 转正评估意见
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {report.verdictNote}
        </p>
      </GlassCard>

      {/* AI 工具使用情况 */}
      <GlassCard className="p-4 mb-6">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
          <Wrench size={15} className="text-cyan-400" />
          AI 工具使用情况
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-white/10">
                <th className="text-left py-2 font-medium">工具</th>
                <th className="text-left py-2 font-medium">使用频率</th>
                <th className="text-left py-2 font-medium">熟练度</th>
                <th className="text-right py-2 font-medium">进度</th>
              </tr>
            </thead>
            <tbody>
              {report.aiToolUsage.map((t, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2.5 text-text-primary">{t.tool}</td>
                  <td className="py-2.5 text-text-secondary">{t.frequency}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      t.level === '熟练' ? 'bg-green-500/15 text-green-400' :
                      t.level === '一般' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>{t.level}</span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${t.level === '熟练' ? 'bg-green-400' : t.level === '一般' ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: t.level === '熟练' ? '90%' : t.level === '一般' ? '55%' : '25%' }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary">
                        {t.level === '熟练' ? '90' : t.level === '一般' ? '55' : '25'}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* 下一步计划 */}
      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5">
          <ArrowRight size={15} className="text-green-400" />
          下阶段成长计划
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {report.nextPlan.map((plan, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-purple-400">{i + 1}</span>
              </div>
              <p className="text-sm text-text-secondary">{plan}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
}

/* ═══════════════════════════════════════
   主入口
   ═══════════════════════════════════════ */
export default function GrowthReport() {
  const { role, profile } = useApp();
  const isHR = role === 'hr';

  // HR：可查看多人，员工：只看自己
  const allReports = getAllGrowthReports();
  const [selectedId, setSelectedId] = useState(allReports[0]?.profile.employeeId || 'E001');

  // 获取当前要显示的报告
  const currentReport = isHR
    ? (getGrowthReport(selectedId) || allReports[0])
    : getPersonalizedReport(profile.name);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <ParticleBg />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FileText size={24} className="text-accent-purple" />
            {isHR ? '团队成长报告' : '新人成长报告'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isHR
              ? '查看团队所有新人的成长轨迹与转正评估'
              : '三个月学习与融入总结 · 个人成长轨迹可视化'}
          </p>
        </motion.div>

        {/* HR 视角：新人选择器 */}
        {isHR && (
          <EmployeeSelector
            reports={allReports}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {/* 报告内容 */}
        {currentReport && <ReportContent report={currentReport} />}
      </div>
    </motion.div>
  );
}
