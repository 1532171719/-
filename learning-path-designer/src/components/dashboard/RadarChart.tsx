import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";

export default function SkillRadarChart() {
  const { skills } = useApp();

  const data = [
    { name: 'AI工具', value: skills.aiToolSkill, fullMark: 100 },
    { name: 'Prompt', value: skills.promptSkill, fullMark: 100 },
    { name: '工作流', value: skills.workflowSkill, fullMark: 100 },
    { name: '风险意识', value: skills.riskAwareness, fullMark: 100 },
    { name: '协作', value: skills.collaboration, fullMark: 100 },
    { name: '交付质量', value: skills.deliveryQuality, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <defs>
            <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#4F46E5" fill="url(#radarGrad)" fillOpacity={0.5} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
