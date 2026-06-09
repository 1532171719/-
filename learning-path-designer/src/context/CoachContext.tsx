import React, { createContext, useContext, useState, useCallback } from "react";
import { ChatMessage, SubTask, CoachPhase } from "../types";
import { callOpenAIStream, OpenAIMessage } from "../services/aiService";
import { detectTaskScene, getSystemPrompt, getFollowUpTemplate } from "../services/taskScenePrompts";

interface CoachContextValue {
  messages: ChatMessage[];
  subTasks: SubTask[];
  phase: CoachPhase;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  resetCoach: () => void;
}

const CoachContext = createContext<CoachContextValue | null>(null);

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: '👋 你好！我是你的 **AI 任务教练**。\n\n输入你当前需要完成的岗位任务，我会帮你拆解成清晰的步骤，并为你生成 Prompt 模板、推荐工具和检查清单。\n\n💡 **试试这些**：\n• "帮我设计一个新手7日登录活动"\n• "我需要实现一个任务系统接口"\n• "我要做NPC角色概念探索"',
      timestamp: Date.now() - 60000,
    },
  ]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [phase, setPhase] = useState<CoachPhase>('WAITING_INPUT');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationRound, setConversationRound] = useState(0);
  const [currentScene, setCurrentScene] = useState<string>('');
  const [originalUserInput, setOriginalUserInput] = useState<string>('');

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    if (conversationRound === 0) {
      // 第一轮：识别任务场景，让 AI 提出追问
      const scene = detectTaskScene(content);
      setCurrentScene(scene);
      setOriginalUserInput(content);

      const systemPrompt = getSystemPrompt(scene);
      const followUpTemplate = getFollowUpTemplate(scene);

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `用户的任务需求：${content}\n\n请根据上述需求，提出需要补充的关键信息问题。${followUpTemplate}\n\n要求：语气友好，问题清晰，帮助用户提供更多信息以便更好地拆解任务。` }
      ];

      callOpenAIStream(messages, {
        onChunk: (text) => {
          // 流式更新 AI 消息
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'ai' && lastMsg.id.startsWith('ai-stream-')) {
              return prev.map(msg =>
                msg.id === lastMsg.id
                  ? { ...msg, content: msg.content + text }
                  : msg
              );
            } else {
              const newMsg: ChatMessage = {
                id: `ai-stream-${Date.now()}`,
                role: 'ai',
                content: text,
                timestamp: Date.now(),
              };
              return [...prev, newMsg];
            }
          });
        },
        onComplete: (fullText) => {
          setIsLoading(false);
          setPhase('FOLLOW_UP');
          setConversationRound(1);
        },
        onError: (error) => {
          setIsLoading(false);
          // 添加错误消息
          const errorMsg: ChatMessage = {
            id: `ai-error-${Date.now()}`,
            role: 'ai',
            content: `❌ ${error.message}\n\n请检查 API Key 配置或稍后重试。`,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      });
    } else {
      // 第二轮：用户提供补充信息，AI 拆解任务
      const scene = currentScene;
      const systemPrompt = getSystemPrompt(scene);

      const messages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `用户的原始任务需求：${originalUserInput}\n\n用户补充的信息：${content}\n\n请帮我将这个任务拆解为具体的执行步骤。\n\n要求：\n1. 输出清晰的步骤列表（每个步骤包含标题和描述）\n2. 为每个步骤提供一个 Prompt 模板（用代码块包裹）\n3. 推荐每个步骤使用的 AI 工具\n4. 提供检查清单\n5. 标注风险提示\n\n使用 Markdown 格式输出，结构清晰。` }
      ];

      callOpenAIStream(messages, {
        onChunk: (text) => {
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'ai' && lastMsg.id.startsWith('ai-stream-')) {
              return prev.map(msg =>
                msg.id === lastMsg.id
                  ? { ...msg, content: msg.content + text }
                  : msg
              );
            } else {
              const newMsg: ChatMessage = {
                id: `ai-stream-${Date.now()}`,
                role: 'ai',
                content: text,
                timestamp: Date.now(),
              };
              return [...prev, newMsg];
            }
          });
        },
        onComplete: (fullText) => {
          setIsLoading(false);
          setPhase('COMPLETE');
          setConversationRound(2);

          // 尝试从 AI 响应中提取子任务（简单解析）
          const extractedTasks = extractSubTasksFromResponse(fullText, scene);
          if (extractedTasks.length > 0) {
            setSubTasks(extractedTasks);
          }
        },
        onError: (error) => {
          setIsLoading(false);
          const errorMsg: ChatMessage = {
            id: `ai-error-${Date.now()}`,
            role: 'ai',
            content: `❌ ${error.message}\n\n请检查 API Key 配置或稍后重试。`,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      });
    }
  }, [conversationRound, currentScene, originalUserInput]);

  const resetCoach = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'ai',
      content: '👋 你好！我是你的 **AI 任务教练**。\n\n输入你当前需要完成的岗位任务，我会帮你拆解成清晰的步骤，并为你生成 Prompt 模板、推荐工具和检查清单。\n\n💡 **试试这些**：\n• "帮我设计一个新手7日登录活动"\n• "我需要实现一个任务系统接口"\n• "我要做NPC角色概念探索"',
      timestamp: Date.now(),
    }]);
    setSubTasks([]);
    setPhase('WAITING_INPUT');
    setIsLoading(false);
    setConversationRound(0);
    setCurrentScene('');
    setOriginalUserInput('');
  }, []);

  return (
    <CoachContext.Provider value={{ messages, subTasks, phase, isLoading, sendMessage, resetCoach }}>
      {children}
    </CoachContext.Provider>
  );
}

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error("useCoach must be used within CoachProvider");
  return ctx;
}

/**
 * 从 AI 响应中提取子任务（简单解析）
 * @param response AI 的完整响应文本
 * @param scene 任务场景
 * @returns 提取的子任务数组
 */
function extractSubTasksFromResponse(response: string, scene: string): SubTask[] {
  const tasks: SubTask[] = [];

  // 简单的解析逻辑：查找 "步骤" 或 "##" 等标记
  const lines = response.split('\n');
  let currentTask: Partial<SubTask> | null = null;
  let taskIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测步骤标题（支持多种格式：## 1. xxx, **步骤1**, 1. xxx）
    if (line.match(/^(#{1,3}\s*\d+[.、]\s*|[*\-]\s*\d+[.、]\s*|^\d+[.、]\s*)/i)) {
      if (currentTask && currentTask.title) {
        tasks.push({
          id: `st-${taskIndex}`,
          title: currentTask.title,
          description: currentTask.description || '',
          promptTemplate: currentTask.promptTemplate || '',
          recommendedTools: currentTask.recommendedTools || [],
          checklist: currentTask.checklist || [],
          riskWarnings: currentTask.riskWarnings || [],
        });
        taskIndex++;
      }

      currentTask = {
        title: line.replace(/^(#{1,3}\s*\d+[.、]\s*|[*\-]\s*\d+[.、]\s*|^\d+[.、]\s*)/i, '').trim(),
        description: '',
        promptTemplate: '',
        recommendedTools: [],
        checklist: [],
        riskWarnings: [],
      };
    } else if (currentTask) {
      // 收集描述内容
      if (line && !line.startsWith('```')) {
        currentTask.description = (currentTask.description || '') + line + '\n';
      }

      // 检测 Prompt 模板（代码块）
      if (line.startsWith('```') && currentTask) {
        let promptText = '';
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('```')) {
          promptText += lines[j] + '\n';
          j++;
        }
        i = j;
        currentTask.promptTemplate = promptText.trim();
      }

      // 检测工具推荐
      if (line.includes('工具') || line.includes('推荐')) {
        const toolsMatch = line.match(/[：:]\s*(.+)/);
        if (toolsMatch) {
          currentTask.recommendedTools = toolsMatch[1].split(/[,，、]/).map(t => t.trim()).filter(Boolean);
        }
      }
    }
  }

  // 添加最后一个任务
  if (currentTask && currentTask.title) {
    tasks.push({
      id: `st-${taskIndex}`,
      title: currentTask.title,
      description: currentTask.description || '',
      promptTemplate: currentTask.promptTemplate || '',
      recommendedTools: currentTask.recommendedTools || [],
      checklist: currentTask.checklist || [],
      riskWarnings: currentTask.riskWarnings || [],
    });
  }

  // 如果解析失败，返回默认任务
  if (tasks.length === 0) {
    return [{
      id: 'st-default',
      title: '任务拆解结果',
      description: 'AI 已为你拆解任务，请在对话中查看详细步骤',
      promptTemplate: '请根据 AI 的回复，逐步完成任务',
      recommendedTools: ['ChatGPT'],
      checklist: ['已理解任务拆解', '已开始执行第一步'],
      riskWarnings: ['注意 AI 输出可能不完全准确'],
    }];
  }

  return tasks;
}
