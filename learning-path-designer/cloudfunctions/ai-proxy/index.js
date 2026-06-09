/**
 * AI API Proxy - CloudBase Event Function
 * 通过 app.callFunction() 调用，代理 OpenAI 兼容 API 请求
 */

const https = require("https");
const http = require("http");

// 从环境变量读取配置
const API_KEY = process.env.AI_API_KEY || "";
const API_BASE = process.env.AI_API_BASE || "https://api.openai.com/v1";
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4";

const API_URL = new URL(API_BASE);

/**
 * 代理 AI API 请求
 */
function proxyAIApi(params) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: params.model || DEFAULT_MODEL,
      messages: params.messages || [],
      stream: false,
      max_tokens: params.max_tokens || 4096,
      temperature: params.temperature ?? 0.7,
    });

    const apiPath = API_URL.pathname === "/"
      ? "/chat/completions"
      : API_URL.pathname + "/chat/completions";

    const options = {
      hostname: API_URL.hostname,
      port: API_URL.port || (API_URL.protocol === "https:" ? 443 : 80),
      path: apiPath,
      method: "POST",
      timeout: 60000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const transport = API_URL.protocol === "https:" ? https : http;
    const req = transport.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              success: true,
              data: json,
              content: json.choices?.[0]?.message?.content || "",
            });
          } else {
            resolve({
              success: false,
              error: json.error?.message || `Upstream API returned ${res.statusCode}`,
              status: res.statusCode,
            });
          }
        } catch (e) {
          resolve({
            success: false,
            error: `Failed to parse upstream response: ${data?.substring(0, 200)}`,
            status: res.statusCode,
          });
        }
      });
    });

    req.on("error", (e) => {
      resolve({
        success: false,
        error: `Connection error: ${e.message}`,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        success: false,
        error: "Upstream API timeout",
      });
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Event Function 入口
 * 通过 app.callFunction({ name: 'ai-proxy', data: {...} }) 调用
 */
exports.main = async (event, context) => {
  const { messages, model, max_tokens, temperature } = event;

  if (!messages || !Array.isArray(messages)) {
    return {
      success: false,
      error: "Missing or invalid 'messages' parameter",
    };
  }

  return await proxyAIApi({ messages, model, max_tokens, temperature });
};
