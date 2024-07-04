import { h as useSettings, l as logger } from '../server.mjs';
import { createParser } from 'eventsource-parser';
import { OpenAIApi, Configuration } from 'openai';
import { nanoid } from 'nanoid';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
async function handle(promise) {
  try {
    if (typeof promise === "function") {
      promise = promise();
    }
    const data = await promise;
    return { error: null, data };
  } catch (error) {
    return { error, data: null };
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
async function* streamOpenAIResponse(stream) {
  const iterator = streamAsyncIterable(stream);
  const queue = [];
  const addData = (item) => {
    queue.push(item);
  };
  const onData = async (chunkDecoded) => {
    createParser(async (event) => {
      if (event.type === "event") {
        if (event.data === "[DONE]") {
          addData(void 0);
          return;
        }
        try {
          const data = JSON.parse(event.data);
          addData(data);
        } catch {
          logger.error("Failed to parse chunk", event.data);
        }
      }
    }).feed(chunkDecoded);
  };
  (async () => {
    for await (const chunk of iterator) {
      const chunkDecoded = new TextDecoder().decode(chunk);
      await onData(chunkDecoded);
    }
  })();
  while (true) {
    if (queue.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      continue;
    }
    const nextValue = queue.shift();
    if (nextValue === void 0) {
      break;
    }
    yield nextValue;
  }
  return null;
}
class OpenAIError extends Error {
  constructor(opts) {
    super(opts.message);
    __publicField(this, "cause");
    __publicField(this, "statusCode");
    this.cause = opts.cause;
    this.statusCode = opts.statusCode;
  }
}
function useLanguageModel() {
  const { apiKey } = useSettings();
  async function complete(prompt, params) {
    var _a;
    const client = new OpenAIApi(new Configuration({
      apiKey: apiKey.value || ""
    }));
    const additionalParams = {
      temperature: (params == null ? void 0 : params.temperature) || 0.8,
      max_tokens: (params == null ? void 0 : params.maxTokens) || 256,
      stop: params == null ? void 0 : params.stop
    };
    const response = await client.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: (params == null ? void 0 : params.systemMessage) || "This is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly."
      }, {
        role: "user",
        content: prompt
      }],
      ...additionalParams
    });
    return (_a = response.data.choices[0].message) == null ? void 0 : _a.content;
  }
  async function sendMessage(options) {
    var _a, _b, _c, _d;
    const { onProgress, signal, ...requestBody } = options;
    const CHAT_COMPLETION_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
      method: "POST",
      body: requestBody,
      headers: {
        Authorization: `Bearer ${apiKey.value}`
      }
    };
    if (requestBody.stream) {
      requestOptions.responseType = "stream";
    }
    if (options.signal) {
      requestOptions.signal = signal;
    }
    const { data: response, error } = await handle($fetch(CHAT_COMPLETION_ENDPOINT, requestOptions));
    if (error) {
      const cause = ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a._data.error) ? (_b = error == null ? void 0 : error.response) == null ? void 0 : _b._data : JSON.parse(
        new TextDecoder().decode(
          (await ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c._data).getReader().read()).value
        )
      );
      throw new OpenAIError({ cause, message: "Failed to send message" });
    }
    const result = {
      role: "assistant",
      id: nanoid(),
      text: "",
      delta: void 0,
      detail: void 0,
      parentMessageId: ""
    };
    if (!requestBody.stream) {
      if (response.id) {
        result.id = response.id;
      }
      const message = response.choices[0].message;
      if (!message) {
        throw new Error("No message in response");
      }
      result.text = message.content;
      if (message.role) {
        result.role = message.role;
      }
      result.detail = response;
      console.log(result);
      return result;
    } else {
      for await (const data of streamOpenAIResponse(response)) {
        if (data.id) {
          result.id = data.id;
        }
        if ((_d = data == null ? void 0 : data.choices) == null ? void 0 : _d.length) {
          const delta = data.choices[0].delta;
          result.delta = delta.content;
          if (delta == null ? void 0 : delta.content) {
            result.text += delta.content;
          }
          result.detail = data;
          if (delta.role) {
            result.role = delta.role;
          }
        }
        if (onProgress) {
          await onProgress(result);
        }
      }
      return result;
    }
  }
  const checkIfAPIKeyIsValid = async (newApiKey) => {
    const res = await $fetch("https://api.openai.com/v1/engines", {
      headers: {
        Authorization: `Bearer ${newApiKey || apiKey.value}`
      }
    });
    if (res.status === 401) {
      throw new Error("Invalid API key");
    }
  };
  return { complete, sendMessage, checkIfAPIKeyIsValid };
}

export { handle as h, useLanguageModel as u };
//# sourceMappingURL=language-model-56d12d75.mjs.map
