import React from "react";
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
        <div className="text-text-main whitespace-pre-wrap [&_strong]:text-brand-light [&_strong]:font-semibold [&_li]:ml-4">
          {message.isTyping ? (
            <TypingText text={message.content} speed={25} />
          ) : (
            message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
