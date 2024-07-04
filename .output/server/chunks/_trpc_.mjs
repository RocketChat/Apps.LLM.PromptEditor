import { resolveHTTPResponse } from '@trpc/server/http';
import { TRPCError, initTRPC } from '@trpc/server';
import { createURL } from 'ufo';
import { defineEventHandler, createError, isMethod, readBody } from 'h3';
import { z } from 'zod';
import { u as useRuntimeConfig } from './nitro/node-server.mjs';
import { encoding_for_model } from '@dqbd/tiktoken';
import { Deta } from 'deta';
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
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

// src/index.ts
function getPath(event) {
  const { params } = event.context;
  if (typeof params?.trpc === "string") {
    return params.trpc;
  }
  if (params?.trpc && Array.isArray(params.trpc)) {
    return params.trpc.join("/");
  }
  return null;
}
function createNuxtApiHandler({
  router,
  createContext,
  responseMeta,
  onError,
  batching
}) {
  return defineEventHandler(async (event) => {
    const {
      req,
      res
    } = event.node;
    const $url = createURL(req.url);
    const path = getPath(event);
    if (path === null) {
      const error = router.getErrorShape({
        error: new TRPCError({
          message: 'Param "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
          code: "INTERNAL_SERVER_ERROR"
        }),
        type: "unknown",
        ctx: void 0,
        path: void 0,
        input: void 0
      });
      throw createError({
        statusCode: 500,
        statusMessage: JSON.stringify(error)
      });
    }
    const httpResponse = await resolveHTTPResponse({
      batching,
      router,
      req: {
        method: req.method,
        headers: req.headers,
        body: isMethod(event, "GET") ? null : await readBody(event),
        query: $url.searchParams
      },
      path,
      createContext: async () => await createContext?.(event),
      responseMeta,
      onError: (o) => {
        onError?.({
          ...o,
          req
        });
      }
    });
    const { status, headers, body } = httpResponse;
    res.statusCode = status;
    headers && Object.keys(headers).forEach((key) => {
      res.setHeader(key, headers[key]);
    });
    return body;
  });
}

const t = initTRPC.context().create();
const publicProcedure = t.procedure;
const router = t.router;
t.middleware;

const authRouter = router({
  login: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const { password } = useRuntimeConfig();
    return input === password;
  })
});

const detaInfoRouter = router({
  isEnabled: publicProcedure.query(async () => {
    var _a;
    return Boolean((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.DETA_PROJECT_KEY);
  })
});

const conversationRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const { items } = await ctx.deta.conversations.fetch();
    return items;
  }),
  get: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const conversation = await ctx.deta.conversations.get(id);
    return conversation;
  }),
  create: publicProcedure.input(
    z.object({
      title: z.string(),
      id: z.string(),
      updatedAt: z.string().or(z.date()),
      createdAt: z.string().or(z.date())
    })
  ).mutation(async ({ ctx, input }) => {
    const { title, id, updatedAt, createdAt } = input;
    const conversation = await ctx.deta.conversations.insert({
      key: id,
      title,
      updatedAt,
      createdAt
    });
    return conversation;
  }),
  update: publicProcedure.input(
    z.object({
      title: z.string().optional(),
      id: z.string(),
      metadata: z.any().optional(),
      updatedAt: z.string().or(z.date()).optional(),
      createdAt: z.string().or(z.date()).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const { title, id, updatedAt, createdAt, metadata } = input;
    const patch = /* @__PURE__ */ new Map();
    if (title) {
      patch.set("title", title);
    }
    if (updatedAt) {
      patch.set("updatedAt", updatedAt);
    }
    if (createdAt) {
      patch.set("createdAt", createdAt);
    }
    if (metadata !== void 0) {
      patch.set("metadata", metadata);
    }
    const conversation = await ctx.deta.conversations.put({
      key: id,
      ...Object.fromEntries(patch)
    });
    return conversation;
  }),
  delete: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const conversation = await ctx.deta.conversations.delete(id);
    return conversation;
  })
});

function parseDateFields(obj, fields) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      result[key] = new Date(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

const messageRouter = router({
  list: publicProcedure.input(
    z.object({
      conversationId: z.string().optional()
    })
  ).query(async ({ ctx, input }) => {
    const query = {};
    if (input.conversationId) {
      query.conversationId = input.conversationId;
    }
    const { items } = await ctx.deta.messages.fetch(query);
    return items.map((item) => ({
      ...item,
      id: item.key
    }));
  }),
  get: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const conversation = await ctx.deta.messages.get(id);
    return parseDateFields(
      conversation,
      ["updatedAt", "createdAt"]
    );
  }),
  create: publicProcedure.input(
    z.object({
      id: z.string(),
      updatedAt: z.string().or(z.string().or(z.date())),
      createdAt: z.string().or(z.string().or(z.date())),
      conversationId: z.string().optional(),
      text: z.string(),
      role: z.string(),
      parentMessageId: z.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const { id, updatedAt, createdAt, conversationId, text, role, parentMessageId } = input;
    const message = await ctx.deta.messages.insert({
      key: id,
      conversationId,
      updatedAt,
      createdAt,
      text,
      role,
      parentMessageId
    });
    return message;
  }),
  update: publicProcedure.input(
    z.object({
      id: z.string(),
      updatedAt: z.string().or(z.date()).optional(),
      createdAt: z.string().or(z.date()).optional(),
      conversationId: z.string().optional(),
      text: z.string().optional(),
      metadata: z.any().optional(),
      role: z.any().optional(),
      parentMessageId: z.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const { updatedAt, createdAt } = input;
    const patch = /* @__PURE__ */ new Map();
    if (updatedAt) {
      patch.set("updatedAt", updatedAt);
    }
    if (createdAt) {
      patch.set("createdAt", createdAt);
    }
    for (const field of ["conversationId", "text", "role", "parentMessageId", "metadata"]) {
      if (input[field]) {
        patch.set(field, input[field]);
      }
    }
    const message = await ctx.deta.messages.put({
      key: input.id,
      ...Object.fromEntries(patch)
    });
    return message;
  }),
  delete: publicProcedure.input(
    z.object({
      id: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const { id } = input;
    const conversation = await ctx.deta.messages.delete(id);
    return conversation;
  })
});

const AvailablePreferences = [
  "api-key",
  "color"
];
const preferencesRouter = router({
  get: publicProcedure.input(
    z.enum(AvailablePreferences)
  ).query(async ({ ctx, input }) => {
    var _a;
    return (_a = await ctx.deta.preferences.get(input)) == null ? void 0 : _a.value;
  }),
  set: publicProcedure.input(
    z.object({
      key: z.enum(AvailablePreferences),
      value: z.string()
    })
  ).mutation(async ({ ctx, input }) => {
    await ctx.deta.preferences.put({
      key: input.key,
      value: input.value
    });
  })
});

const modelRouter = router({
  getTokenCount: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const encoding = encoding_for_model("gpt-3.5-turbo");
    return encoding.encode(input).length;
  })
});

const appRouter = router({
  deta: router({
    conversations: conversationRouter,
    messages: messageRouter,
    info: detaInfoRouter,
    preferences: preferencesRouter
  }),
  model: modelRouter,
  auth: authRouter
});

function getDetaBase(collection) {
  var _a;
  const detaKey = useRuntimeConfig().detaKey || ((_a = process.env) == null ? void 0 : _a.DETA_PROJECT_KEY);
  if (!detaKey) {
    return {};
  }
  const deta = Deta(detaKey);
  const db = deta.Base(collection);
  return db;
}

const createContext = () => ({
  deta: {
    conversations: getDetaBase("conversations"),
    messages: getDetaBase("messages"),
    preferences: getDetaBase("preferences")
  }
});

const _trpc_ = createNuxtApiHandler({
  router: appRouter,
  createContext
});

export { _trpc_ as default };
//# sourceMappingURL=_trpc_.mjs.map
