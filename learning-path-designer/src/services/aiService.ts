/**
 * OpenAI API 服务层
 * 处理与 OpenAI API 的通信，支持 streaming 响应
 */

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIStreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

/**
 * 调用 OpenAI Chat Completions API（Streaming 模式）
 * @param messages 对话消息列表
 * @param callbacks 回调函数
 * @returns Promise<void>
 */
export async function callOpenAIStream(
  messages: OpenAIMessage[],
  callbacks: OpenAIStreamCallbacks
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    callbacks.onError(new Error('未配置 OpenAI API Key，请在环境变量中设置 VITE_OPENAI_API_KEY'));
    return;
  }

  try {
    const apiBase = import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1';
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `OpenAI API 错误 (${response.status})`;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // 使用默认错误信息
      }

      // 根据状态码提供友好提示
      if (response.status === 401) {
        errorMessage = 'API Key 无效或已过期，请检查配置';
      } else if (response.status === 429) {
        errorMessage = 'API 调用频率超限，请稍后重试';
      } else if (response.status >= 500) {
        errorMessage = 'OpenAI 服务暂时不可用，请稍后重试';
      }

      callbacks.onError(new Error(errorMessage));
      return;
    }

    if (!response.body) {
      callbacks.onError(new Error('响应体为空，无法读取流'));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            break;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;

            if (content) {
              fullText += content;
              callbacks.onChunk(content);
            }
          } catch {
            // 忽略解析错误（可能是不完整的 JSON）
          }
        }
      }
    }

    callbacks.onComplete(fullText);
  } catch (error) {
    if (error instanceof Error) {
      callbacks.onError(error);
    } else {
      callbacks.onError(new Error('网络错误，请检查网络连接'));
    }
  }
}

/**
 * 非 Streaming 模式的 OpenAI API 调用（备用）
 * @param messages 对话消息列表
 * @returns Promise<string> 完整响应文本
 */
export async function callOpenAI(
  messages: OpenAIMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('未配置 OpenAI API Key，请在环境变量中设置 VITE_OPENAI_API_KEY');
  }

  const apiBase = import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1';
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
      messages: messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API 错误 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
