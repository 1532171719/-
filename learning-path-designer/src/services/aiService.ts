/**
 * AI 服务层
 * 通过 CloudBase 云函数 ai-proxy 代理调用 OpenAI 兼容 API
 */

import { app } from "../config/cloudbase";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIStreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

/**
 * 调用云函数 ai-proxy，返回 AI 回复文本
 */
async function callCloudFunction(
  messages: OpenAIMessage[],
  model?: string,
  max_tokens?: number,
  temperature?: number
): Promise<string> {
  const res: any = await (app as any).callFunction({
    name: "ai-proxy",
    data: { messages, model, max_tokens, temperature },
  });

  if (!res.result?.success) {
    const errMsg = res.result?.error || `云函数调用失败 (code: ${res.result?.code || "unknown"})`;
    throw new Error(errMsg);
  }

  const content = res.result.content || "";
  if (!content) {
    throw new Error("AI 返回内容为空");
  }
  return content;
}

/**
 * 清理 AI 返回内容中的乱码字符（Unicode 替换字符 U+FFFD）
 */
function sanitizeAIContent(text: string): string {
  return text.replace(/\uFFFD+/g, "？");
}

/**
 * 调用 AI API（Streaming 模式 - 前端模拟流式输出）
 */
export async function callOpenAIStream(
  messages: OpenAIMessage[],
  callbacks: OpenAIStreamCallbacks
): Promise<void> {
  try {
    const content = sanitizeAIContent(await callCloudFunction(messages));
    await simulateStreamOutput(content, callbacks);
  } catch (error: unknown) {
    if (error instanceof Error) {
      callbacks.onError(error);
    } else {
      callbacks.onError(new Error("网络错误，请检查网络连接"));
    }
  }
}

/**
 * 模拟流式输出，将文本逐块显示
 * 使用 Array.from 确保不切断 Unicode 字符（如 emoji、辅助平面字符）
 */
async function simulateStreamOutput(
  text: string,
  callbacks: OpenAIStreamCallbacks
): Promise<void> {
  let fullText = "";
  const chars = Array.from(text); // 按 Unicode code point 拆分
  const chunkSize = 3;

  for (let i = 0; i < chars.length; i += chunkSize) {
    const chunk = chars.slice(i, i + chunkSize).join("");
    fullText += chunk;
    callbacks.onChunk(chunk);
    await new Promise((resolve) => setTimeout(resolve, 15));
  }

  callbacks.onComplete(fullText);
}

/**
 * 非 Streaming 模式的 AI API 调用
 */
export async function callOpenAI(messages: OpenAIMessage[]): Promise<string> {
  return callCloudFunction(messages);
}
