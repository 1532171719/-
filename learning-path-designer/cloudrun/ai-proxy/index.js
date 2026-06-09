/**
 * AI API Proxy - CloudRun Function
 * 代理 OpenAI 兼容 API 请求，解决跨域和 Key 暴露问题
 * CloudRun Function 模式监听端口 3000
 */
const http = require("http");
const https = require("https");

// CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 从环境变量读取配置
const API_KEY = process.env.AI_API_KEY || "";
const API_BASE = process.env.AI_API_BASE || "https://api.openai.com/v1";
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4";

const API_URL = new URL(API_BASE);

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...CORS_HEADERS,
  });
  res.end(body);
}

function sendOptions(res) {
  res.writeHead(204, CORS_HEADERS);
  res.end();
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { resolve({}); }
    });
  });
}

/**
 * 非流式代理请求
 */
function proxyRequest(body, timeout) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: body.model || DEFAULT_MODEL,
      messages: body.messages,
      stream: false,
      max_tokens: body.max_tokens || 4096,
      temperature: body.temperature ?? 0.7,
    });

    const options = {
      hostname: API_URL.hostname,
      port: API_URL.port || (API_URL.protocol === "https:" ? 443 : 80),
      path: API_URL.pathname === "/" ? "/chat/completions" : API_URL.pathname + "/chat/completions",
      method: "POST",
      timeout: timeout || 60000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const transport = API_URL.protocol === "https:" ? https : http;
    const upstreamReq = transport.request(options, (upstreamRes) => {
      let data = "";
      upstreamRes.on("data", (chunk) => { data += chunk; });
      upstreamRes.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (upstreamRes.statusCode >= 200 && upstreamRes.statusCode < 300) {
            resolve({ status: upstreamRes.statusCode, data: json });
          } else {
            reject({
              status: upstreamRes.statusCode,
              message: json.error?.message || `Upstream API returned ${upstreamRes.statusCode}`,
            });
          }
        } catch (e) {
          reject({ status: upstreamRes.statusCode, message: data });
        }
      });
    });

    upstreamReq.on("error", (e) => reject({ status: 502, message: `Upstream connection error: ${e.message}` }));
    upstreamReq.on("timeout", () => { upstreamReq.destroy(); reject({ status: 504, message: "Upstream timeout" }); });

    upstreamReq.write(postData);
    upstreamReq.end();
  });
}

/**
 * 流式代理请求
 */
function proxyStreamRequest(body, res, timeout) {
  const postData = JSON.stringify({
    model: body.model || DEFAULT_MODEL,
    messages: body.messages,
    stream: true,
    max_tokens: body.max_tokens || 4096,
    temperature: body.temperature ?? 0.7,
  });

  const options = {
    hostname: API_URL.hostname,
    port: API_URL.port || (API_URL.protocol === "https:" ? 443 : 80),
    path: API_URL.pathname === "/" ? "/chat/completions" : API_URL.pathname + "/chat/completions",
    method: "POST",
    timeout: timeout || 120000,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const transport = API_URL.protocol === "https:" ? https : http;

  // 设置 SSE 响应头
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    ...CORS_HEADERS,
  });

  const upstreamReq = transport.request(options, (upstreamRes) => {
    if (upstreamRes.statusCode >= 400) {
      let errorData = "";
      upstreamRes.on("data", (chunk) => { errorData += chunk; });
      upstreamRes.on("end", () => {
        let errMsg = `Upstream API returned ${upstreamRes.statusCode}`;
        try {
          const err = JSON.parse(errorData);
          if (err.error?.message) errMsg = err.error.message;
        } catch {}
        res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
        res.end("data: [DONE]\n\n");
      });
      return;
    }

    upstreamRes.on("data", (chunk) => {
      res.write(chunk);
    });

    upstreamRes.on("end", () => {
      res.end();
    });

    upstreamRes.on("error", (e) => {
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end("data: [DONE]\n\n");
    });
  });

  upstreamReq.on("error", (e) => {
    res.write(`data: ${JSON.stringify({ error: `Upstream connection error: ${e.message}` })}\n\n`);
    res.end("data: [DONE]\n\n");
  });

  upstreamReq.on("timeout", () => {
    upstreamReq.destroy();
    res.write(`data: ${JSON.stringify({ error: "Upstream timeout" })}\n\n`);
    res.end("data: [DONE]\n\n");
  });

  upstreamReq.write(postData);
  upstreamReq.end();
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return sendOptions(res);
  }

  const url = new URL(req.url || "/", "http://127.0.0.1");

  // Health check
  if (req.method === "GET" && url.pathname === "/") {
    return sendJson(res, 200, { status: "ok", message: "AI Proxy is running" });
  }

  // Chat completions endpoint
  if (req.method === "POST" && url.pathname === "/chat/completions") {
    try {
      const body = await readBody(req);

      if (body.stream) {
        return await proxyStreamRequest(body, res, 120000);
      } else {
        const result = await proxyRequest(body, 60000);
        return sendJson(res, 200, result.data);
      }
    } catch (error) {
      const status = error.status || 500;
      return sendJson(res, status, {
        error: { message: error.message || "Internal server error" },
      });
    }
  }

  sendJson(res, 404, { error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AI Proxy listening on port ${PORT}`);
});
