import { defineEventHandler, readBody, sendStream, getHeader } from 'h3';
import { Readable } from 'node:stream';
import { z } from 'zod';
import { Configuration, OpenAIApi } from 'openai';
import { nanoid } from 'nanoid';
import { encoding_for_model } from '@dqbd/tiktoken';
import { createParser } from 'eventsource-parser';
import { fetch } from 'unenv/runtime/npm/cross-fetch';
import { u as useRuntimeConfig } from './nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

function trimIndent(content) {
  const lines = content.split("\n");
  const indent = lines.map((line) => line.trimStart());
  return indent.join("\n");
}

async function fetchSSE(url, options) {
  var _a;
  const f = process.client ? window.fetch : fetch;
  const { onMessage, onError, ...fetchOptions } = options;
  const res = await f(url, fetchOptions);
  if (!res.ok) {
    let reason;
    try {
      reason = await res.text();
    } catch (err) {
      reason = res.statusText;
    }
    const message = `ChatGPT error ${res.status}: ${reason}`;
    const error = new OpenAIError({ message, cause: reason, statusCode: res.status });
    throw error;
  }
  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
    }
  });
  const feed = (chunk) => {
    var _a2;
    let response = null;
    try {
      response = JSON.parse(chunk);
    } catch {
    }
    if (((_a2 = response == null ? void 0 : response.detail) == null ? void 0 : _a2.type) === "invalid_request_error") {
      const message = `ChatGPT error ${response.detail.message}: ${response.detail.code} (${response.detail.type})`;
      const error = new OpenAIError({
        message,
        cause: response.detail,
        statusCode: response.detail.code
      });
      if (onError) {
        onError(error);
      } else {
        console.error(error);
      }
      return;
    }
    parser.feed(chunk);
  };
  if (!((_a = res == null ? void 0 : res.body) == null ? void 0 : _a.getReader)) {
    const body = res.body;
    if (!(body == null ? void 0 : body.on) || !(body == null ? void 0 : body.read)) {
      throw new OpenAIError({ message: 'unsupported "fetch" implementation' });
    }
    body.on("readable", () => {
      let chunk = body.read();
      while (chunk !== null) {
        feed(chunk.toString());
        chunk = body.read();
      }
    });
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk);
      feed(str);
    }
  }
}
async function* streamAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
class OpenAIError extends Error {
  constructor(opts) {
    super(opts.message);
    this.cause = opts.cause;
    this.statusCode = opts.statusCode;
  }
}

const CHAT_COMPLETION_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const TokenCounter = {
  "gpt-4": encoding_for_model("gpt-4"),
  "gpt-3.5-turbo": encoding_for_model("gpt-3.5-turbo")
};
const MaxTokensPerModel = {
  "gpt-4": 8180,
  "gpt-3.5-turbo": 4080
};
const message_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const messageSchema = z.object({
    messages: z.array(z.object({
      content: z.string(),
      role: z.enum(["user", "assistant", "system"])
    })),
    systemMessage: z.string().optional().default(getDefaultSystemMessage()),
    model: z.enum(["gpt-3.5-turbo", "gpt-4"]),
    maxTokens: z.number().min(20).optional(),
    stream: z.boolean().optional().default(false)
  });
  const message = messageSchema.safeParse(body);
  if (!message.success) {
    event.node.res.statusCode = 400;
    return {
      error: "Invalid message",
      message: message.error
    };
  }
  const apiKey = getApiKey(event);
  if (!apiKey) {
    event.node.res.statusCode = 400;
    return {
      error: "Missing API key"
    };
  }
  const config = new Configuration({ apiKey });
  const openai = new OpenAIApi(config);
  const messageListWithSystemMessage = [
    { content: message.data.systemMessage, role: "system" },
    ...message.data.messages.filter(({ role }) => role !== "system")
  ];
  const request = {
    model: message.data.model,
    messages: messageListWithSystemMessage,
    max_tokens: message.data.maxTokens,
    stream: message.data.stream
  };
  const getTokenCount = () => TokenCounter[message.data.model].encode(messageListWithSystemMessage.map(({ content }) => content).join("\n\n")).length;
  let lastTokenCount = getTokenCount();
  if (getTokenCount() > MaxTokensPerModel[message.data.model]) {
    while (messageListWithSystemMessage.length > 1 && lastTokenCount > MaxTokensPerModel[message.data.model]) {
      messageListWithSystemMessage.shift();
      lastTokenCount = getTokenCount();
    }
    if (messageListWithSystemMessage.length === 1) {
      event.node.res.statusCode = 400;
      return {
        error: {
          error: "Too many tokens",
          code: "context_length_exceeded",
          message: `The token count for the messages is too high. The maximum is ${MaxTokensPerModel[message.data.model]}, but the current count is ${lastTokenCount}.`
        }
      };
    }
  }
  const result = {
    role: "assistant",
    id: nanoid(),
    text: "",
    delta: void 0,
    detail: void 0
  };
  try {
    if (message.data.stream) {
      const stream = new Readable({
        read() {
        },
        encoding: "utf8"
      });
      const response = await fetchSSE(CHAT_COMPLETION_ENDPOINT, {
        method: "POST",
        headers: getChatCompletionRequestHeaders(event),
        body: JSON.stringify(request),
        onMessage: (data) => {
          var _a2;
          if (data === "[DONE]") {
            result.text = result.text.trim();
            stream.push(null);
            return;
          }
          try {
            const response2 = JSON.parse(data);
            if (response2.id) {
              result.id = response2.id;
            }
            if ((_a2 = response2 == null ? void 0 : response2.choices) == null ? void 0 : _a2.length) {
              const delta = response2.choices[0].delta;
              result.delta = delta.content;
              if (delta == null ? void 0 : delta.content) {
                result.text += delta.content;
              }
              result.detail = response2;
              if (delta.role) {
                result.role = delta.role;
              }
              if (result.text) {
                stream.push(JSON.stringify(result));
              }
            }
          } catch (err) {
            console.log(data);
          }
        }
      });
      return sendStream(event, stream);
    } else {
      const res = await openai.createChatCompletion(request);
      if (res.data.id) {
        result.id = res.data.id;
      }
      const message2 = res.data.choices[0].message;
      if (!message2) {
        throw new Error("No message in response");
      }
      result.text = message2.content;
      if (message2.role) {
        result.role = message2.role;
      }
      result.detail = res.data;
      return result;
    }
  } catch (e) {
    if ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error) {
      event.node.res.statusCode = e.response.status;
      return {
        error: e.response.data.error,
        message: e.response.data.message
      };
    }
    event.node.res.statusCode = 500;
    return e.cause;
  }
});
function getApiKey(event) {
  const { apiKey: instanceApiKey } = useRuntimeConfig();
  const headerApiKey = getHeader(event, "x-openai-api-key");
  return headerApiKey || instanceApiKey;
}
function getChatCompletionRequestHeaders(event) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getApiKey(event)}`
  };
}
function getDefaultSystemMessage() {
  const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return trimIndent(`
        You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.
        Knowledge cutoff: 2021-09-01
        Current date: ${currentDate}
    `);
}

export { message_post as default };
//# sourceMappingURL=message.post.mjs.map
