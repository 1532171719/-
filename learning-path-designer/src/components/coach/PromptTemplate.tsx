import React from "react";
import GlassCard from "../ui/GlassCard";

interface PromptTemplateProps {
  text: string;
  title: string;
}

export default function PromptTemplateDisplay({ text, title }: PromptTemplateProps) {
  return (
    <GlassCard neonColor="purple" className="p-4">
      <h4 className="text-sm font-semibold text-brand mb-2">{title}</h4>
      <pre className="text-xs text-text-main bg-bg-elevated rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/5">
        {text}
      </pre>
    </GlassCard>
  );
}
