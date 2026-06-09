import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import { useCoach } from "../../context/CoachContext";
import { Loader2 } from "lucide-react";

export default function ChatWindow() {
  const { messages, isLoading } = useCoach();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center">
            <span className="text-brand text-xs font-bold">AI</span>
          </div>
          <div className="bg-white border border-border-light shadow-card rounded-2xl rounded-bl-md px-4 py-3">
            <Loader2 size={18} className="text-brand animate-spin" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
