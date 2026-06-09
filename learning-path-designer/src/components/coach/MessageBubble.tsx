import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../../types";
import TypingText from "../ui/TypingText";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-gradient-to-br from-brand to-brand-light text-white rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed shadow-lg">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
        <span className="text-brand text-xs font-bold">AI</span>
      </div>
      <div className="max-w-[75%] bg-white border border-border-light shadow-card rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed">
        <div className="text-text-main prose prose-sm max-w-none prose-pre:bg-[#f7f7f8] prose-pre:text-gray-800 prose-pre:text-[13px] prose-pre:leading-relaxed prose-pre:px-4 prose-pre:py-3 prose-pre:rounded-md prose-code:text-gray-800 prose-code:bg-transparent prose-code:px-0 prose-code:py-0 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
          {message.isTyping ? (
            <TypingText text={message.content} speed={25} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
