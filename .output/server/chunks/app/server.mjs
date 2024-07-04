import { version, toRef, isRef, getCurrentInstance, inject, ref, computed, shallowRef, nextTick, watch, unref, useSSRContext, watchEffect, readonly, defineComponent, mergeProps, withCtx, createVNode, createApp, reactive, getCurrentScope, onScopeDispose, onServerPrefetch, h as h$1, Suspense, Transition, provide, onErrorCaptured, isReadonly, defineAsyncComponent } from 'vue';
import { $fetch, FetchError } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { renderSSRHead } from '@unhead/ssr';
import { composableNames, getActiveHead, createServerHead as createServerHead$1 } from 'unhead';
import { HasElementTags, defineHeadPlugin } from '@unhead/shared';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter } from 'vue-router';
import { sendRedirect, createError as createError$1, appendHeader } from 'h3';
import { hasProtocol, parseURL, joinURL, isEqual as isEqual$1 } from 'ufo';
import destr from 'destr';
import { isEqual, hash } from 'ohash';
import { httpBatchLink as httpBatchLink$1, createTRPCProxyClient } from '@trpc/client';
import { createFlatProxy, createRecursiveProxy } from '@trpc/server/shared';
import consola from 'unenv/runtime/npm/consola';
import pLimit from 'p-limit';
import { parse, serialize } from 'cookie-es';
import FloatingVue from 'floating-vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense } from 'vue/server-renderer';
import { defu } from 'defu';
import { u as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.3.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      if (prop === "public") {
        return target.public;
      }
      return target[prop] ?? target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn2 = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn2);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const components = {};
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function resolveUnref$1(r2) {
  return typeof r2 === "function" ? r2() : unref(r2);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref$1(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r2) => resolveUnrefHeadInput(r2, lastKey));
  if (typeof root === "object") {
    let dynamic = false;
    const unrefdObj = Object.fromEntries(
      Object.entries(root).map(([k2, v2]) => {
        if (k2 === "titleTemplate" || k2.startsWith("on"))
          return [k2, unref(v2)];
        if (typeof v2 === "function" || isRef(v2))
          dynamic = true;
        return [k2, resolveUnrefHeadInput(v2, k2)];
      })
    );
    if (dynamic && HasElementTags.includes(String(lastKey)))
      unrefdObj._dynamic = true;
    return unrefdObj;
  }
  return root;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
const VueReactiveUseHeadPlugin = () => {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
};
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e2) => {
    entry2.patch(e2);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const appPageTransition = { "name": "page", "mode": "out-in" };
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }, { "name": "mobile-web-app-capable", "content": "yes", "key": "mobile-web-app-capable" }, { "name": "apple-mobile-web-app-title", "content": "Golem", "key": "apple-mobile-web-app-title" }, { "name": "author", "content": "Henrique Cunha", "key": "author" }, { "name": "description", "content": "Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.", "key": "description" }, { "name": "theme-color", "content": "#3f3f3f", "key": "theme-color" }, { "property": "og:type", "content": "website", "key": "og:type" }, { "property": "og:url", "content": "https://golem.chat/", "key": "og:url" }, { "property": "og:title", "content": "Golem", "key": "og:title" }, { "property": "og:site_name", "content": "app.golem.chat", "key": "og:site_name" }, { "property": "og:description", "content": "Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.", "key": "og:description" }, { "property": "og:image", "content": "https://golem.chat/og-image.png", "key": "og:image" }, { "name": "twitter:card", "content": "summary_large_image", "key": "twitter:card" }, { "name": "twitter:site", "content": "golem.chat", "key": "twitter:site" }, { "name": "twitter:creator", "content": "@henrycunh", "key": "twitter:creator" }], "link": [{ "rel": "icon", "href": "/_nuxt/icons/64x64.02df9a4b.png", "key": "favicon" }, { "rel": "apple-touch-icon", "href": "/_nuxt/icons/512x512.maskable.02df9a4b.png", "sizes": "512x512", "key": "favicon-apple" }, { "rel": "manifest", "href": "/manifest.json" }], "style": [], "script": [], "noscript": [], "title": "Golem", "htmlAttrs": { "lang": "en" } };
const appLayoutTransition = false;
const appKeepalive = false;
const unhead_9tcJ5oXlw4 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const createHead = createServerHead;
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const meta = await renderSSRHead(head);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        // resolves naming difference with NuxtMeta and Unhead
        bodyScripts: meta.bodyTags
      };
    };
  }
});
function polyfillAsVueUseHead(head) {
  const polyfilled = head;
  polyfilled.headTags = head.resolveTags;
  polyfilled.addEntry = head.push;
  polyfilled.addHeadObjs = head.push;
  polyfilled.addReactiveEntry = (input, options) => {
    const api = useHead(input, options);
    if (typeof api !== "undefined")
      return api.dispose;
    return () => {
    };
  };
  polyfilled.removeHeadObjs = () => {
  };
  polyfilled.updateDOM = () => {
    head.hooks.callHook("entries:updated", head);
  };
  polyfilled.unhead = head;
  return polyfilled;
}
const vueuse_head_polyfill_oWMPyXAnDP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  polyfillAsVueUseHead(nuxtApp.vueApp._context.provides.usehead);
});
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestHeaders(include) {
  var _a;
  const headers = ((_a = useNuxtApp().ssrContext) == null ? void 0 : _a.event.node.req.headers) ?? {};
  if (!include) {
    return headers;
  }
  return Object.fromEntries(include.map((key) => key.toLowerCase()).filter((key) => headers[key]).map((key) => [key, headers[key]]));
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function setResponseStatus(code, message) {
  const event = useRequestEvent();
  if (event) {
    event.node.res.statusCode = code;
    if (message) {
      event.node.res.statusMessage = message;
    }
  }
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      if (isProcessingMiddleware() && !isExternal) {
        setResponseStatus((options == null ? void 0 : options.redirectCode) || 302);
        return to;
      }
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options == null ? void 0 : options.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const __nuxt_page_meta$4 = {
  layout: "default"
};
const __nuxt_page_meta$3 = {
  layout: "blank"
};
const __nuxt_page_meta$2 = {
  layout: "default"
};
const __nuxt_page_meta$1 = {
  layout: "blank"
};
const __nuxt_page_meta = {
  layout: "blank"
};
const _routes = [
  {
    name: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) ?? "chat",
    path: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) ?? "/chat",
    meta: __nuxt_page_meta$4 || {},
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./_nuxt/index-549845a9.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) ?? "chat-share-conversationId",
    path: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) ?? "/chat/share/:conversationId",
    meta: __nuxt_page_meta$3 || {},
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./_nuxt/_conversationId_-470e1609.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "history",
    path: "/history",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/history-268a74db.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) ?? "index",
    path: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) ?? "/",
    meta: __nuxt_page_meta$2 || {},
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_nuxt/index-290fa08f.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "knowledge",
    path: "/knowledge",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/knowledge-7b2f31bb.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) ?? "password",
    path: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) ?? "/password",
    meta: __nuxt_page_meta$1 || {},
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_nuxt/password-c830067d.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "personas",
    path: "/personas",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/personas-ec1acf9b.mjs').then((m2) => m2.default || m2)
  },
  {
    path: "/settings",
    children: [
      {
        name: "settings-api-key",
        path: "api-key",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/api-key-efde0048.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "settings-appearance",
        path: "appearance",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/appearance-021583cf.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "settings-deta",
        path: "deta",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/deta-7861486a.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "settings",
        path: "",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/index-b39fa595.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "settings-model",
        path: "model",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/model-3c904e71.mjs').then((m2) => m2.default || m2)
      }
    ],
    name: void 0,
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/settings-b15dacd3.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) ?? "sk",
    path: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) ?? "/sk",
    meta: __nuxt_page_meta || {},
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./_nuxt/sk-e3ff7b64.mjs').then((m2) => m2.default || m2)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a2, b2) {
  const samePageComponent = a2.matched[0] === b2.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a2.params) !== JSON.stringify(b2.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useNuxtApp();
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const getDefault = () => null;
function useAsyncData(...args) {
  var _a;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  const nuxt = useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref(getCachedData() ?? ((_a = options.default) == null ? void 0 : _a.call(options)) ?? null),
      pending: ref(!hasCachedData()),
      error: ref(nuxt.payload._errors[key] ? createError(nuxt.payload._errors[key]) : null)
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((_result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      var _a2;
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref(((_a2 = options.default) == null ? void 0 : _a2.call(options)) ?? null);
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxt.hook("app:created", () => promise);
    }
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie = ref(cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:redirected", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.req.headers.cookie) || "", opts);
  }
}
function serializeCookie(name, value, opts = {}) {
  if (value === null || value === void 0) {
    return serialize(name, value, { ...opts, maxAge: -1 });
  }
  return serialize(name, value, opts);
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    appendHeader(event, "Set-Cookie", serializeCookie(name, value, opts));
  }
}
const isFunction = (val) => typeof val === "function";
const isNumber = (val) => typeof val === "number";
const isString = (val) => typeof val === "string";
const clamp = (n2, min, max) => Math.min(max, Math.max(min, n2));
const noop = () => {
};
function resolveUnref(r2) {
  return typeof r2 === "function" ? r2() : unref(r2);
}
function createFilterWrapper(filter, fn2) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke) => {
  return invoke();
};
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  const filter = (invoke) => {
    const duration = resolveUnref(ms);
    const maxDuration = resolveUnref(options.maxWait);
    if (timer)
      _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = null;
      }
      return Promise.resolve(invoke());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer);
          maxTimer = null;
          resolve(invoke());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer);
        maxTimer = null;
        resolve(invoke());
      }, duration);
    });
  };
  return filter;
}
function pausableFilter(extendFilter = bypassFilter) {
  const isActive = ref(true);
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args);
  };
  return { isActive: readonly(isActive), pause, resume, eventFilter };
}
function identity(arg) {
  return arg;
}
function increaseWithUnit(target, delta) {
  var _a;
  if (typeof target === "number")
    return target + delta;
  const value = ((_a = target.match(/^-?[0-9]+\.?[0-9]*/)) == null ? void 0 : _a[0]) || "";
  const unit = target.slice(value.length);
  const result = parseFloat(value) + delta;
  if (Number.isNaN(result))
    return target;
  return result + unit;
}
function tryOnScopeDispose(fn2) {
  if (getCurrentScope()) {
    onScopeDispose(fn2);
    return true;
  }
  return false;
}
function useDebounceFn(fn2, ms = 200, options = {}) {
  return createFilterWrapper(debounceFilter(ms, options), fn2);
}
function resolveRef(r2) {
  return typeof r2 === "function" ? computed(r2) : ref(r2);
}
function tryOnMounted(fn2, sync = true) {
  if (getCurrentInstance())
    ;
  else if (sync)
    fn2();
  else
    nextTick(fn2);
}
function useTimeoutFn(cb, interval, options = {}) {
  const {
    immediate = true
  } = options;
  const isPending = ref(false);
  let timer = null;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      cb(...args);
    }, resolveUnref(interval));
  }
  if (immediate) {
    isPending.value = true;
  }
  tryOnScopeDispose(stop);
  return {
    isPending: readonly(isPending),
    start,
    stop
  };
}
var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
var __objRest$5 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$6)
    for (var prop of __getOwnPropSymbols$6(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function watchWithFilter(source, cb, options = {}) {
  const _a = options, {
    eventFilter = bypassFilter
  } = _a, watchOptions = __objRest$5(_a, [
    "eventFilter"
  ]);
  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
var __defProp$2 = Object.defineProperty;
var __defProps$2 = Object.defineProperties;
var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp$2.call(b2, prop))
      __defNormalProp$2(a2, prop, b2[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b2)) {
      if (__propIsEnum$2.call(b2, prop))
        __defNormalProp$2(a2, prop, b2[prop]);
    }
  return a2;
};
var __spreadProps$2 = (a2, b2) => __defProps$2(a2, __getOwnPropDescs$2(b2));
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function watchPausable(source, cb, options = {}) {
  const _a = options, {
    eventFilter: filter
  } = _a, watchOptions = __objRest$1(_a, [
    "eventFilter"
  ]);
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
  const stop = watchWithFilter(source, cb, __spreadProps$2(__spreadValues$2({}, watchOptions), {
    eventFilter
  }));
  return { stop, pause, resume, isActive };
}
function unrefElement(elRef) {
  var _a;
  const plain = resolveUnref(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = void 0;
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (isString(args[0]) || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn2) => fn2());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
    cleanup();
    if (!el)
      return;
    cleanups.push(...events.flatMap((event) => {
      return listeners.map((listener) => register(el, event, listener, options2));
    }));
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return;
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e2) => {
      const el = unrefElement(target);
      if (el)
        shouldListen = !e2.composedPath().includes(el) && !shouldIgnore(e2);
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      var _a;
      const el = unrefElement(target);
      if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
        handler(event);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn2) => fn2());
  return stop;
}
const DEFAULT_DELAY = 500;
function onLongPress(target, handler, options) {
  var _a, _b;
  const elementRef = computed(() => unrefElement(target));
  let timeout;
  function clear() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
  }
  function onDown(ev) {
    var _a2, _b2, _c, _d;
    if (((_a2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _a2.self) && ev.target !== elementRef.value)
      return;
    clear();
    if ((_b2 = options == null ? void 0 : options.modifiers) == null ? void 0 : _b2.prevent)
      ev.preventDefault();
    if ((_c = options == null ? void 0 : options.modifiers) == null ? void 0 : _c.stop)
      ev.stopPropagation();
    timeout = setTimeout(() => handler(ev), (_d = options == null ? void 0 : options.delay) != null ? _d : DEFAULT_DELAY);
  }
  const listenerOptions = {
    capture: (_a = options == null ? void 0 : options.modifiers) == null ? void 0 : _a.capture,
    once: (_b = options == null ? void 0 : options.modifiers) == null ? void 0 : _b.once
  };
  useEventListener(elementRef, "pointerdown", onDown, listenerOptions);
  useEventListener(elementRef, "pointerup", clear, listenerOptions);
  useEventListener(elementRef, "pointerleave", clear, listenerOptions);
}
function useSupported(callback, sync = false) {
  const isSupported = ref();
  const update = () => isSupported.value = Boolean(callback());
  update();
  tryOnMounted(update, sync);
  return isSupported;
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && "undefined".matchMedia === "function");
  let mediaQuery;
  const matches = ref(false);
  const cleanup = () => {
    if (!mediaQuery)
      return;
    if ("removeEventListener" in mediaQuery)
      mediaQuery.removeEventListener("change", update);
    else
      mediaQuery.removeListener(update);
  };
  const update = () => {
    if (!isSupported.value)
      return;
    cleanup();
    mediaQuery = window2.matchMedia(resolveRef(query).value);
    matches.value = mediaQuery.matches;
    if ("addEventListener" in mediaQuery)
      mediaQuery.addEventListener("change", update);
    else
      mediaQuery.addListener(update);
  };
  watchEffect(update);
  tryOnScopeDispose(() => cleanup());
  return matches;
}
const breakpointsTailwind = {
  "sm": 640,
  "md": 768,
  "lg": 1024,
  "xl": 1280,
  "2xl": 1536
};
var __defProp$m = Object.defineProperty;
var __getOwnPropSymbols$o = Object.getOwnPropertySymbols;
var __hasOwnProp$o = Object.prototype.hasOwnProperty;
var __propIsEnum$o = Object.prototype.propertyIsEnumerable;
var __defNormalProp$m = (obj, key, value) => key in obj ? __defProp$m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$m = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp$o.call(b2, prop))
      __defNormalProp$m(a2, prop, b2[prop]);
  if (__getOwnPropSymbols$o)
    for (var prop of __getOwnPropSymbols$o(b2)) {
      if (__propIsEnum$o.call(b2, prop))
        __defNormalProp$m(a2, prop, b2[prop]);
    }
  return a2;
};
function useBreakpoints(breakpoints, options = {}) {
  function getValue(k2, delta) {
    let v2 = breakpoints[k2];
    if (delta != null)
      v2 = increaseWithUnit(v2, delta);
    if (typeof v2 === "number")
      v2 = `${v2}px`;
    return v2;
  }
  const { window: window2 = defaultWindow } = options;
  function match(query) {
    if (!window2)
      return false;
    return window2.matchMedia(query).matches;
  }
  const greaterOrEqual = (k2) => {
    return useMediaQuery(`(min-width: ${getValue(k2)})`, options);
  };
  const shortcutMethods = Object.keys(breakpoints).reduce((shortcuts, k2) => {
    Object.defineProperty(shortcuts, k2, {
      get: () => greaterOrEqual(k2),
      enumerable: true,
      configurable: true
    });
    return shortcuts;
  }, {});
  return __spreadValues$m({
    greater(k2) {
      return useMediaQuery(`(min-width: ${getValue(k2, 0.1)})`, options);
    },
    greaterOrEqual,
    smaller(k2) {
      return useMediaQuery(`(max-width: ${getValue(k2, -0.1)})`, options);
    },
    smallerOrEqual(k2) {
      return useMediaQuery(`(max-width: ${getValue(k2)})`, options);
    },
    between(a2, b2) {
      return useMediaQuery(`(min-width: ${getValue(a2)}) and (max-width: ${getValue(b2, -0.1)})`, options);
    },
    isGreater(k2) {
      return match(`(min-width: ${getValue(k2, 0.1)})`);
    },
    isGreaterOrEqual(k2) {
      return match(`(min-width: ${getValue(k2)})`);
    },
    isSmaller(k2) {
      return match(`(max-width: ${getValue(k2, -0.1)})`);
    },
    isSmallerOrEqual(k2) {
      return match(`(max-width: ${getValue(k2)})`);
    },
    isInBetween(a2, b2) {
      return match(`(min-width: ${getValue(a2)}) and (max-width: ${getValue(b2, -0.1)})`);
    }
  }, shortcutMethods);
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
const handlers = _global[globalKey];
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
var __defProp$k = Object.defineProperty;
var __getOwnPropSymbols$m = Object.getOwnPropertySymbols;
var __hasOwnProp$m = Object.prototype.hasOwnProperty;
var __propIsEnum$m = Object.prototype.propertyIsEnumerable;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$k = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp$m.call(b2, prop))
      __defNormalProp$k(a2, prop, b2[prop]);
  if (__getOwnPropSymbols$m)
    for (var prop of __getOwnPropSymbols$m(b2)) {
      if (__propIsEnum$m.call(b2, prop))
        __defNormalProp$k(a2, prop, b2[prop]);
    }
  return a2;
};
const StorageSerializers = {
  boolean: {
    read: (v2) => v2 === "true",
    write: (v2) => String(v2)
  },
  object: {
    read: (v2) => JSON.parse(v2),
    write: (v2) => JSON.stringify(v2)
  },
  number: {
    read: (v2) => Number.parseFloat(v2),
    write: (v2) => String(v2)
  },
  any: {
    read: (v2) => v2,
    write: (v2) => String(v2)
  },
  string: {
    read: (v2) => v2,
    write: (v2) => String(v2)
  },
  map: {
    read: (v2) => new Map(JSON.parse(v2)),
    write: (v2) => JSON.stringify(Array.from(v2.entries()))
  },
  set: {
    read: (v2) => new Set(JSON.parse(v2)),
    write: (v2) => JSON.stringify(Array.from(v2))
  },
  date: {
    read: (v2) => new Date(v2),
    write: (v2) => v2.toISOString()
  }
};
const customStorageEventName = "vueuse-storage";
function useStorage(key, defaults, storage, options = {}) {
  var _a;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e2) => {
      console.error(e2);
    }
  } = options;
  const data = (shallow ? shallowRef : ref)(defaults);
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e2) {
      onError(e2);
    }
  }
  if (!storage)
    return data;
  const rawInit = resolveUnref(defaults);
  const type = guessSerializerType(rawInit);
  const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, () => write(data.value), { flush, deep, eventFilter });
  if (window2 && listenToStorageChanges) {
    useEventListener(window2, "storage", update);
    useEventListener(window2, customStorageEventName, updateFromCustomEvent);
  }
  update();
  return data;
  function write(v2) {
    try {
      if (v2 == null) {
        storage.removeItem(key);
      } else {
        const serialized = serializer.write(v2);
        const oldValue = storage.getItem(key);
        if (oldValue !== serialized) {
          storage.setItem(key, serialized);
          if (window2) {
            window2.dispatchEvent(new CustomEvent(customStorageEventName, {
              detail: {
                key,
                oldValue,
                newValue: serialized,
                storageArea: storage
              }
            }));
          }
        }
      }
    } catch (e2) {
      onError(e2);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(key);
    if (rawValue == null) {
      if (writeDefaults && rawInit !== null)
        storage.setItem(key, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (isFunction(mergeDefaults))
        return mergeDefaults(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return __spreadValues$k(__spreadValues$k({}, rawInit), value);
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  function update(event) {
    if (event && event.storageArea !== storage)
      return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== key)
      return;
    pauseWatch();
    try {
      data.value = read(event);
    } catch (e2) {
      onError(e2);
    } finally {
      if (event)
        nextTick(resumeWatch);
      else
        resumeWatch();
    }
  }
}
function useRafFn(fn2, options = {}) {
  const {
    immediate = true,
    window: window2 = defaultWindow
  } = options;
  const isActive = ref(false);
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp) {
    if (!isActive.value || !window2)
      return;
    const delta = timestamp - previousFrameTimestamp;
    fn2({ delta, timestamp });
    previousFrameTimestamp = timestamp;
    rafId = window2.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window2) {
      isActive.value = true;
      rafId = window2.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window2) {
      window2.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate)
    resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume
  };
}
function useElementHover(el, options = {}) {
  const delayEnter = options ? options.delayEnter : 0;
  const delayLeave = options ? options.delayLeave : 0;
  const isHovered = ref(false);
  let timer;
  const toggle = (entering) => {
    const delay = entering ? delayEnter : delayLeave;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    if (delay)
      timer = setTimeout(() => isHovered.value = entering, delay);
    else
      isHovered.value = entering;
  };
  if (!window)
    return isHovered;
  useEventListener(el, "mouseenter", () => toggle(true), { passive: true });
  useEventListener(el, "mouseleave", () => toggle(false), { passive: true });
  return isHovered;
}
function useMouse(options = {}) {
  const {
    type = "page",
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    eventFilter
  } = options;
  const x2 = ref(initialValue.x);
  const y2 = ref(initialValue.y);
  const sourceType = ref(null);
  const mouseHandler = (event) => {
    if (type === "page") {
      x2.value = event.pageX;
      y2.value = event.pageY;
    } else if (type === "client") {
      x2.value = event.clientX;
      y2.value = event.clientY;
    } else if (type === "movement") {
      x2.value = event.movementX;
      y2.value = event.movementY;
    }
    sourceType.value = "mouse";
  };
  const reset = () => {
    x2.value = initialValue.x;
    y2.value = initialValue.y;
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const touch2 = event.touches[0];
      if (type === "page") {
        x2.value = touch2.pageX;
        y2.value = touch2.pageY;
      } else if (type === "client") {
        x2.value = touch2.clientX;
        y2.value = touch2.clientY;
      }
      sourceType.value = "touch";
    }
  };
  const mouseHandlerWrapper = (event) => {
    return eventFilter === void 0 ? mouseHandler(event) : eventFilter(() => mouseHandler(event), {});
  };
  const touchHandlerWrapper = (event) => {
    return eventFilter === void 0 ? touchHandler(event) : eventFilter(() => touchHandler(event), {});
  };
  if (window2) {
    useEventListener(window2, "mousemove", mouseHandlerWrapper, { passive: true });
    useEventListener(window2, "dragover", mouseHandlerWrapper, { passive: true });
    if (touch && type !== "movement") {
      useEventListener(window2, "touchstart", touchHandlerWrapper, { passive: true });
      useEventListener(window2, "touchmove", touchHandlerWrapper, { passive: true });
      if (resetOnTouchEnds)
        useEventListener(window2, "touchend", reset, { passive: true });
    }
  }
  return {
    x: x2,
    y: y2,
    sourceType
  };
}
function useMouseInElement(target, options = {}) {
  const {
    handleOutside = true,
    window: window2 = defaultWindow
  } = options;
  const { x: x2, y: y2, sourceType } = useMouse(options);
  const targetRef = ref(target != null ? target : window2 == null ? void 0 : window2.document.body);
  const elementX = ref(0);
  const elementY = ref(0);
  const elementPositionX = ref(0);
  const elementPositionY = ref(0);
  const elementHeight = ref(0);
  const elementWidth = ref(0);
  const isOutside = ref(true);
  let stop = () => {
  };
  if (window2) {
    stop = watch([targetRef, x2, y2], () => {
      const el = unrefElement(targetRef);
      if (!el)
        return;
      const {
        left,
        top,
        width,
        height
      } = el.getBoundingClientRect();
      elementPositionX.value = left + window2.pageXOffset;
      elementPositionY.value = top + window2.pageYOffset;
      elementHeight.value = height;
      elementWidth.value = width;
      const elX = x2.value - elementPositionX.value;
      const elY = y2.value - elementPositionY.value;
      isOutside.value = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;
      if (handleOutside || !isOutside.value) {
        elementX.value = elX;
        elementY.value = elY;
      }
    }, { immediate: true });
    useEventListener(document, "mouseleave", () => {
      isOutside.value = true;
    });
  }
  return {
    x: x2,
    y: y2,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop
  };
}
var SwipeDirection;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp2(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp2(a2, prop, b2[prop]);
    }
  return a2;
};
const _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
};
__spreadValues({
  linear: identity
}, _TransitionPresets);
function createEasingFunction([p0, p1, p2, p3]) {
  const a2 = (a1, a22) => 1 - 3 * a22 + 3 * a1;
  const b2 = (a1, a22) => 3 * a22 - 6 * a1;
  const c2 = (a1) => 3 * a1;
  const calcBezier = (t2, a1, a22) => ((a2(a1, a22) * t2 + b2(a1, a22)) * t2 + c2(a1)) * t2;
  const getSlope = (t2, a1, a22) => 3 * a2(a1, a22) * t2 * t2 + 2 * b2(a1, a22) * t2 + c2(a1);
  const getTforX = (x2) => {
    let aGuessT = x2;
    for (let i2 = 0; i2 < 4; ++i2) {
      const currentSlope = getSlope(aGuessT, p0, p2);
      if (currentSlope === 0)
        return aGuessT;
      const currentX = calcBezier(aGuessT, p0, p2) - x2;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  };
  return (x2) => p0 === p1 && p2 === p3 ? x2 : calcBezier(getTforX(x2), p1, p3);
}
function useTransition(source, options = {}) {
  const {
    delay = 0,
    disabled = false,
    duration = 1e3,
    onFinished = noop,
    onStarted = noop,
    transition = identity
  } = options;
  const currentTransition = computed(() => {
    const t2 = unref(transition);
    return isFunction(t2) ? t2 : createEasingFunction(t2);
  });
  const sourceValue = computed(() => {
    const s2 = unref(source);
    return isNumber(s2) ? s2 : s2.map(unref);
  });
  const sourceVector = computed(() => isNumber(sourceValue.value) ? [sourceValue.value] : sourceValue.value);
  const outputVector = ref(sourceVector.value.slice(0));
  let currentDuration;
  let diffVector;
  let endAt;
  let startAt;
  let startVector;
  const { resume, pause } = useRafFn(() => {
    const now = Date.now();
    const progress = clamp(1 - (endAt - now) / currentDuration, 0, 1);
    outputVector.value = startVector.map((val, i2) => {
      var _a;
      return val + ((_a = diffVector[i2]) != null ? _a : 0) * currentTransition.value(progress);
    });
    if (progress >= 1) {
      pause();
      onFinished();
    }
  }, { immediate: false });
  const start = () => {
    pause();
    currentDuration = unref(duration);
    diffVector = outputVector.value.map((n2, i2) => {
      var _a, _b;
      return ((_a = sourceVector.value[i2]) != null ? _a : 0) - ((_b = outputVector.value[i2]) != null ? _b : 0);
    });
    startVector = outputVector.value.slice(0);
    startAt = Date.now();
    endAt = startAt + currentDuration;
    resume();
    onStarted();
  };
  const timeout = useTimeoutFn(start, delay, { immediate: false });
  watch(sourceVector, () => {
    if (unref(disabled))
      return;
    if (unref(delay) <= 0)
      start();
    else
      timeout.start();
  }, { deep: true });
  watch(() => unref(disabled), (v2) => {
    if (v2) {
      outputVector.value = sourceVector.value.slice(0);
      pause();
    }
  });
  return computed(() => {
    const targetVector = unref(disabled) ? sourceVector : outputVector;
    return isNumber(sourceValue.value) ? targetVector.value[0] : targetVector.value;
  });
}
function useSettings() {
  const maxTokens = useStorage("golem-model-max-tokens", "1024");
  const modelUsed = useStorage("golem-model", "gpt-3.5-turbo");
  const instanceApiKey = useState("golem-instance-api-key", () => null);
  const apiKey = useStorage("golem-api-key", null);
  const isPasswordRequired = useState("golem-is-password-required", () => false);
  return {
    maxTokens,
    modelUsed,
    apiKey,
    instanceApiKey,
    isPasswordRequired
  };
}
function useSession() {
  const route = useRoute();
  const isLoggedIn = useState("is-logged-in", () => false);
  const isOnSharePage = computed(() => {
    return route.name === "chat-share-conversationId";
  });
  return {
    isOnSharePage,
    isLoggedIn
  };
}
const password_45global = /* @__PURE__ */ defineNuxtRouteMiddleware((from) => {
  const { isPasswordRequired } = useSettings();
  const { isLoggedIn } = useSession();
  if (from.path !== "/password" && (isPasswordRequired.value && !isLoggedIn.value)) {
    return navigateTo("/password");
  } else if (from.path === "/password" && (!isPasswordRequired.value || isLoggedIn.value)) {
    return navigateTo("/");
  }
});
const redirectMapping = {
  "/": "/chat",
  "/settings": "/settings/api-key"
};
const redirect_45global = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  if (to.path in redirectMapping) {
    return navigateTo(redirectMapping[to.path]);
  }
});
const globalMiddleware = [
  validate,
  password_45global,
  redirect_45global
];
const namedMiddleware = {};
const router_Horn1BEOMy = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
  const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c, _d;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    [__temp, __restore] = executeAsync(() => callWithNuxt(nuxtApp, showError, [error2])), await __temp, __restore();
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
      to.meta.layout = initialLayout.value;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a2 = namedMiddleware[entry2]) == null ? void 0 : _a2.call(namedMiddleware).then((r2) => r2.default || r2)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      await callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual$1(currentURL, initialURL, { trailingSlash: true })) {
        const event = await callWithNuxt(nuxtApp, useRequestEvent);
        const options = { redirectCode: event.node.res.statusCode !== 200 ? event.node.res.statusCode || 302 : 302 };
        await callWithNuxt(nuxtApp, navigateTo, [currentURL, options]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        // #4920, #$4982
        force: true
      });
    } catch (error2) {
      await callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const preference = "system";
const plugin_server_RWfeesXBQZ = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const unocss_MzCDxu9LMj = /* @__PURE__ */ defineNuxtPlugin(() => {
});
const e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : global, t = Object.keys, n = Array.isArray;
function r(e2, n2) {
  return "object" != typeof n2 || t(n2).forEach(function(t2) {
    e2[t2] = n2[t2];
  }), e2;
}
"undefined" == typeof Promise || e.Promise || (e.Promise = Promise);
const s = Object.getPrototypeOf, i = {}.hasOwnProperty;
function o(e2, t2) {
  return i.call(e2, t2);
}
function a(e2, n2) {
  "function" == typeof n2 && (n2 = n2(s(e2))), ("undefined" == typeof Reflect ? t : Reflect.ownKeys)(n2).forEach((t2) => {
    l(e2, t2, n2[t2]);
  });
}
const u = Object.defineProperty;
function l(e2, t2, n2, s2) {
  u(e2, t2, r(n2 && o(n2, "get") && "function" == typeof n2.get ? { get: n2.get, set: n2.set, configurable: true } : { value: n2, configurable: true, writable: true }, s2));
}
function c(e2) {
  return { from: function(t2) {
    return e2.prototype = Object.create(t2.prototype), l(e2.prototype, "constructor", e2), { extend: a.bind(null, e2.prototype) };
  } };
}
const h = Object.getOwnPropertyDescriptor;
function d(e2, t2) {
  let n2;
  return h(e2, t2) || (n2 = s(e2)) && d(n2, t2);
}
const f = [].slice;
function p(e2, t2, n2) {
  return f.call(e2, t2, n2);
}
function y(e2, t2) {
  return t2(e2);
}
function m(e2) {
  if (!e2)
    throw new Error("Assertion Failed");
}
function v(t2) {
  e.setImmediate ? setImmediate(t2) : setTimeout(t2, 0);
}
function g(e2, t2) {
  return e2.reduce((e3, n2, r2) => {
    var s2 = t2(n2, r2);
    return s2 && (e3[s2[0]] = s2[1]), e3;
  }, {});
}
function b(e2, t2) {
  if (o(e2, t2))
    return e2[t2];
  if (!t2)
    return e2;
  if ("string" != typeof t2) {
    for (var n2 = [], r2 = 0, s2 = t2.length; r2 < s2; ++r2) {
      var i2 = b(e2, t2[r2]);
      n2.push(i2);
    }
    return n2;
  }
  var a2 = t2.indexOf(".");
  if (-1 !== a2) {
    var u2 = e2[t2.substr(0, a2)];
    return void 0 === u2 ? void 0 : b(u2, t2.substr(a2 + 1));
  }
}
function _(e2, t2, r2) {
  if (e2 && void 0 !== t2 && (!("isFrozen" in Object) || !Object.isFrozen(e2)))
    if ("string" != typeof t2 && "length" in t2) {
      m("string" != typeof r2 && "length" in r2);
      for (var s2 = 0, i2 = t2.length; s2 < i2; ++s2)
        _(e2, t2[s2], r2[s2]);
    } else {
      var a2 = t2.indexOf(".");
      if (-1 !== a2) {
        var u2 = t2.substr(0, a2), l2 = t2.substr(a2 + 1);
        if ("" === l2)
          void 0 === r2 ? n(e2) && !isNaN(parseInt(u2)) ? e2.splice(u2, 1) : delete e2[u2] : e2[u2] = r2;
        else {
          var c2 = e2[u2];
          c2 && o(e2, u2) || (c2 = e2[u2] = {}), _(c2, l2, r2);
        }
      } else
        void 0 === r2 ? n(e2) && !isNaN(parseInt(t2)) ? e2.splice(t2, 1) : delete e2[t2] : e2[t2] = r2;
    }
}
function w(e2) {
  var t2 = {};
  for (var n2 in e2)
    o(e2, n2) && (t2[n2] = e2[n2]);
  return t2;
}
const x = [].concat;
function k(e2) {
  return x.apply([], e2);
}
const E = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(k([8, 16, 32, 64].map((e2) => ["Int", "Uint", "Float"].map((t2) => t2 + e2 + "Array")))).filter((t2) => e[t2]), P = E.map((t2) => e[t2]);
g(E, (e2) => [e2, true]);
let K = null;
function O(e2) {
  K = "undefined" != typeof WeakMap && /* @__PURE__ */ new WeakMap();
  const t2 = S(e2);
  return K = null, t2;
}
function S(e2) {
  if (!e2 || "object" != typeof e2)
    return e2;
  let t2 = K && K.get(e2);
  if (t2)
    return t2;
  if (n(e2)) {
    t2 = [], K && K.set(e2, t2);
    for (var r2 = 0, i2 = e2.length; r2 < i2; ++r2)
      t2.push(S(e2[r2]));
  } else if (P.indexOf(e2.constructor) >= 0)
    t2 = e2;
  else {
    const n2 = s(e2);
    for (var a2 in t2 = n2 === Object.prototype ? {} : Object.create(n2), K && K.set(e2, t2), e2)
      o(e2, a2) && (t2[a2] = S(e2[a2]));
  }
  return t2;
}
const { toString: A } = {};
function C(e2) {
  return A.call(e2).slice(8, -1);
}
const j = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator", D = "symbol" == typeof j ? function(e2) {
  var t2;
  return null != e2 && (t2 = e2[j]) && t2.apply(e2);
} : function() {
  return null;
}, I = {};
function B(e2) {
  var t2, r2, s2, i2;
  if (1 === arguments.length) {
    if (n(e2))
      return e2.slice();
    if (this === I && "string" == typeof e2)
      return [e2];
    if (i2 = D(e2)) {
      for (r2 = []; !(s2 = i2.next()).done; )
        r2.push(s2.value);
      return r2;
    }
    if (null == e2)
      return [e2];
    if ("number" == typeof (t2 = e2.length)) {
      for (r2 = new Array(t2); t2--; )
        r2[t2] = e2[t2];
      return r2;
    }
    return [e2];
  }
  for (t2 = arguments.length, r2 = new Array(t2); t2--; )
    r2[t2] = arguments[t2];
  return r2;
}
const T = "undefined" != typeof Symbol ? (e2) => "AsyncFunction" === e2[Symbol.toStringTag] : () => false;
var R = false;
function F(e2, t2) {
  R = e2, M = t2;
}
var M = () => true;
const N = !new Error("").stack;
function q() {
  if (N)
    try {
      throw q.arguments, new Error();
    } catch (e2) {
      return e2;
    }
  return new Error();
}
function $(e2, t2) {
  var n2 = e2.stack;
  return n2 ? (t2 = t2 || 0, 0 === n2.indexOf(e2.name) && (t2 += (e2.name + e2.message).split("\n").length), n2.split("\n").slice(t2).filter(M).map((e3) => "\n" + e3).join("")) : "";
}
var U = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], L = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(U), V = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
function W(e2, t2) {
  this._e = q(), this.name = e2, this.message = t2;
}
function Y(e2, t2) {
  return e2 + ". Errors: " + Object.keys(t2).map((e3) => t2[e3].toString()).filter((e3, t3, n2) => n2.indexOf(e3) === t3).join("\n");
}
function z(e2, t2, n2, r2) {
  this._e = q(), this.failures = t2, this.failedKeys = r2, this.successCount = n2, this.message = Y(e2, t2);
}
function G(e2, t2) {
  this._e = q(), this.name = "BulkError", this.failures = Object.keys(t2).map((e3) => t2[e3]), this.failuresByPos = t2, this.message = Y(e2, t2);
}
c(W).from(Error).extend({ stack: { get: function() {
  return this._stack || (this._stack = this.name + ": " + this.message + $(this._e, 2));
} }, toString: function() {
  return this.name + ": " + this.message;
} }), c(z).from(W), c(G).from(W);
var H = L.reduce((e2, t2) => (e2[t2] = t2 + "Error", e2), {});
const Q = W;
var X = L.reduce((e2, t2) => {
  var n2 = t2 + "Error";
  function r2(e3, r3) {
    this._e = q(), this.name = n2, e3 ? "string" == typeof e3 ? (this.message = `${e3}${r3 ? "\n " + r3 : ""}`, this.inner = r3 || null) : "object" == typeof e3 && (this.message = `${e3.name} ${e3.message}`, this.inner = e3) : (this.message = V[t2] || n2, this.inner = null);
  }
  return c(r2).from(Q), e2[t2] = r2, e2;
}, {});
X.Syntax = SyntaxError, X.Type = TypeError, X.Range = RangeError;
var J = U.reduce((e2, t2) => (e2[t2 + "Error"] = X[t2], e2), {});
var Z = L.reduce((e2, t2) => (-1 === ["Syntax", "Type", "Range"].indexOf(t2) && (e2[t2 + "Error"] = X[t2]), e2), {});
function ee() {
}
function te(e2) {
  return e2;
}
function ne(e2, t2) {
  return null == e2 || e2 === te ? t2 : function(n2) {
    return t2(e2(n2));
  };
}
function re(e2, t2) {
  return function() {
    e2.apply(this, arguments), t2.apply(this, arguments);
  };
}
function se(e2, t2) {
  return e2 === ee ? t2 : function() {
    var n2 = e2.apply(this, arguments);
    void 0 !== n2 && (arguments[0] = n2);
    var r2 = this.onsuccess, s2 = this.onerror;
    this.onsuccess = null, this.onerror = null;
    var i2 = t2.apply(this, arguments);
    return r2 && (this.onsuccess = this.onsuccess ? re(r2, this.onsuccess) : r2), s2 && (this.onerror = this.onerror ? re(s2, this.onerror) : s2), void 0 !== i2 ? i2 : n2;
  };
}
function ie(e2, t2) {
  return e2 === ee ? t2 : function() {
    e2.apply(this, arguments);
    var n2 = this.onsuccess, r2 = this.onerror;
    this.onsuccess = this.onerror = null, t2.apply(this, arguments), n2 && (this.onsuccess = this.onsuccess ? re(n2, this.onsuccess) : n2), r2 && (this.onerror = this.onerror ? re(r2, this.onerror) : r2);
  };
}
function oe(e2, t2) {
  return e2 === ee ? t2 : function(n2) {
    var s2 = e2.apply(this, arguments);
    r(n2, s2);
    var i2 = this.onsuccess, o2 = this.onerror;
    this.onsuccess = null, this.onerror = null;
    var a2 = t2.apply(this, arguments);
    return i2 && (this.onsuccess = this.onsuccess ? re(i2, this.onsuccess) : i2), o2 && (this.onerror = this.onerror ? re(o2, this.onerror) : o2), void 0 === s2 ? void 0 === a2 ? void 0 : a2 : r(s2, a2);
  };
}
function ae(e2, t2) {
  return e2 === ee ? t2 : function() {
    return false !== t2.apply(this, arguments) && e2.apply(this, arguments);
  };
}
function ue(e2, t2) {
  return e2 === ee ? t2 : function() {
    var n2 = e2.apply(this, arguments);
    if (n2 && "function" == typeof n2.then) {
      for (var r2 = this, s2 = arguments.length, i2 = new Array(s2); s2--; )
        i2[s2] = arguments[s2];
      return n2.then(function() {
        return t2.apply(r2, i2);
      });
    }
    return t2.apply(this, arguments);
  };
}
Z.ModifyError = z, Z.DexieError = W, Z.BulkError = G;
var le = {};
const [ce, he, de] = "undefined" == typeof Promise ? [] : (() => {
  let e2 = Promise.resolve();
  if ("undefined" == typeof crypto || !crypto.subtle)
    return [e2, s(e2), e2];
  const t2 = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [t2, s(t2), e2];
})(), fe = he && he.then, pe = ce && ce.constructor, ye = !!de;
var me = false, ve = de ? () => {
  de.then(qe);
} : e.setImmediate ? setImmediate.bind(null, qe) : e.MutationObserver ? () => {
  var e2 = document.createElement("div");
  new MutationObserver(() => {
    qe(), e2 = null;
  }).observe(e2, { attributes: true }), e2.setAttribute("i", "1");
} : () => {
  setTimeout(qe, 0);
}, ge = function(e2, t2) {
  Oe.push([e2, t2]), _e && (ve(), _e = false);
}, be = true, _e = true, we = [], xe = [], ke = null, Ee = te, Pe = { id: "global", global: true, ref: 0, unhandleds: [], onunhandled: ct, pgp: false, env: {}, finalize: function() {
  this.unhandleds.forEach((e2) => {
    try {
      ct(e2[0], e2[1]);
    } catch (e3) {
    }
  });
} }, Ke = Pe, Oe = [], Se = 0, Ae = [];
function Ce(e2) {
  if ("object" != typeof this)
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [], this.onuncatched = ee, this._lib = false;
  var t2 = this._PSD = Ke;
  if (R && (this._stackHolder = q(), this._prev = null, this._numPrev = 0), "function" != typeof e2) {
    if (e2 !== le)
      throw new TypeError("Not a function");
    return this._state = arguments[1], this._value = arguments[2], void (false === this._state && Be(this, this._value));
  }
  this._state = null, this._value = null, ++t2.ref, Ie(this, e2);
}
const je = { get: function() {
  var e2 = Ke, t2 = Qe;
  function n2(n3, r2) {
    var s2 = !e2.global && (e2 !== Ke || t2 !== Qe);
    const i2 = s2 && !et();
    var o2 = new Ce((t3, o3) => {
      Re(this, new De(ut(n3, e2, s2, i2), ut(r2, e2, s2, i2), t3, o3, e2));
    });
    return R && Ne(o2, this), o2;
  }
  return n2.prototype = le, n2;
}, set: function(e2) {
  l(this, "then", e2 && e2.prototype === le ? je : { get: function() {
    return e2;
  }, set: je.set });
} };
function De(e2, t2, n2, r2, s2) {
  this.onFulfilled = "function" == typeof e2 ? e2 : null, this.onRejected = "function" == typeof t2 ? t2 : null, this.resolve = n2, this.reject = r2, this.psd = s2;
}
function Ie(e2, t2) {
  try {
    t2((t3) => {
      if (null === e2._state) {
        if (t3 === e2)
          throw new TypeError("A promise cannot be resolved with itself.");
        var n2 = e2._lib && $e();
        t3 && "function" == typeof t3.then ? Ie(e2, (e3, n3) => {
          t3 instanceof Ce ? t3._then(e3, n3) : t3.then(e3, n3);
        }) : (e2._state = true, e2._value = t3, Te(e2)), n2 && Ue();
      }
    }, Be.bind(null, e2));
  } catch (t3) {
    Be(e2, t3);
  }
}
function Be(e2, t2) {
  if (xe.push(t2), null === e2._state) {
    var n2 = e2._lib && $e();
    t2 = Ee(t2), e2._state = false, e2._value = t2, R && null !== t2 && "object" == typeof t2 && !t2._promise && function(e3, t3, n3) {
      try {
        e3.apply(null, n3);
      } catch (e4) {
        t3 && t3(e4);
      }
    }(() => {
      var n3 = d(t2, "stack");
      t2._promise = e2, l(t2, "stack", { get: () => me ? n3 && (n3.get ? n3.get.apply(t2) : n3.value) : e2.stack });
    }), function(e3) {
      we.some((t3) => t3._value === e3._value) || we.push(e3);
    }(e2), Te(e2), n2 && Ue();
  }
}
function Te(e2) {
  var t2 = e2._listeners;
  e2._listeners = [];
  for (var n2 = 0, r2 = t2.length; n2 < r2; ++n2)
    Re(e2, t2[n2]);
  var s2 = e2._PSD;
  --s2.ref || s2.finalize(), 0 === Se && (++Se, ge(() => {
    0 == --Se && Le();
  }, []));
}
function Re(e2, t2) {
  if (null !== e2._state) {
    var n2 = e2._state ? t2.onFulfilled : t2.onRejected;
    if (null === n2)
      return (e2._state ? t2.resolve : t2.reject)(e2._value);
    ++t2.psd.ref, ++Se, ge(Fe, [n2, e2, t2]);
  } else
    e2._listeners.push(t2);
}
function Fe(e2, t2, n2) {
  try {
    ke = t2;
    var r2, s2 = t2._value;
    t2._state ? r2 = e2(s2) : (xe.length && (xe = []), r2 = e2(s2), -1 === xe.indexOf(s2) && function(e3) {
      var t3 = we.length;
      for (; t3; )
        if (we[--t3]._value === e3._value)
          return void we.splice(t3, 1);
    }(t2)), n2.resolve(r2);
  } catch (e3) {
    n2.reject(e3);
  } finally {
    ke = null, 0 == --Se && Le(), --n2.psd.ref || n2.psd.finalize();
  }
}
function Me(e2, t2, n2) {
  if (t2.length === n2)
    return t2;
  var r2 = "";
  if (false === e2._state) {
    var s2, i2, o2 = e2._value;
    null != o2 ? (s2 = o2.name || "Error", i2 = o2.message || o2, r2 = $(o2, 0)) : (s2 = o2, i2 = ""), t2.push(s2 + (i2 ? ": " + i2 : "") + r2);
  }
  return R && ((r2 = $(e2._stackHolder, 2)) && -1 === t2.indexOf(r2) && t2.push(r2), e2._prev && Me(e2._prev, t2, n2)), t2;
}
function Ne(e2, t2) {
  var n2 = t2 ? t2._numPrev + 1 : 0;
  n2 < 100 && (e2._prev = t2, e2._numPrev = n2);
}
function qe() {
  $e() && Ue();
}
function $e() {
  var e2 = be;
  return be = false, _e = false, e2;
}
function Ue() {
  var e2, t2, n2;
  do {
    for (; Oe.length > 0; )
      for (e2 = Oe, Oe = [], n2 = e2.length, t2 = 0; t2 < n2; ++t2) {
        var r2 = e2[t2];
        r2[0].apply(null, r2[1]);
      }
  } while (Oe.length > 0);
  be = true, _e = true;
}
function Le() {
  var e2 = we;
  we = [], e2.forEach((e3) => {
    e3._PSD.onunhandled.call(null, e3._value, e3);
  });
  for (var t2 = Ae.slice(0), n2 = t2.length; n2; )
    t2[--n2]();
}
function Ve(e2) {
  return new Ce(le, false, e2);
}
function We(e2, t2) {
  var n2 = Ke;
  return function() {
    var r2 = $e(), s2 = Ke;
    try {
      return st(n2, true), e2.apply(this, arguments);
    } catch (e3) {
      t2 && t2(e3);
    } finally {
      st(s2, false), r2 && Ue();
    }
  };
}
a(Ce.prototype, { then: je, _then: function(e2, t2) {
  Re(this, new De(null, null, e2, t2, Ke));
}, catch: function(e2) {
  if (1 === arguments.length)
    return this.then(null, e2);
  var t2 = arguments[0], n2 = arguments[1];
  return "function" == typeof t2 ? this.then(null, (e3) => e3 instanceof t2 ? n2(e3) : Ve(e3)) : this.then(null, (e3) => e3 && e3.name === t2 ? n2(e3) : Ve(e3));
}, finally: function(e2) {
  return this.then((t2) => (e2(), t2), (t2) => (e2(), Ve(t2)));
}, stack: { get: function() {
  if (this._stack)
    return this._stack;
  try {
    me = true;
    var e2 = Me(this, [], 20).join("\nFrom previous: ");
    return null !== this._state && (this._stack = e2), e2;
  } finally {
    me = false;
  }
} }, timeout: function(e2, t2) {
  return e2 < 1 / 0 ? new Ce((n2, r2) => {
    var s2 = setTimeout(() => r2(new X.Timeout(t2)), e2);
    this.then(n2, r2).finally(clearTimeout.bind(null, s2));
  }) : this;
} }), "undefined" != typeof Symbol && Symbol.toStringTag && l(Ce.prototype, Symbol.toStringTag, "Dexie.Promise"), Pe.env = it(), a(Ce, { all: function() {
  var e2 = B.apply(null, arguments).map(tt);
  return new Ce(function(t2, n2) {
    0 === e2.length && t2([]);
    var r2 = e2.length;
    e2.forEach((s2, i2) => Ce.resolve(s2).then((n3) => {
      e2[i2] = n3, --r2 || t2(e2);
    }, n2));
  });
}, resolve: (e2) => {
  if (e2 instanceof Ce)
    return e2;
  if (e2 && "function" == typeof e2.then)
    return new Ce((t3, n2) => {
      e2.then(t3, n2);
    });
  var t2 = new Ce(le, true, e2);
  return Ne(t2, ke), t2;
}, reject: Ve, race: function() {
  var e2 = B.apply(null, arguments).map(tt);
  return new Ce((t2, n2) => {
    e2.map((e3) => Ce.resolve(e3).then(t2, n2));
  });
}, PSD: { get: () => Ke, set: (e2) => Ke = e2 }, totalEchoes: { get: () => Qe }, newPSD: Je, usePSD: ot, scheduler: { get: () => ge, set: (e2) => {
  ge = e2;
} }, rejectionMapper: { get: () => Ee, set: (e2) => {
  Ee = e2;
} }, follow: (e2, t2) => new Ce((n2, r2) => Je((t3, n3) => {
  var r3 = Ke;
  r3.unhandleds = [], r3.onunhandled = n3, r3.finalize = re(function() {
    !function(e3) {
      function t4() {
        e3(), Ae.splice(Ae.indexOf(t4), 1);
      }
      Ae.push(t4), ++Se, ge(() => {
        0 == --Se && Le();
      }, []);
    }(() => {
      0 === this.unhandleds.length ? t3() : n3(this.unhandleds[0]);
    });
  }, r3.finalize), e2();
}, t2, n2, r2)) }), pe && (pe.allSettled && l(Ce, "allSettled", function() {
  const e2 = B.apply(null, arguments).map(tt);
  return new Ce((t2) => {
    0 === e2.length && t2([]);
    let n2 = e2.length;
    const r2 = new Array(n2);
    e2.forEach((e3, s2) => Ce.resolve(e3).then((e4) => r2[s2] = { status: "fulfilled", value: e4 }, (e4) => r2[s2] = { status: "rejected", reason: e4 }).then(() => --n2 || t2(r2)));
  });
}), pe.any && "undefined" != typeof AggregateError && l(Ce, "any", function() {
  const e2 = B.apply(null, arguments).map(tt);
  return new Ce((t2, n2) => {
    0 === e2.length && n2(new AggregateError([]));
    let r2 = e2.length;
    const s2 = new Array(r2);
    e2.forEach((e3, i2) => Ce.resolve(e3).then((e4) => t2(e4), (e4) => {
      s2[i2] = e4, --r2 || n2(new AggregateError(s2));
    }));
  });
}));
const Ye = { awaits: 0, echoes: 0, id: 0 };
var ze = 0, Ge = [], He = 0, Qe = 0, Xe = 0;
function Je(e2, t2, n2, s2) {
  var i2 = Ke, o2 = Object.create(i2);
  o2.parent = i2, o2.ref = 0, o2.global = false, o2.id = ++Xe;
  var a2 = Pe.env;
  o2.env = ye ? { Promise: Ce, PromiseProp: { value: Ce, configurable: true, writable: true }, all: Ce.all, race: Ce.race, allSettled: Ce.allSettled, any: Ce.any, resolve: Ce.resolve, reject: Ce.reject, nthen: lt(a2.nthen, o2), gthen: lt(a2.gthen, o2) } : {}, t2 && r(o2, t2), ++i2.ref, o2.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var u2 = ot(o2, e2, n2, s2);
  return 0 === o2.ref && o2.finalize(), u2;
}
function Ze() {
  return Ye.id || (Ye.id = ++ze), ++Ye.awaits, Ye.echoes += 100, Ye.id;
}
function et() {
  return !!Ye.awaits && (0 == --Ye.awaits && (Ye.id = 0), Ye.echoes = 100 * Ye.awaits, true);
}
function tt(e2) {
  return Ye.echoes && e2 && e2.constructor === pe ? (Ze(), e2.then((e3) => (et(), e3), (e3) => (et(), ht(e3)))) : e2;
}
function nt(e2) {
  ++Qe, Ye.echoes && 0 != --Ye.echoes || (Ye.echoes = Ye.id = 0), Ge.push(Ke), st(e2, true);
}
function rt() {
  var e2 = Ge[Ge.length - 1];
  Ge.pop(), st(e2, false);
}
function st(t2, n2) {
  var r2 = Ke;
  if ((n2 ? !Ye.echoes || He++ && t2 === Ke : !He || --He && t2 === Ke) || at(n2 ? nt.bind(null, t2) : rt), t2 !== Ke && (Ke = t2, r2 === Pe && (Pe.env = it()), ye)) {
    var s2 = Pe.env.Promise, i2 = t2.env;
    he.then = i2.nthen, s2.prototype.then = i2.gthen, (r2.global || t2.global) && (Object.defineProperty(e, "Promise", i2.PromiseProp), s2.all = i2.all, s2.race = i2.race, s2.resolve = i2.resolve, s2.reject = i2.reject, i2.allSettled && (s2.allSettled = i2.allSettled), i2.any && (s2.any = i2.any));
  }
}
function it() {
  var t2 = e.Promise;
  return ye ? { Promise: t2, PromiseProp: Object.getOwnPropertyDescriptor(e, "Promise"), all: t2.all, race: t2.race, allSettled: t2.allSettled, any: t2.any, resolve: t2.resolve, reject: t2.reject, nthen: he.then, gthen: t2.prototype.then } : {};
}
function ot(e2, t2, n2, r2, s2) {
  var i2 = Ke;
  try {
    return st(e2, true), t2(n2, r2, s2);
  } finally {
    st(i2, false);
  }
}
function at(e2) {
  fe.call(ce, e2);
}
function ut(e2, t2, n2, r2) {
  return "function" != typeof e2 ? e2 : function() {
    var s2 = Ke;
    n2 && Ze(), st(t2, true);
    try {
      return e2.apply(this, arguments);
    } finally {
      st(s2, false), r2 && at(et);
    }
  };
}
function lt(e2, t2) {
  return function(n2, r2) {
    return e2.call(this, ut(n2, t2), ut(r2, t2));
  };
}
-1 === ("" + fe).indexOf("[native code]") && (Ze = et = ee);
function ct(t2, n2) {
  var s2;
  try {
    s2 = n2.onuncatched(t2);
  } catch (e2) {
  }
  if (false !== s2)
    try {
      var i2, o2 = { promise: n2, reason: t2 };
      if (e.document && document.createEvent ? ((i2 = document.createEvent("Event")).initEvent("unhandledrejection", true, true), r(i2, o2)) : e.CustomEvent && r(i2 = new CustomEvent("unhandledrejection", { detail: o2 }), o2), i2 && e.dispatchEvent && (dispatchEvent(i2), !e.PromiseRejectionEvent && e.onunhandledrejection))
        try {
          e.onunhandledrejection(i2);
        } catch (e2) {
        }
      R && i2 && !i2.defaultPrevented && console.warn(`Unhandled rejection: ${t2.stack || t2}`);
    } catch (e2) {
    }
}
var ht = Ce.reject;
function dt(e2, t2, n2, r2) {
  if (e2.idbdb && (e2._state.openComplete || Ke.letThrough || e2._vip)) {
    var s2 = e2._createTransaction(t2, n2, e2._dbSchema);
    try {
      s2.create(), e2._state.PR1398_maxLoop = 3;
    } catch (s3) {
      return s3.name === H.InvalidState && e2.isOpen() && --e2._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"), e2._close(), e2.open().then(() => dt(e2, t2, n2, r2))) : ht(s3);
    }
    return s2._promise(t2, (e3, t3) => Je(() => (Ke.trans = s2, r2(e3, t3, s2)))).then((e3) => s2._completion.then(() => e3));
  }
  if (e2._state.openComplete)
    return ht(new X.DatabaseClosed(e2._state.dbOpenError));
  if (!e2._state.isBeingOpened) {
    if (!e2._options.autoOpen)
      return ht(new X.DatabaseClosed());
    e2.open().catch(ee);
  }
  return e2._state.dbReadyPromise.then(() => dt(e2, t2, n2, r2));
}
const ft = String.fromCharCode(65535), pt = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", yt = [], mt = false, vt = mt, gt = mt, bt = (e2) => !/(dexie\.js|dexie\.min\.js)/.test(e2);
function _t(e2, t2) {
  return e2 ? t2 ? function() {
    return e2.apply(this, arguments) && t2.apply(this, arguments);
  } : e2 : t2;
}
const wt = { type: 3, lower: -1 / 0, lowerOpen: false, upper: [[]], upperOpen: false };
function xt(e2) {
  return "string" != typeof e2 || /\./.test(e2) ? (e3) => e3 : (t2) => (void 0 === t2[e2] && e2 in t2 && delete (t2 = O(t2))[e2], t2);
}
class kt {
  _trans(e2, t2, n2) {
    const r2 = this._tx || Ke.trans, s2 = this.name;
    function i2(e3, n3, r3) {
      if (!r3.schema[s2])
        throw new X.NotFound("Table " + s2 + " not part of transaction");
      return t2(r3.idbtrans, r3);
    }
    const o2 = $e();
    try {
      return r2 && r2.db === this.db ? r2 === Ke.trans ? r2._promise(e2, i2, n2) : Je(() => r2._promise(e2, i2, n2), { trans: r2, transless: Ke.transless || Ke }) : dt(this.db, e2, [this.name], i2);
    } finally {
      o2 && Ue();
    }
  }
  get(e2, t2) {
    return e2 && e2.constructor === Object ? this.where(e2).first(t2) : this._trans("readonly", (t3) => this.core.get({ trans: t3, key: e2 }).then((e3) => this.hook.reading.fire(e3))).then(t2);
  }
  where(e2) {
    if ("string" == typeof e2)
      return new this.db.WhereClause(this, e2);
    if (n(e2))
      return new this.db.WhereClause(this, `[${e2.join("+")}]`);
    const r2 = t(e2);
    if (1 === r2.length)
      return this.where(r2[0]).equals(e2[r2[0]]);
    const s2 = this.schema.indexes.concat(this.schema.primKey).filter((e3) => e3.compound && r2.every((t2) => e3.keyPath.indexOf(t2) >= 0) && e3.keyPath.every((e4) => r2.indexOf(e4) >= 0))[0];
    if (s2 && this.db._maxKey !== ft)
      return this.where(s2.name).equals(s2.keyPath.map((t2) => e2[t2]));
    !s2 && R && console.warn(`The query ${JSON.stringify(e2)} on ${this.name} would benefit of a compound index [${r2.join("+")}]`);
    const { idxByName: i2 } = this.schema, o2 = this.db._deps.indexedDB;
    function a2(e3, t2) {
      try {
        return 0 === o2.cmp(e3, t2);
      } catch (e4) {
        return false;
      }
    }
    const [u2, l2] = r2.reduce(([t2, r3], s3) => {
      const o3 = i2[s3], u3 = e2[s3];
      return [t2 || o3, t2 || !o3 ? _t(r3, o3 && o3.multi ? (e3) => {
        const t3 = b(e3, s3);
        return n(t3) && t3.some((e4) => a2(u3, e4));
      } : (e3) => a2(u3, b(e3, s3))) : r3];
    }, [null, null]);
    return u2 ? this.where(u2.name).equals(e2[u2.keyPath]).filter(l2) : s2 ? this.filter(l2) : this.where(r2).equals("");
  }
  filter(e2) {
    return this.toCollection().and(e2);
  }
  count(e2) {
    return this.toCollection().count(e2);
  }
  offset(e2) {
    return this.toCollection().offset(e2);
  }
  limit(e2) {
    return this.toCollection().limit(e2);
  }
  each(e2) {
    return this.toCollection().each(e2);
  }
  toArray(e2) {
    return this.toCollection().toArray(e2);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(e2) {
    return new this.db.Collection(new this.db.WhereClause(this, n(e2) ? `[${e2.join("+")}]` : e2));
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(e2) {
    this.schema.mappedClass = e2;
    const t2 = (t3) => {
      if (!t3)
        return t3;
      const n2 = Object.create(e2.prototype);
      for (var r2 in t3)
        if (o(t3, r2))
          try {
            n2[r2] = t3[r2];
          } catch (e3) {
          }
      return n2;
    };
    return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = t2, this.hook("reading", t2), e2;
  }
  defineClass() {
    return this.mapToClass(function(e2) {
      r(this, e2);
    });
  }
  add(e2, t2) {
    const { auto: n2, keyPath: r2 } = this.schema.primKey;
    let s2 = e2;
    return r2 && n2 && (s2 = xt(r2)(e2)), this._trans("readwrite", (e3) => this.core.mutate({ trans: e3, type: "add", keys: null != t2 ? [t2] : null, values: [s2] })).then((e3) => e3.numFailures ? Ce.reject(e3.failures[0]) : e3.lastResult).then((t3) => {
      if (r2)
        try {
          _(e2, r2, t3);
        } catch (e3) {
        }
      return t3;
    });
  }
  update(e2, r2) {
    if ("object" != typeof e2 || n(e2))
      return this.where(":id").equals(e2).modify(r2);
    {
      const n2 = b(e2, this.schema.primKey.keyPath);
      if (void 0 === n2)
        return ht(new X.InvalidArgument("Given object does not contain its primary key"));
      try {
        "function" != typeof r2 ? t(r2).forEach((t2) => {
          _(e2, t2, r2[t2]);
        }) : r2(e2, { value: e2, primKey: n2 });
      } catch (e3) {
      }
      return this.where(":id").equals(n2).modify(r2);
    }
  }
  put(e2, t2) {
    const { auto: n2, keyPath: r2 } = this.schema.primKey;
    let s2 = e2;
    return r2 && n2 && (s2 = xt(r2)(e2)), this._trans("readwrite", (e3) => this.core.mutate({ trans: e3, type: "put", values: [s2], keys: null != t2 ? [t2] : null })).then((e3) => e3.numFailures ? Ce.reject(e3.failures[0]) : e3.lastResult).then((t3) => {
      if (r2)
        try {
          _(e2, r2, t3);
        } catch (e3) {
        }
      return t3;
    });
  }
  delete(e2) {
    return this._trans("readwrite", (t2) => this.core.mutate({ trans: t2, type: "delete", keys: [e2] })).then((e3) => e3.numFailures ? Ce.reject(e3.failures[0]) : void 0);
  }
  clear() {
    return this._trans("readwrite", (e2) => this.core.mutate({ trans: e2, type: "deleteRange", range: wt })).then((e2) => e2.numFailures ? Ce.reject(e2.failures[0]) : void 0);
  }
  bulkGet(e2) {
    return this._trans("readonly", (t2) => this.core.getMany({ keys: e2, trans: t2 }).then((e3) => e3.map((e4) => this.hook.reading.fire(e4))));
  }
  bulkAdd(e2, t2, n2) {
    const r2 = Array.isArray(t2) ? t2 : void 0, s2 = (n2 = n2 || (r2 ? void 0 : t2)) ? n2.allKeys : void 0;
    return this._trans("readwrite", (t3) => {
      const { auto: n3, keyPath: i2 } = this.schema.primKey;
      if (i2 && r2)
        throw new X.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (r2 && r2.length !== e2.length)
        throw new X.InvalidArgument("Arguments objects and keys must have the same length");
      const o2 = e2.length;
      let a2 = i2 && n3 ? e2.map(xt(i2)) : e2;
      return this.core.mutate({ trans: t3, type: "add", keys: r2, values: a2, wantResults: s2 }).then(({ numFailures: e3, results: t4, lastResult: n4, failures: r3 }) => {
        if (0 === e3)
          return s2 ? t4 : n4;
        throw new G(`${this.name}.bulkAdd(): ${e3} of ${o2} operations failed`, r3);
      });
    });
  }
  bulkPut(e2, t2, n2) {
    const r2 = Array.isArray(t2) ? t2 : void 0, s2 = (n2 = n2 || (r2 ? void 0 : t2)) ? n2.allKeys : void 0;
    return this._trans("readwrite", (t3) => {
      const { auto: n3, keyPath: i2 } = this.schema.primKey;
      if (i2 && r2)
        throw new X.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (r2 && r2.length !== e2.length)
        throw new X.InvalidArgument("Arguments objects and keys must have the same length");
      const o2 = e2.length;
      let a2 = i2 && n3 ? e2.map(xt(i2)) : e2;
      return this.core.mutate({ trans: t3, type: "put", keys: r2, values: a2, wantResults: s2 }).then(({ numFailures: e3, results: t4, lastResult: n4, failures: r3 }) => {
        if (0 === e3)
          return s2 ? t4 : n4;
        throw new G(`${this.name}.bulkPut(): ${e3} of ${o2} operations failed`, r3);
      });
    });
  }
  bulkDelete(e2) {
    const t2 = e2.length;
    return this._trans("readwrite", (t3) => this.core.mutate({ trans: t3, type: "delete", keys: e2 })).then(({ numFailures: e3, lastResult: n2, failures: r2 }) => {
      if (0 === e3)
        return n2;
      throw new G(`${this.name}.bulkDelete(): ${e3} of ${t2} operations failed`, r2);
    });
  }
}
function Et(e2) {
  var r2 = {}, s2 = function(t2, n2) {
    if (n2) {
      for (var s3 = arguments.length, i3 = new Array(s3 - 1); --s3; )
        i3[s3 - 1] = arguments[s3];
      return r2[t2].subscribe.apply(null, i3), e2;
    }
    if ("string" == typeof t2)
      return r2[t2];
  };
  s2.addEventType = a2;
  for (var i2 = 1, o2 = arguments.length; i2 < o2; ++i2)
    a2(arguments[i2]);
  return s2;
  function a2(e3, t2, n2) {
    if ("object" == typeof e3)
      return u2(e3);
    t2 || (t2 = ae), n2 || (n2 = ee);
    var i3 = { subscribers: [], fire: n2, subscribe: function(e4) {
      -1 === i3.subscribers.indexOf(e4) && (i3.subscribers.push(e4), i3.fire = t2(i3.fire, e4));
    }, unsubscribe: function(e4) {
      i3.subscribers = i3.subscribers.filter(function(t3) {
        return t3 !== e4;
      }), i3.fire = i3.subscribers.reduce(t2, n2);
    } };
    return r2[e3] = s2[e3] = i3, i3;
  }
  function u2(e3) {
    t(e3).forEach(function(t2) {
      var r3 = e3[t2];
      if (n(r3))
        a2(t2, e3[t2][0], e3[t2][1]);
      else {
        if ("asap" !== r3)
          throw new X.InvalidArgument("Invalid event config");
        var s3 = a2(t2, te, function() {
          for (var e4 = arguments.length, t3 = new Array(e4); e4--; )
            t3[e4] = arguments[e4];
          s3.subscribers.forEach(function(e5) {
            v(function() {
              e5.apply(null, t3);
            });
          });
        });
      }
    });
  }
}
function Pt(e2, t2) {
  return c(t2).from({ prototype: e2 }), t2;
}
function Kt(e2, t2) {
  return !(e2.filter || e2.algorithm || e2.or) && (t2 ? e2.justLimit : !e2.replayFilter);
}
function Ot(e2, t2) {
  e2.filter = _t(e2.filter, t2);
}
function St(e2, t2, n2) {
  var r2 = e2.replayFilter;
  e2.replayFilter = r2 ? () => _t(r2(), t2()) : t2, e2.justLimit = n2 && !r2;
}
function At(e2, t2) {
  if (e2.isPrimKey)
    return t2.primaryKey;
  const n2 = t2.getIndexByKeyPath(e2.index);
  if (!n2)
    throw new X.Schema("KeyPath " + e2.index + " on object store " + t2.name + " is not indexed");
  return n2;
}
function Ct(e2, t2, n2) {
  const r2 = At(e2, t2.schema);
  return t2.openCursor({ trans: n2, values: !e2.keysOnly, reverse: "prev" === e2.dir, unique: !!e2.unique, query: { index: r2, range: e2.range } });
}
function jt(e2, t2, n2, r2) {
  const s2 = e2.replayFilter ? _t(e2.filter, e2.replayFilter()) : e2.filter;
  if (e2.or) {
    const i2 = {}, a2 = (e3, n3, r3) => {
      if (!s2 || s2(n3, r3, (e4) => n3.stop(e4), (e4) => n3.fail(e4))) {
        var a3 = n3.primaryKey, u2 = "" + a3;
        "[object ArrayBuffer]" === u2 && (u2 = "" + new Uint8Array(a3)), o(i2, u2) || (i2[u2] = true, t2(e3, n3, r3));
      }
    };
    return Promise.all([e2.or._iterate(a2, n2), Dt(Ct(e2, r2, n2), e2.algorithm, a2, !e2.keysOnly && e2.valueMapper)]);
  }
  return Dt(Ct(e2, r2, n2), _t(e2.algorithm, s2), t2, !e2.keysOnly && e2.valueMapper);
}
function Dt(e2, t2, n2, r2) {
  var s2 = We(r2 ? (e3, t3, s3) => n2(r2(e3), t3, s3) : n2);
  return e2.then((e3) => {
    if (e3)
      return e3.start(() => {
        var n3 = () => e3.continue();
        t2 && !t2(e3, (e4) => n3 = e4, (t3) => {
          e3.stop(t3), n3 = ee;
        }, (t3) => {
          e3.fail(t3), n3 = ee;
        }) || s2(e3.value, e3, (e4) => n3 = e4), n3();
      });
  });
}
function It(e2, t2) {
  try {
    const n2 = Bt(e2), r2 = Bt(t2);
    if (n2 !== r2)
      return "Array" === n2 ? 1 : "Array" === r2 ? -1 : "binary" === n2 ? 1 : "binary" === r2 ? -1 : "string" === n2 ? 1 : "string" === r2 ? -1 : "Date" === n2 ? 1 : "Date" !== r2 ? NaN : -1;
    switch (n2) {
      case "number":
      case "Date":
      case "string":
        return e2 > t2 ? 1 : e2 < t2 ? -1 : 0;
      case "binary":
        return function(e3, t3) {
          const n3 = e3.length, r3 = t3.length, s2 = n3 < r3 ? n3 : r3;
          for (let n4 = 0; n4 < s2; ++n4)
            if (e3[n4] !== t3[n4])
              return e3[n4] < t3[n4] ? -1 : 1;
          return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
        }(Tt(e2), Tt(t2));
      case "Array":
        return function(e3, t3) {
          const n3 = e3.length, r3 = t3.length, s2 = n3 < r3 ? n3 : r3;
          for (let n4 = 0; n4 < s2; ++n4) {
            const r4 = It(e3[n4], t3[n4]);
            if (0 !== r4)
              return r4;
          }
          return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
        }(e2, t2);
    }
  } catch (e3) {
  }
  return NaN;
}
function Bt(e2) {
  const t2 = typeof e2;
  if ("object" !== t2)
    return t2;
  if (ArrayBuffer.isView(e2))
    return "binary";
  const n2 = C(e2);
  return "ArrayBuffer" === n2 ? "binary" : n2;
}
function Tt(e2) {
  return e2 instanceof Uint8Array ? e2 : ArrayBuffer.isView(e2) ? new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength) : new Uint8Array(e2);
}
class Rt {
  _read(e2, t2) {
    var n2 = this._ctx;
    return n2.error ? n2.table._trans(null, ht.bind(null, n2.error)) : n2.table._trans("readonly", e2).then(t2);
  }
  _write(e2) {
    var t2 = this._ctx;
    return t2.error ? t2.table._trans(null, ht.bind(null, t2.error)) : t2.table._trans("readwrite", e2, "locked");
  }
  _addAlgorithm(e2) {
    var t2 = this._ctx;
    t2.algorithm = _t(t2.algorithm, e2);
  }
  _iterate(e2, t2) {
    return jt(this._ctx, e2, t2, this._ctx.table.core);
  }
  clone(e2) {
    var t2 = Object.create(this.constructor.prototype), n2 = Object.create(this._ctx);
    return e2 && r(n2, e2), t2._ctx = n2, t2;
  }
  raw() {
    return this._ctx.valueMapper = null, this;
  }
  each(e2) {
    var t2 = this._ctx;
    return this._read((n2) => jt(t2, e2, n2, t2.table.core));
  }
  count(e2) {
    return this._read((e3) => {
      const t2 = this._ctx, n2 = t2.table.core;
      if (Kt(t2, true))
        return n2.count({ trans: e3, query: { index: At(t2, n2.schema), range: t2.range } }).then((e4) => Math.min(e4, t2.limit));
      var r2 = 0;
      return jt(t2, () => (++r2, false), e3, n2).then(() => r2);
    }).then(e2);
  }
  sortBy(e2, t2) {
    const n2 = e2.split(".").reverse(), r2 = n2[0], s2 = n2.length - 1;
    function i2(e3, t3) {
      return t3 ? i2(e3[n2[t3]], t3 - 1) : e3[r2];
    }
    var o2 = "next" === this._ctx.dir ? 1 : -1;
    function a2(e3, t3) {
      var n3 = i2(e3, s2), r3 = i2(t3, s2);
      return n3 < r3 ? -o2 : n3 > r3 ? o2 : 0;
    }
    return this.toArray(function(e3) {
      return e3.sort(a2);
    }).then(t2);
  }
  toArray(e2) {
    return this._read((e3) => {
      var t2 = this._ctx;
      if ("next" === t2.dir && Kt(t2, true) && t2.limit > 0) {
        const { valueMapper: n2 } = t2, r2 = At(t2, t2.table.core.schema);
        return t2.table.core.query({ trans: e3, limit: t2.limit, values: true, query: { index: r2, range: t2.range } }).then(({ result: e4 }) => n2 ? e4.map(n2) : e4);
      }
      {
        const n2 = [];
        return jt(t2, (e4) => n2.push(e4), e3, t2.table.core).then(() => n2);
      }
    }, e2);
  }
  offset(e2) {
    var t2 = this._ctx;
    return e2 <= 0 || (t2.offset += e2, Kt(t2) ? St(t2, () => {
      var t3 = e2;
      return (e3, n2) => 0 === t3 || (1 === t3 ? (--t3, false) : (n2(() => {
        e3.advance(t3), t3 = 0;
      }), false));
    }) : St(t2, () => {
      var t3 = e2;
      return () => --t3 < 0;
    })), this;
  }
  limit(e2) {
    return this._ctx.limit = Math.min(this._ctx.limit, e2), St(this._ctx, () => {
      var t2 = e2;
      return function(e3, n2, r2) {
        return --t2 <= 0 && n2(r2), t2 >= 0;
      };
    }, true), this;
  }
  until(e2, t2) {
    return Ot(this._ctx, function(n2, r2, s2) {
      return !e2(n2.value) || (r2(s2), t2);
    }), this;
  }
  first(e2) {
    return this.limit(1).toArray(function(e3) {
      return e3[0];
    }).then(e2);
  }
  last(e2) {
    return this.reverse().first(e2);
  }
  filter(e2) {
    var t2, n2;
    return Ot(this._ctx, function(t3) {
      return e2(t3.value);
    }), t2 = this._ctx, n2 = e2, t2.isMatch = _t(t2.isMatch, n2), this;
  }
  and(e2) {
    return this.filter(e2);
  }
  or(e2) {
    return new this.db.WhereClause(this._ctx.table, e2, this);
  }
  reverse() {
    return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(e2) {
    var t2 = this._ctx;
    return t2.keysOnly = !t2.isMatch, this.each(function(t3, n2) {
      e2(n2.key, n2);
    });
  }
  eachUniqueKey(e2) {
    return this._ctx.unique = "unique", this.eachKey(e2);
  }
  eachPrimaryKey(e2) {
    var t2 = this._ctx;
    return t2.keysOnly = !t2.isMatch, this.each(function(t3, n2) {
      e2(n2.primaryKey, n2);
    });
  }
  keys(e2) {
    var t2 = this._ctx;
    t2.keysOnly = !t2.isMatch;
    var n2 = [];
    return this.each(function(e3, t3) {
      n2.push(t3.key);
    }).then(function() {
      return n2;
    }).then(e2);
  }
  primaryKeys(e2) {
    var t2 = this._ctx;
    if ("next" === t2.dir && Kt(t2, true) && t2.limit > 0)
      return this._read((e3) => {
        var n3 = At(t2, t2.table.core.schema);
        return t2.table.core.query({ trans: e3, values: false, limit: t2.limit, query: { index: n3, range: t2.range } });
      }).then(({ result: e3 }) => e3).then(e2);
    t2.keysOnly = !t2.isMatch;
    var n2 = [];
    return this.each(function(e3, t3) {
      n2.push(t3.primaryKey);
    }).then(function() {
      return n2;
    }).then(e2);
  }
  uniqueKeys(e2) {
    return this._ctx.unique = "unique", this.keys(e2);
  }
  firstKey(e2) {
    return this.limit(1).keys(function(e3) {
      return e3[0];
    }).then(e2);
  }
  lastKey(e2) {
    return this.reverse().firstKey(e2);
  }
  distinct() {
    var e2 = this._ctx, t2 = e2.index && e2.table.schema.idxByName[e2.index];
    if (!t2 || !t2.multi)
      return this;
    var n2 = {};
    return Ot(this._ctx, function(e3) {
      var t3 = e3.primaryKey.toString(), r2 = o(n2, t3);
      return n2[t3] = true, !r2;
    }), this;
  }
  modify(e2) {
    var n2 = this._ctx;
    return this._write((r2) => {
      var s2;
      if ("function" == typeof e2)
        s2 = e2;
      else {
        var i2 = t(e2), o2 = i2.length;
        s2 = function(t2) {
          for (var n3 = false, r3 = 0; r3 < o2; ++r3) {
            var s3 = i2[r3], a3 = e2[s3];
            b(t2, s3) !== a3 && (_(t2, s3, a3), n3 = true);
          }
          return n3;
        };
      }
      const a2 = n2.table.core, { outbound: u2, extractKey: l2 } = a2.schema.primaryKey, c2 = this.db._options.modifyChunkSize || 200, h2 = [];
      let d2 = 0;
      const f2 = [], p2 = (e3, n3) => {
        const { failures: r3, numFailures: s3 } = n3;
        d2 += e3 - s3;
        for (let e4 of t(r3))
          h2.push(r3[e4]);
      };
      return this.clone().primaryKeys().then((t2) => {
        const i3 = (o3) => {
          const h3 = Math.min(c2, t2.length - o3);
          return a2.getMany({ trans: r2, keys: t2.slice(o3, o3 + h3), cache: "immutable" }).then((d3) => {
            const f3 = [], y2 = [], m2 = u2 ? [] : null, v2 = [];
            for (let e3 = 0; e3 < h3; ++e3) {
              const n3 = d3[e3], r3 = { value: O(n3), primKey: t2[o3 + e3] };
              false !== s2.call(r3, r3.value, r3) && (null == r3.value ? v2.push(t2[o3 + e3]) : u2 || 0 === It(l2(n3), l2(r3.value)) ? (y2.push(r3.value), u2 && m2.push(t2[o3 + e3])) : (v2.push(t2[o3 + e3]), f3.push(r3.value)));
            }
            const g2 = Kt(n2) && n2.limit === 1 / 0 && ("function" != typeof e2 || e2 === Ft) && { index: n2.index, range: n2.range };
            return Promise.resolve(f3.length > 0 && a2.mutate({ trans: r2, type: "add", values: f3 }).then((e3) => {
              for (let t3 in e3.failures)
                v2.splice(parseInt(t3), 1);
              p2(f3.length, e3);
            })).then(() => (y2.length > 0 || g2 && "object" == typeof e2) && a2.mutate({ trans: r2, type: "put", keys: m2, values: y2, criteria: g2, changeSpec: "function" != typeof e2 && e2 }).then((e3) => p2(y2.length, e3))).then(() => (v2.length > 0 || g2 && e2 === Ft) && a2.mutate({ trans: r2, type: "delete", keys: v2, criteria: g2 }).then((e3) => p2(v2.length, e3))).then(() => t2.length > o3 + h3 && i3(o3 + c2));
          });
        };
        return i3(0).then(() => {
          if (h2.length > 0)
            throw new z("Error modifying one or more objects", h2, d2, f2);
          return t2.length;
        });
      });
    });
  }
  delete() {
    var e2 = this._ctx, t2 = e2.range;
    return Kt(e2) && (e2.isPrimKey && !gt || 3 === t2.type) ? this._write((n2) => {
      const { primaryKey: r2 } = e2.table.core.schema, s2 = t2;
      return e2.table.core.count({ trans: n2, query: { index: r2, range: s2 } }).then((t3) => e2.table.core.mutate({ trans: n2, type: "deleteRange", range: s2 }).then(({ failures: e3, lastResult: n3, results: r3, numFailures: s3 }) => {
        if (s3)
          throw new z("Could not delete some values", Object.keys(e3).map((t4) => e3[t4]), t3 - s3);
        return t3 - s3;
      }));
    }) : this.modify(Ft);
  }
}
const Ft = (e2, t2) => t2.value = null;
function Mt(e2, t2) {
  return e2 < t2 ? -1 : e2 === t2 ? 0 : 1;
}
function Nt(e2, t2) {
  return e2 > t2 ? -1 : e2 === t2 ? 0 : 1;
}
function qt(e2, t2, n2) {
  var r2 = e2 instanceof Yt ? new e2.Collection(e2) : e2;
  return r2._ctx.error = n2 ? new n2(t2) : new TypeError(t2), r2;
}
function $t(e2) {
  return new e2.Collection(e2, () => Wt("")).limit(0);
}
function Ut(e2, t2, n2, r2, s2, i2) {
  for (var o2 = Math.min(e2.length, r2.length), a2 = -1, u2 = 0; u2 < o2; ++u2) {
    var l2 = t2[u2];
    if (l2 !== r2[u2])
      return s2(e2[u2], n2[u2]) < 0 ? e2.substr(0, u2) + n2[u2] + n2.substr(u2 + 1) : s2(e2[u2], r2[u2]) < 0 ? e2.substr(0, u2) + r2[u2] + n2.substr(u2 + 1) : a2 >= 0 ? e2.substr(0, a2) + t2[a2] + n2.substr(a2 + 1) : null;
    s2(e2[u2], l2) < 0 && (a2 = u2);
  }
  return o2 < r2.length && "next" === i2 ? e2 + n2.substr(e2.length) : o2 < e2.length && "prev" === i2 ? e2.substr(0, n2.length) : a2 < 0 ? null : e2.substr(0, a2) + r2[a2] + n2.substr(a2 + 1);
}
function Lt(e2, t2, n2, r2) {
  var s2, i2, o2, a2, u2, l2, c2, h2 = n2.length;
  if (!n2.every((e3) => "string" == typeof e3))
    return qt(e2, "String expected.");
  function d2(e3) {
    s2 = function(e4) {
      return "next" === e4 ? (e5) => e5.toUpperCase() : (e5) => e5.toLowerCase();
    }(e3), i2 = function(e4) {
      return "next" === e4 ? (e5) => e5.toLowerCase() : (e5) => e5.toUpperCase();
    }(e3), o2 = "next" === e3 ? Mt : Nt;
    var t3 = n2.map(function(e4) {
      return { lower: i2(e4), upper: s2(e4) };
    }).sort(function(e4, t4) {
      return o2(e4.lower, t4.lower);
    });
    a2 = t3.map(function(e4) {
      return e4.upper;
    }), u2 = t3.map(function(e4) {
      return e4.lower;
    }), l2 = e3, c2 = "next" === e3 ? "" : r2;
  }
  d2("next");
  var f2 = new e2.Collection(e2, () => Vt(a2[0], u2[h2 - 1] + r2));
  f2._ondirectionchange = function(e3) {
    d2(e3);
  };
  var p2 = 0;
  return f2._addAlgorithm(function(e3, n3, r3) {
    var s3 = e3.key;
    if ("string" != typeof s3)
      return false;
    var d3 = i2(s3);
    if (t2(d3, u2, p2))
      return true;
    for (var f3 = null, y2 = p2; y2 < h2; ++y2) {
      var m2 = Ut(s3, d3, a2[y2], u2[y2], o2, l2);
      null === m2 && null === f3 ? p2 = y2 + 1 : (null === f3 || o2(f3, m2) > 0) && (f3 = m2);
    }
    return n3(null !== f3 ? function() {
      e3.continue(f3 + c2);
    } : r3), false;
  }), f2;
}
function Vt(e2, t2, n2, r2) {
  return { type: 2, lower: e2, upper: t2, lowerOpen: n2, upperOpen: r2 };
}
function Wt(e2) {
  return { type: 1, lower: e2, upper: e2 };
}
class Yt {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(e2, t2, n2, r2) {
    n2 = false !== n2, r2 = true === r2;
    try {
      return this._cmp(e2, t2) > 0 || 0 === this._cmp(e2, t2) && (n2 || r2) && (!n2 || !r2) ? $t(this) : new this.Collection(this, () => Vt(e2, t2, !n2, !r2));
    } catch (e3) {
      return qt(this, pt);
    }
  }
  equals(e2) {
    return null == e2 ? qt(this, pt) : new this.Collection(this, () => Wt(e2));
  }
  above(e2) {
    return null == e2 ? qt(this, pt) : new this.Collection(this, () => Vt(e2, void 0, true));
  }
  aboveOrEqual(e2) {
    return null == e2 ? qt(this, pt) : new this.Collection(this, () => Vt(e2, void 0, false));
  }
  below(e2) {
    return null == e2 ? qt(this, pt) : new this.Collection(this, () => Vt(void 0, e2, false, true));
  }
  belowOrEqual(e2) {
    return null == e2 ? qt(this, pt) : new this.Collection(this, () => Vt(void 0, e2));
  }
  startsWith(e2) {
    return "string" != typeof e2 ? qt(this, "String expected.") : this.between(e2, e2 + ft, true, true);
  }
  startsWithIgnoreCase(e2) {
    return "" === e2 ? this.startsWith(e2) : Lt(this, (e3, t2) => 0 === e3.indexOf(t2[0]), [e2], ft);
  }
  equalsIgnoreCase(e2) {
    return Lt(this, (e3, t2) => e3 === t2[0], [e2], "");
  }
  anyOfIgnoreCase() {
    var e2 = B.apply(I, arguments);
    return 0 === e2.length ? $t(this) : Lt(this, (e3, t2) => -1 !== t2.indexOf(e3), e2, "");
  }
  startsWithAnyOfIgnoreCase() {
    var e2 = B.apply(I, arguments);
    return 0 === e2.length ? $t(this) : Lt(this, (e3, t2) => t2.some((t3) => 0 === e3.indexOf(t3)), e2, ft);
  }
  anyOf() {
    const e2 = B.apply(I, arguments);
    let t2 = this._cmp;
    try {
      e2.sort(t2);
    } catch (e3) {
      return qt(this, pt);
    }
    if (0 === e2.length)
      return $t(this);
    const n2 = new this.Collection(this, () => Vt(e2[0], e2[e2.length - 1]));
    n2._ondirectionchange = (n3) => {
      t2 = "next" === n3 ? this._ascending : this._descending, e2.sort(t2);
    };
    let r2 = 0;
    return n2._addAlgorithm((n3, s2, i2) => {
      const o2 = n3.key;
      for (; t2(o2, e2[r2]) > 0; )
        if (++r2, r2 === e2.length)
          return s2(i2), false;
      return 0 === t2(o2, e2[r2]) || (s2(() => {
        n3.continue(e2[r2]);
      }), false);
    }), n2;
  }
  notEqual(e2) {
    return this.inAnyRange([[-(1 / 0), e2], [e2, this.db._maxKey]], { includeLowers: false, includeUppers: false });
  }
  noneOf() {
    const e2 = B.apply(I, arguments);
    if (0 === e2.length)
      return new this.Collection(this);
    try {
      e2.sort(this._ascending);
    } catch (e3) {
      return qt(this, pt);
    }
    const t2 = e2.reduce((e3, t3) => e3 ? e3.concat([[e3[e3.length - 1][1], t3]]) : [[-(1 / 0), t3]], null);
    return t2.push([e2[e2.length - 1], this.db._maxKey]), this.inAnyRange(t2, { includeLowers: false, includeUppers: false });
  }
  inAnyRange(e2, t2) {
    const n2 = this._cmp, r2 = this._ascending, s2 = this._descending, i2 = this._min, o2 = this._max;
    if (0 === e2.length)
      return $t(this);
    if (!e2.every((e3) => void 0 !== e3[0] && void 0 !== e3[1] && r2(e3[0], e3[1]) <= 0))
      return qt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", X.InvalidArgument);
    const a2 = !t2 || false !== t2.includeLowers, u2 = t2 && true === t2.includeUppers;
    let l2, c2 = r2;
    function h2(e3, t3) {
      return c2(e3[0], t3[0]);
    }
    try {
      l2 = e2.reduce(function(e3, t3) {
        let r3 = 0, s3 = e3.length;
        for (; r3 < s3; ++r3) {
          const s4 = e3[r3];
          if (n2(t3[0], s4[1]) < 0 && n2(t3[1], s4[0]) > 0) {
            s4[0] = i2(s4[0], t3[0]), s4[1] = o2(s4[1], t3[1]);
            break;
          }
        }
        return r3 === s3 && e3.push(t3), e3;
      }, []), l2.sort(h2);
    } catch (e3) {
      return qt(this, pt);
    }
    let d2 = 0;
    const f2 = u2 ? (e3) => r2(e3, l2[d2][1]) > 0 : (e3) => r2(e3, l2[d2][1]) >= 0, p2 = a2 ? (e3) => s2(e3, l2[d2][0]) > 0 : (e3) => s2(e3, l2[d2][0]) >= 0;
    let y2 = f2;
    const m2 = new this.Collection(this, () => Vt(l2[0][0], l2[l2.length - 1][1], !a2, !u2));
    return m2._ondirectionchange = (e3) => {
      "next" === e3 ? (y2 = f2, c2 = r2) : (y2 = p2, c2 = s2), l2.sort(h2);
    }, m2._addAlgorithm((e3, t3, n3) => {
      for (var s3 = e3.key; y2(s3); )
        if (++d2, d2 === l2.length)
          return t3(n3), false;
      return !!function(e4) {
        return !f2(e4) && !p2(e4);
      }(s3) || (0 === this._cmp(s3, l2[d2][1]) || 0 === this._cmp(s3, l2[d2][0]) || t3(() => {
        c2 === r2 ? e3.continue(l2[d2][0]) : e3.continue(l2[d2][1]);
      }), false);
    }), m2;
  }
  startsWithAnyOf() {
    const e2 = B.apply(I, arguments);
    return e2.every((e3) => "string" == typeof e3) ? 0 === e2.length ? $t(this) : this.inAnyRange(e2.map((e3) => [e3, e3 + ft])) : qt(this, "startsWithAnyOf() only works with strings");
  }
}
function zt(e2) {
  return We(function(t2) {
    return Gt(t2), e2(t2.target.error), false;
  });
}
function Gt(e2) {
  e2.stopPropagation && e2.stopPropagation(), e2.preventDefault && e2.preventDefault();
}
const Ht = Et(null, "storagemutated");
class Qt {
  _lock() {
    return m(!Ke.global), ++this._reculock, 1 !== this._reculock || Ke.global || (Ke.lockOwnerFor = this), this;
  }
  _unlock() {
    if (m(!Ke.global), 0 == --this._reculock)
      for (Ke.global || (Ke.lockOwnerFor = null); this._blockedFuncs.length > 0 && !this._locked(); ) {
        var e2 = this._blockedFuncs.shift();
        try {
          ot(e2[1], e2[0]);
        } catch (e3) {
        }
      }
    return this;
  }
  _locked() {
    return this._reculock && Ke.lockOwnerFor !== this;
  }
  create(e2) {
    if (!this.mode)
      return this;
    const t2 = this.db.idbdb, n2 = this.db._state.dbOpenError;
    if (m(!this.idbtrans), !e2 && !t2)
      switch (n2 && n2.name) {
        case "DatabaseClosedError":
          throw new X.DatabaseClosed(n2);
        case "MissingAPIError":
          throw new X.MissingAPI(n2.message, n2);
        default:
          throw new X.OpenFailed(n2);
      }
    if (!this.active)
      throw new X.TransactionInactive();
    return m(null === this._completion._state), (e2 = this.idbtrans = e2 || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : t2.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }))).onerror = We((t3) => {
      Gt(t3), this._reject(e2.error);
    }), e2.onabort = We((t3) => {
      Gt(t3), this.active && this._reject(new X.Abort(e2.error)), this.active = false, this.on("abort").fire(t3);
    }), e2.oncomplete = We(() => {
      this.active = false, this._resolve(), "mutatedParts" in e2 && Ht.storagemutated.fire(e2.mutatedParts);
    }), this;
  }
  _promise(e2, t2, n2) {
    if ("readwrite" === e2 && "readwrite" !== this.mode)
      return ht(new X.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return ht(new X.TransactionInactive());
    if (this._locked())
      return new Ce((r3, s2) => {
        this._blockedFuncs.push([() => {
          this._promise(e2, t2, n2).then(r3, s2);
        }, Ke]);
      });
    if (n2)
      return Je(() => {
        var e3 = new Ce((e4, n3) => {
          this._lock();
          const r3 = t2(e4, n3, this);
          r3 && r3.then && r3.then(e4, n3);
        });
        return e3.finally(() => this._unlock()), e3._lib = true, e3;
      });
    var r2 = new Ce((e3, n3) => {
      var r3 = t2(e3, n3, this);
      r3 && r3.then && r3.then(e3, n3);
    });
    return r2._lib = true, r2;
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(e2) {
    var t2 = this._root();
    const n2 = Ce.resolve(e2);
    if (t2._waitingFor)
      t2._waitingFor = t2._waitingFor.then(() => n2);
    else {
      t2._waitingFor = n2, t2._waitingQueue = [];
      var r2 = t2.idbtrans.objectStore(t2.storeNames[0]);
      !function e3() {
        for (++t2._spinCount; t2._waitingQueue.length; )
          t2._waitingQueue.shift()();
        t2._waitingFor && (r2.get(-1 / 0).onsuccess = e3);
      }();
    }
    var s2 = t2._waitingFor;
    return new Ce((e3, r3) => {
      n2.then((n3) => t2._waitingQueue.push(We(e3.bind(null, n3))), (e4) => t2._waitingQueue.push(We(r3.bind(null, e4)))).finally(() => {
        t2._waitingFor === s2 && (t2._waitingFor = null);
      });
    });
  }
  abort() {
    this.active && (this.active = false, this.idbtrans && this.idbtrans.abort(), this._reject(new X.Abort()));
  }
  table(e2) {
    const t2 = this._memoizedTables || (this._memoizedTables = {});
    if (o(t2, e2))
      return t2[e2];
    const n2 = this.schema[e2];
    if (!n2)
      throw new X.NotFound("Table " + e2 + " not part of transaction");
    const r2 = new this.db.Table(e2, n2, this);
    return r2.core = this.db.core.table(e2), t2[e2] = r2, r2;
  }
}
function Xt(e2, t2, n2, r2, s2, i2, o2) {
  return { name: e2, keyPath: t2, unique: n2, multi: r2, auto: s2, compound: i2, src: (n2 && !o2 ? "&" : "") + (r2 ? "*" : "") + (s2 ? "++" : "") + Jt(t2) };
}
function Jt(e2) {
  return "string" == typeof e2 ? e2 : e2 ? "[" + [].join.call(e2, "+") + "]" : "";
}
function Zt(e2, t2, n2) {
  return { name: e2, primKey: t2, indexes: n2, mappedClass: null, idxByName: g(n2, (e3) => [e3.name, e3]) };
}
let en = (e2) => {
  try {
    return e2.only([[]]), en = () => [[]], [[]];
  } catch (e3) {
    return en = () => ft, ft;
  }
};
function tn(e2) {
  return null == e2 ? () => {
  } : "string" == typeof e2 ? function(e3) {
    return 1 === e3.split(".").length ? (t2) => t2[e3] : (t2) => b(t2, e3);
  }(e2) : (t2) => b(t2, e2);
}
function nn(e2) {
  return [].slice.call(e2);
}
let rn = 0;
function sn(e2) {
  return null == e2 ? ":id" : "string" == typeof e2 ? e2 : `[${e2.join("+")}]`;
}
function on(e2, t2, r2) {
  function s2(e3) {
    if (3 === e3.type)
      return null;
    if (4 === e3.type)
      throw new Error("Cannot convert never type to IDBKeyRange");
    const { lower: n2, upper: r3, lowerOpen: s3, upperOpen: i3 } = e3;
    return void 0 === n2 ? void 0 === r3 ? null : t2.upperBound(r3, !!i3) : void 0 === r3 ? t2.lowerBound(n2, !!s3) : t2.bound(n2, r3, !!s3, !!i3);
  }
  const { schema: i2, hasGetAll: o2 } = function(e3, t3) {
    const r3 = nn(e3.objectStoreNames);
    return { schema: { name: e3.name, tables: r3.map((e4) => t3.objectStore(e4)).map((e4) => {
      const { keyPath: t4, autoIncrement: r4 } = e4, s3 = n(t4), i3 = null == t4, o3 = {}, a3 = { name: e4.name, primaryKey: { name: null, isPrimaryKey: true, outbound: i3, compound: s3, keyPath: t4, autoIncrement: r4, unique: true, extractKey: tn(t4) }, indexes: nn(e4.indexNames).map((t5) => e4.index(t5)).map((e5) => {
        const { name: t5, unique: r5, multiEntry: s4, keyPath: i4 } = e5, a4 = { name: t5, compound: n(i4), keyPath: i4, unique: r5, multiEntry: s4, extractKey: tn(i4) };
        return o3[sn(i4)] = a4, a4;
      }), getIndexByKeyPath: (e5) => o3[sn(e5)] };
      return o3[":id"] = a3.primaryKey, null != t4 && (o3[sn(t4)] = a3.primaryKey), a3;
    }) }, hasGetAll: r3.length > 0 && "getAll" in t3.objectStore(r3[0]) && true };
  }(e2, r2), a2 = i2.tables.map((e3) => function(e4) {
    const t3 = e4.name;
    return { name: t3, schema: e4, mutate: function({ trans: e5, type: n2, keys: r3, values: i3, range: o3 }) {
      return new Promise((a3, u3) => {
        a3 = We(a3);
        const l2 = e5.objectStore(t3), c2 = null == l2.keyPath, h2 = "put" === n2 || "add" === n2;
        if (!h2 && "delete" !== n2 && "deleteRange" !== n2)
          throw new Error("Invalid operation type: " + n2);
        const { length: d2 } = r3 || i3 || { length: 1 };
        if (r3 && i3 && r3.length !== i3.length)
          throw new Error("Given keys array must have same length as given values array.");
        if (0 === d2)
          return a3({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        let f2;
        const p2 = [], y2 = [];
        let m2 = 0;
        const v2 = (e6) => {
          ++m2, Gt(e6);
        };
        if ("deleteRange" === n2) {
          if (4 === o3.type)
            return a3({ numFailures: m2, failures: y2, results: [], lastResult: void 0 });
          3 === o3.type ? p2.push(f2 = l2.clear()) : p2.push(f2 = l2.delete(s2(o3)));
        } else {
          const [e6, t4] = h2 ? c2 ? [i3, r3] : [i3, null] : [r3, null];
          if (h2)
            for (let r4 = 0; r4 < d2; ++r4)
              p2.push(f2 = t4 && void 0 !== t4[r4] ? l2[n2](e6[r4], t4[r4]) : l2[n2](e6[r4])), f2.onerror = v2;
          else
            for (let t5 = 0; t5 < d2; ++t5)
              p2.push(f2 = l2[n2](e6[t5])), f2.onerror = v2;
        }
        const g2 = (e6) => {
          const t4 = e6.target.result;
          p2.forEach((e7, t5) => null != e7.error && (y2[t5] = e7.error)), a3({ numFailures: m2, failures: y2, results: "delete" === n2 ? r3 : p2.map((e7) => e7.result), lastResult: t4 });
        };
        f2.onerror = (e6) => {
          v2(e6), g2(e6);
        }, f2.onsuccess = g2;
      });
    }, getMany: ({ trans: e5, keys: n2 }) => new Promise((r3, s3) => {
      r3 = We(r3);
      const i3 = e5.objectStore(t3), o3 = n2.length, a3 = new Array(o3);
      let u3, l2 = 0, c2 = 0;
      const h2 = (e6) => {
        const t4 = e6.target;
        a3[t4._pos] = t4.result, ++c2 === l2 && r3(a3);
      }, d2 = zt(s3);
      for (let e6 = 0; e6 < o3; ++e6)
        null != n2[e6] && (u3 = i3.get(n2[e6]), u3._pos = e6, u3.onsuccess = h2, u3.onerror = d2, ++l2);
      0 === l2 && r3(a3);
    }), get: ({ trans: e5, key: n2 }) => new Promise((r3, s3) => {
      r3 = We(r3);
      const i3 = e5.objectStore(t3).get(n2);
      i3.onsuccess = (e6) => r3(e6.target.result), i3.onerror = zt(s3);
    }), query: function(e5) {
      return (n2) => new Promise((r3, i3) => {
        r3 = We(r3);
        const { trans: o3, values: a3, limit: u3, query: l2 } = n2, c2 = u3 === 1 / 0 ? void 0 : u3, { index: h2, range: d2 } = l2, f2 = o3.objectStore(t3), p2 = h2.isPrimaryKey ? f2 : f2.index(h2.name), y2 = s2(d2);
        if (0 === u3)
          return r3({ result: [] });
        if (e5) {
          const e6 = a3 ? p2.getAll(y2, c2) : p2.getAllKeys(y2, c2);
          e6.onsuccess = (e7) => r3({ result: e7.target.result }), e6.onerror = zt(i3);
        } else {
          let e6 = 0;
          const t4 = a3 || !("openKeyCursor" in p2) ? p2.openCursor(y2) : p2.openKeyCursor(y2), n3 = [];
          t4.onsuccess = (s3) => {
            const i4 = t4.result;
            return i4 ? (n3.push(a3 ? i4.value : i4.primaryKey), ++e6 === u3 ? r3({ result: n3 }) : void i4.continue()) : r3({ result: n3 });
          }, t4.onerror = zt(i3);
        }
      });
    }(o2), openCursor: function({ trans: e5, values: n2, query: r3, reverse: i3, unique: o3 }) {
      return new Promise((a3, u3) => {
        a3 = We(a3);
        const { index: l2, range: c2 } = r3, h2 = e5.objectStore(t3), d2 = l2.isPrimaryKey ? h2 : h2.index(l2.name), f2 = i3 ? o3 ? "prevunique" : "prev" : o3 ? "nextunique" : "next", p2 = n2 || !("openKeyCursor" in d2) ? d2.openCursor(s2(c2), f2) : d2.openKeyCursor(s2(c2), f2);
        p2.onerror = zt(u3), p2.onsuccess = We((t4) => {
          const n3 = p2.result;
          if (!n3)
            return void a3(null);
          n3.___id = ++rn, n3.done = false;
          const r4 = n3.continue.bind(n3);
          let s3 = n3.continuePrimaryKey;
          s3 && (s3 = s3.bind(n3));
          const i4 = n3.advance.bind(n3), o4 = () => {
            throw new Error("Cursor not stopped");
          };
          n3.trans = e5, n3.stop = n3.continue = n3.continuePrimaryKey = n3.advance = () => {
            throw new Error("Cursor not started");
          }, n3.fail = We(u3), n3.next = function() {
            let e6 = 1;
            return this.start(() => e6-- ? this.continue() : this.stop()).then(() => this);
          }, n3.start = (e6) => {
            const t5 = new Promise((e7, t6) => {
              e7 = We(e7), p2.onerror = zt(t6), n3.fail = t6, n3.stop = (t7) => {
                n3.stop = n3.continue = n3.continuePrimaryKey = n3.advance = o4, e7(t7);
              };
            }), a4 = () => {
              if (p2.result)
                try {
                  e6();
                } catch (e7) {
                  n3.fail(e7);
                }
              else
                n3.done = true, n3.start = () => {
                  throw new Error("Cursor behind last entry");
                }, n3.stop();
            };
            return p2.onsuccess = We((e7) => {
              p2.onsuccess = a4, a4();
            }), n3.continue = r4, n3.continuePrimaryKey = s3, n3.advance = i4, a4(), t5;
          }, a3(n3);
        }, u3);
      });
    }, count({ query: e5, trans: n2 }) {
      const { index: r3, range: i3 } = e5;
      return new Promise((e6, o3) => {
        const a3 = n2.objectStore(t3), u3 = r3.isPrimaryKey ? a3 : a3.index(r3.name), l2 = s2(i3), c2 = l2 ? u3.count(l2) : u3.count();
        c2.onsuccess = We((t4) => e6(t4.target.result)), c2.onerror = zt(o3);
      });
    } };
  }(e3)), u2 = {};
  return a2.forEach((e3) => u2[e3.name] = e3), { stack: "dbcore", transaction: e2.transaction.bind(e2), table(e3) {
    if (!u2[e3])
      throw new Error(`Table '${e3}' not found`);
    return u2[e3];
  }, MIN_KEY: -1 / 0, MAX_KEY: en(t2), schema: i2 };
}
function an({ _novip: e2 }, t2) {
  const n2 = t2.db, r2 = function(e3, t3, { IDBKeyRange: n3, indexedDB: r3 }, s2) {
    const i2 = function(e4, t4) {
      return t4.reduce((e5, { create: t5 }) => ({ ...e5, ...t5(e5) }), e4);
    }(on(t3, n3, s2), e3.dbcore);
    return { dbcore: i2 };
  }(e2._middlewares, n2, e2._deps, t2);
  e2.core = r2.dbcore, e2.tables.forEach((t3) => {
    const n3 = t3.name;
    e2.core.schema.tables.some((e3) => e3.name === n3) && (t3.core = e2.core.table(n3), e2[n3] instanceof e2.Table && (e2[n3].core = t3.core));
  });
}
function un({ _novip: e2 }, t2, n2, r2) {
  n2.forEach((n3) => {
    const s2 = r2[n3];
    t2.forEach((t3) => {
      const r3 = d(t3, n3);
      (!r3 || "value" in r3 && void 0 === r3.value) && (t3 === e2.Transaction.prototype || t3 instanceof e2.Transaction ? l(t3, n3, { get() {
        return this.table(n3);
      }, set(e3) {
        u(this, n3, { value: e3, writable: true, configurable: true, enumerable: true });
      } }) : t3[n3] = new e2.Table(n3, s2));
    });
  });
}
function ln({ _novip: e2 }, t2) {
  t2.forEach((t3) => {
    for (let n2 in t3)
      t3[n2] instanceof e2.Table && delete t3[n2];
  });
}
function cn(e2, t2) {
  return e2._cfg.version - t2._cfg.version;
}
function hn(e2, n2, r2, s2) {
  const i2 = e2._dbSchema, o2 = e2._createTransaction("readwrite", e2._storeNames, i2);
  o2.create(r2), o2._completion.catch(s2);
  const a2 = o2._reject.bind(o2), u2 = Ke.transless || Ke;
  Je(() => {
    Ke.trans = o2, Ke.transless = u2, 0 === n2 ? (t(i2).forEach((e3) => {
      fn(r2, e3, i2[e3].primKey, i2[e3].indexes);
    }), an(e2, r2), Ce.follow(() => e2.on.populate.fire(o2)).catch(a2)) : function({ _novip: e3 }, n3, r3, s3) {
      const i3 = [], o3 = e3._versions;
      let a3 = e3._dbSchema = yn(e3, e3.idbdb, s3), u3 = false;
      function l2() {
        return i3.length ? Ce.resolve(i3.shift()(r3.idbtrans)).then(l2) : Ce.resolve();
      }
      return o3.filter((e4) => e4._cfg.version >= n3).forEach((o4) => {
        i3.push(() => {
          const i4 = a3, l3 = o4._cfg.dbschema;
          mn(e3, i4, s3), mn(e3, l3, s3), a3 = e3._dbSchema = l3;
          const c2 = dn(i4, l3);
          c2.add.forEach((e4) => {
            fn(s3, e4[0], e4[1].primKey, e4[1].indexes);
          }), c2.change.forEach((e4) => {
            if (e4.recreate)
              throw new X.Upgrade("Not yet support for changing primary key");
            {
              const t2 = s3.objectStore(e4.name);
              e4.add.forEach((e5) => pn(t2, e5)), e4.change.forEach((e5) => {
                t2.deleteIndex(e5.name), pn(t2, e5);
              }), e4.del.forEach((e5) => t2.deleteIndex(e5));
            }
          });
          const h2 = o4._cfg.contentUpgrade;
          if (h2 && o4._cfg.version > n3) {
            an(e3, s3), r3._memoizedTables = {}, u3 = true;
            let n4 = w(l3);
            c2.del.forEach((e4) => {
              n4[e4] = i4[e4];
            }), ln(e3, [e3.Transaction.prototype]), un(e3, [e3.Transaction.prototype], t(n4), n4), r3.schema = n4;
            const o5 = T(h2);
            let a4;
            o5 && Ze();
            const d2 = Ce.follow(() => {
              if (a4 = h2(r3), a4 && o5) {
                var e4 = et.bind(null, null);
                a4.then(e4, e4);
              }
            });
            return a4 && "function" == typeof a4.then ? Ce.resolve(a4) : d2.then(() => a4);
          }
        }), i3.push((t2) => {
          if (!u3 || !vt) {
            !function(e4, t3) {
              [].slice.call(t3.db.objectStoreNames).forEach((n4) => null == e4[n4] && t3.db.deleteObjectStore(n4));
            }(o4._cfg.dbschema, t2);
          }
          ln(e3, [e3.Transaction.prototype]), un(e3, [e3.Transaction.prototype], e3._storeNames, e3._dbSchema), r3.schema = e3._dbSchema;
        });
      }), l2().then(() => {
        var e4, n4;
        n4 = s3, t(e4 = a3).forEach((t2) => {
          n4.db.objectStoreNames.contains(t2) || fn(n4, t2, e4[t2].primKey, e4[t2].indexes);
        });
      });
    }(e2, n2, o2, r2).catch(a2);
  });
}
function dn(e2, t2) {
  const n2 = { del: [], add: [], change: [] };
  let r2;
  for (r2 in e2)
    t2[r2] || n2.del.push(r2);
  for (r2 in t2) {
    const s2 = e2[r2], i2 = t2[r2];
    if (s2) {
      const e3 = { name: r2, def: i2, recreate: false, del: [], add: [], change: [] };
      if ("" + (s2.primKey.keyPath || "") != "" + (i2.primKey.keyPath || "") || s2.primKey.auto !== i2.primKey.auto && !mt)
        e3.recreate = true, n2.change.push(e3);
      else {
        const t3 = s2.idxByName, r3 = i2.idxByName;
        let o2;
        for (o2 in t3)
          r3[o2] || e3.del.push(o2);
        for (o2 in r3) {
          const n3 = t3[o2], s3 = r3[o2];
          n3 ? n3.src !== s3.src && e3.change.push(s3) : e3.add.push(s3);
        }
        (e3.del.length > 0 || e3.add.length > 0 || e3.change.length > 0) && n2.change.push(e3);
      }
    } else
      n2.add.push([r2, i2]);
  }
  return n2;
}
function fn(e2, t2, n2, r2) {
  const s2 = e2.db.createObjectStore(t2, n2.keyPath ? { keyPath: n2.keyPath, autoIncrement: n2.auto } : { autoIncrement: n2.auto });
  return r2.forEach((e3) => pn(s2, e3)), s2;
}
function pn(e2, t2) {
  e2.createIndex(t2.name, t2.keyPath, { unique: t2.unique, multiEntry: t2.multi });
}
function yn(e2, t2, n2) {
  const r2 = {};
  return p(t2.objectStoreNames, 0).forEach((e3) => {
    const t3 = n2.objectStore(e3);
    let s2 = t3.keyPath;
    const i2 = Xt(Jt(s2), s2 || "", false, false, !!t3.autoIncrement, s2 && "string" != typeof s2, true), o2 = [];
    for (let e4 = 0; e4 < t3.indexNames.length; ++e4) {
      const n3 = t3.index(t3.indexNames[e4]);
      s2 = n3.keyPath;
      var a2 = Xt(n3.name, s2, !!n3.unique, !!n3.multiEntry, false, s2 && "string" != typeof s2, false);
      o2.push(a2);
    }
    r2[e3] = Zt(e3, i2, o2);
  }), r2;
}
function mn({ _novip: t2 }, n2, r2) {
  const s2 = r2.db.objectStoreNames;
  for (let e2 = 0; e2 < s2.length; ++e2) {
    const i2 = s2[e2], o2 = r2.objectStore(i2);
    t2._hasGetAll = "getAll" in o2;
    for (let e3 = 0; e3 < o2.indexNames.length; ++e3) {
      const t3 = o2.indexNames[e3], r3 = o2.index(t3).keyPath, s3 = "string" == typeof r3 ? r3 : "[" + p(r3).join("+") + "]";
      if (n2[i2]) {
        const e4 = n2[i2].idxByName[s3];
        e4 && (e4.name = t3, delete n2[i2].idxByName[s3], n2[i2].idxByName[t3] = e4);
      }
    }
  }
}
class vn {
  _parseStoresSpec(e2, r2) {
    t(e2).forEach((t2) => {
      if (null !== e2[t2]) {
        var s2 = e2[t2].split(",").map((e3, t3) => {
          const r3 = (e3 = e3.trim()).replace(/([&*]|\+\+)/g, ""), s3 = /^\[/.test(r3) ? r3.match(/^\[(.*)\]$/)[1].split("+") : r3;
          return Xt(r3, s3 || null, /\&/.test(e3), /\*/.test(e3), /\+\+/.test(e3), n(s3), 0 === t3);
        }), i2 = s2.shift();
        if (i2.multi)
          throw new X.Schema("Primary key cannot be multi-valued");
        s2.forEach((e3) => {
          if (e3.auto)
            throw new X.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!e3.keyPath)
            throw new X.Schema("Index must have a name and cannot be an empty string");
        }), r2[t2] = Zt(t2, i2, s2);
      }
    });
  }
  stores(e2) {
    const n2 = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? r(this._cfg.storesSource, e2) : e2;
    const s2 = n2._versions, i2 = {};
    let o2 = {};
    return s2.forEach((e3) => {
      r(i2, e3._cfg.storesSource), o2 = e3._cfg.dbschema = {}, e3._parseStoresSpec(i2, o2);
    }), n2._dbSchema = o2, ln(n2, [n2._allTables, n2, n2.Transaction.prototype]), un(n2, [n2._allTables, n2, n2.Transaction.prototype, this._cfg.tables], t(o2), o2), n2._storeNames = t(o2), this;
  }
  upgrade(e2) {
    return this._cfg.contentUpgrade = ue(this._cfg.contentUpgrade || ee, e2), this;
  }
}
function gn(e2, t2) {
  let n2 = e2._dbNamesDB;
  return n2 || (n2 = e2._dbNamesDB = new $n("__dbnames", { addons: [], indexedDB: e2, IDBKeyRange: t2 }), n2.version(1).stores({ dbnames: "name" })), n2.table("dbnames");
}
function bn(e2) {
  return e2 && "function" == typeof e2.databases;
}
function _n(e2) {
  return Je(function() {
    return Ke.letThrough = true, e2();
  });
}
function xn(e2) {
  const n2 = e2._state, { indexedDB: r2 } = e2._deps;
  if (n2.isBeingOpened || e2.idbdb)
    return n2.dbReadyPromise.then(() => n2.dbOpenError ? ht(n2.dbOpenError) : e2);
  R && (n2.openCanceller._stackHolder = q()), n2.isBeingOpened = true, n2.dbOpenError = null, n2.openComplete = false;
  const s2 = n2.openCanceller;
  function i2() {
    if (n2.openCanceller !== s2)
      throw new X.DatabaseClosed("db.open() was cancelled");
  }
  let o2 = n2.dbReadyResolve, a2 = null, u2 = false;
  return Ce.race([s2, Ce.resolve().then(() => new Ce((s3, o3) => {
    if (i2(), !r2)
      throw new X.MissingAPI();
    const l2 = e2.name, c2 = n2.autoSchema ? r2.open(l2) : r2.open(l2, Math.round(10 * e2.verno));
    if (!c2)
      throw new X.MissingAPI();
    c2.onerror = zt(o3), c2.onblocked = We(e2._fireOnBlocked), c2.onupgradeneeded = We((t2) => {
      if (a2 = c2.transaction, n2.autoSchema && !e2._options.allowEmptyDB) {
        c2.onerror = Gt, a2.abort(), c2.result.close();
        const e3 = r2.deleteDatabase(l2);
        e3.onsuccess = e3.onerror = We(() => {
          o3(new X.NoSuchDatabase(`Database ${l2} doesnt exist`));
        });
      } else {
        a2.onerror = zt(o3);
        var s4 = t2.oldVersion > Math.pow(2, 62) ? 0 : t2.oldVersion;
        u2 = s4 < 1, e2._novip.idbdb = c2.result, hn(e2, s4 / 10, a2, o3);
      }
    }, o3), c2.onsuccess = We(() => {
      a2 = null;
      const r3 = e2._novip.idbdb = c2.result, i3 = p(r3.objectStoreNames);
      if (i3.length > 0)
        try {
          const s4 = r3.transaction(1 === (o4 = i3).length ? o4[0] : o4, "readonly");
          n2.autoSchema ? function({ _novip: e3 }, n3, r4) {
            e3.verno = n3.version / 10;
            const s5 = e3._dbSchema = yn(0, n3, r4);
            e3._storeNames = p(n3.objectStoreNames, 0), un(e3, [e3._allTables], t(s5), s5);
          }(e2, r3, s4) : (mn(e2, e2._dbSchema, s4), function(e3, t2) {
            const n3 = dn(yn(0, e3.idbdb, t2), e3._dbSchema);
            return !(n3.add.length || n3.change.some((e4) => e4.add.length || e4.change.length));
          }(e2, s4) || console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.")), an(e2, s4);
        } catch (e3) {
        }
      var o4;
      yt.push(e2), r3.onversionchange = We((t2) => {
        n2.vcFired = true, e2.on("versionchange").fire(t2);
      }), r3.onclose = We((t2) => {
        e2.on("close").fire(t2);
      }), u2 && function({ indexedDB: e3, IDBKeyRange: t2 }, n3) {
        !bn(e3) && "__dbnames" !== n3 && gn(e3, t2).put({ name: n3 }).catch(ee);
      }(e2._deps, l2), s3();
    }, o3);
  }))]).then(() => (i2(), n2.onReadyBeingFired = [], Ce.resolve(_n(() => e2.on.ready.fire(e2.vip))).then(function t2() {
    if (n2.onReadyBeingFired.length > 0) {
      let r3 = n2.onReadyBeingFired.reduce(ue, ee);
      return n2.onReadyBeingFired = [], Ce.resolve(_n(() => r3(e2.vip))).then(t2);
    }
  }))).finally(() => {
    n2.onReadyBeingFired = null, n2.isBeingOpened = false;
  }).then(() => e2).catch((t2) => {
    n2.dbOpenError = t2;
    try {
      a2 && a2.abort();
    } catch (e3) {
    }
    return s2 === n2.openCanceller && e2._close(), ht(t2);
  }).finally(() => {
    n2.openComplete = true, o2();
  });
}
function kn(e2) {
  var t2 = (t3) => e2.next(t3), r2 = i2(t2), s2 = i2((t3) => e2.throw(t3));
  function i2(e3) {
    return (t3) => {
      var i3 = e3(t3), o2 = i3.value;
      return i3.done ? o2 : o2 && "function" == typeof o2.then ? o2.then(r2, s2) : n(o2) ? Promise.all(o2).then(r2, s2) : r2(o2);
    };
  }
  return i2(t2)();
}
function En(e2, t2, n2) {
  var r2 = arguments.length;
  if (r2 < 2)
    throw new X.InvalidArgument("Too few arguments");
  for (var s2 = new Array(r2 - 1); --r2; )
    s2[r2 - 1] = arguments[r2];
  n2 = s2.pop();
  var i2 = k(s2);
  return [e2, i2, n2];
}
function Pn(e2, t2, n2, r2, s2) {
  return Ce.resolve().then(() => {
    const i2 = Ke.transless || Ke, o2 = e2._createTransaction(t2, n2, e2._dbSchema, r2), a2 = { trans: o2, transless: i2 };
    if (r2)
      o2.idbtrans = r2.idbtrans;
    else
      try {
        o2.create(), e2._state.PR1398_maxLoop = 3;
      } catch (r3) {
        return r3.name === H.InvalidState && e2.isOpen() && --e2._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"), e2._close(), e2.open().then(() => Pn(e2, t2, n2, null, s2))) : ht(r3);
      }
    const u2 = T(s2);
    let l2;
    u2 && Ze();
    const c2 = Ce.follow(() => {
      if (l2 = s2.call(o2, o2), l2)
        if (u2) {
          var e3 = et.bind(null, null);
          l2.then(e3, e3);
        } else
          "function" == typeof l2.next && "function" == typeof l2.throw && (l2 = kn(l2));
    }, a2);
    return (l2 && "function" == typeof l2.then ? Ce.resolve(l2).then((e3) => o2.active ? e3 : ht(new X.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : c2.then(() => l2)).then((e3) => (r2 && o2._resolve(), o2._completion.then(() => e3))).catch((e3) => (o2._reject(e3), ht(e3)));
  });
}
function Kn(e2, t2, r2) {
  const s2 = n(e2) ? e2.slice() : [e2];
  for (let e3 = 0; e3 < r2; ++e3)
    s2.push(t2);
  return s2;
}
const On = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(e2) {
  return { ...e2, table(t2) {
    const n2 = e2.table(t2), { schema: r2 } = n2, s2 = {}, i2 = [];
    function o2(e3, t3, n3) {
      const r3 = sn(e3), a3 = s2[r3] = s2[r3] || [], u3 = null == e3 ? 0 : "string" == typeof e3 ? 1 : e3.length, l3 = t3 > 0, c2 = { ...n3, isVirtual: l3, keyTail: t3, keyLength: u3, extractKey: tn(e3), unique: !l3 && n3.unique };
      if (a3.push(c2), c2.isPrimaryKey || i2.push(c2), u3 > 1) {
        o2(2 === u3 ? e3[0] : e3.slice(0, u3 - 1), t3 + 1, n3);
      }
      return a3.sort((e4, t4) => e4.keyTail - t4.keyTail), c2;
    }
    const a2 = o2(r2.primaryKey.keyPath, 0, r2.primaryKey);
    s2[":id"] = [a2];
    for (const e3 of r2.indexes)
      o2(e3.keyPath, 0, e3);
    function u2(t3) {
      const n3 = t3.query.index;
      return n3.isVirtual ? { ...t3, query: { index: n3, range: (r3 = t3.query.range, s3 = n3.keyTail, { type: 1 === r3.type ? 2 : r3.type, lower: Kn(r3.lower, r3.lowerOpen ? e2.MAX_KEY : e2.MIN_KEY, s3), lowerOpen: true, upper: Kn(r3.upper, r3.upperOpen ? e2.MIN_KEY : e2.MAX_KEY, s3), upperOpen: true }) } } : t3;
      var r3, s3;
    }
    const l2 = { ...n2, schema: { ...r2, primaryKey: a2, indexes: i2, getIndexByKeyPath: function(e3) {
      const t3 = s2[sn(e3)];
      return t3 && t3[0];
    } }, count: (e3) => n2.count(u2(e3)), query: (e3) => n2.query(u2(e3)), openCursor(t3) {
      const { keyTail: r3, isVirtual: s3, keyLength: i3 } = t3.query.index;
      if (!s3)
        return n2.openCursor(t3);
      return n2.openCursor(u2(t3)).then((n3) => n3 && function(n4) {
        const s4 = Object.create(n4, { continue: { value: function(s5) {
          null != s5 ? n4.continue(Kn(s5, t3.reverse ? e2.MAX_KEY : e2.MIN_KEY, r3)) : t3.unique ? n4.continue(n4.key.slice(0, i3).concat(t3.reverse ? e2.MIN_KEY : e2.MAX_KEY, r3)) : n4.continue();
        } }, continuePrimaryKey: { value(t4, s5) {
          n4.continuePrimaryKey(Kn(t4, e2.MAX_KEY, r3), s5);
        } }, primaryKey: { get: () => n4.primaryKey }, key: { get() {
          const e3 = n4.key;
          return 1 === i3 ? e3[0] : e3.slice(0, i3);
        } }, value: { get: () => n4.value } });
        return s4;
      }(n3));
    } };
    return l2;
  } };
} };
function Sn(e2, n2, r2, s2) {
  return r2 = r2 || {}, s2 = s2 || "", t(e2).forEach((t2) => {
    if (o(n2, t2)) {
      var i2 = e2[t2], a2 = n2[t2];
      if ("object" == typeof i2 && "object" == typeof a2 && i2 && a2) {
        const e3 = C(i2);
        e3 !== C(a2) ? r2[s2 + t2] = n2[t2] : "Object" === e3 ? Sn(i2, a2, r2, s2 + t2 + ".") : i2 !== a2 && (r2[s2 + t2] = n2[t2]);
      } else
        i2 !== a2 && (r2[s2 + t2] = n2[t2]);
    } else
      r2[s2 + t2] = void 0;
  }), t(n2).forEach((t2) => {
    o(e2, t2) || (r2[s2 + t2] = n2[t2]);
  }), r2;
}
const An = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: (e2) => ({ ...e2, table(t2) {
  const n2 = e2.table(t2), { primaryKey: r2 } = n2.schema, s2 = { ...n2, mutate(e3) {
    const s3 = Ke.trans, { deleting: i2, creating: a2, updating: u2 } = s3.table(t2).hook;
    switch (e3.type) {
      case "add":
        if (a2.fire === ee)
          break;
        return s3._promise("readwrite", () => l2(e3), true);
      case "put":
        if (a2.fire === ee && u2.fire === ee)
          break;
        return s3._promise("readwrite", () => l2(e3), true);
      case "delete":
        if (i2.fire === ee)
          break;
        return s3._promise("readwrite", () => l2(e3), true);
      case "deleteRange":
        if (i2.fire === ee)
          break;
        return s3._promise("readwrite", () => function(e4) {
          return c2(e4.trans, e4.range, 1e4);
        }(e3), true);
    }
    return n2.mutate(e3);
    function l2(e4) {
      const t3 = Ke.trans, s4 = e4.keys || function(e5, t4) {
        return "delete" === t4.type ? t4.keys : t4.keys || t4.values.map(e5.extractKey);
      }(r2, e4);
      if (!s4)
        throw new Error("Keys missing");
      return "delete" !== (e4 = "add" === e4.type || "put" === e4.type ? { ...e4, keys: s4 } : { ...e4 }).type && (e4.values = [...e4.values]), e4.keys && (e4.keys = [...e4.keys]), function(e5, t4, n3) {
        return "add" === t4.type ? Promise.resolve([]) : e5.getMany({ trans: t4.trans, keys: n3, cache: "immutable" });
      }(n2, e4, s4).then((l3) => {
        const c3 = s4.map((n3, s5) => {
          const c4 = l3[s5], h2 = { onerror: null, onsuccess: null };
          if ("delete" === e4.type)
            i2.fire.call(h2, n3, c4, t3);
          else if ("add" === e4.type || void 0 === c4) {
            const i3 = a2.fire.call(h2, n3, e4.values[s5], t3);
            null == n3 && null != i3 && (n3 = i3, e4.keys[s5] = n3, r2.outbound || _(e4.values[s5], r2.keyPath, n3));
          } else {
            const r3 = Sn(c4, e4.values[s5]), i3 = u2.fire.call(h2, r3, n3, c4, t3);
            if (i3) {
              const t4 = e4.values[s5];
              Object.keys(i3).forEach((e5) => {
                o(t4, e5) ? t4[e5] = i3[e5] : _(t4, e5, i3[e5]);
              });
            }
          }
          return h2;
        });
        return n2.mutate(e4).then(({ failures: t4, results: n3, numFailures: r3, lastResult: i3 }) => {
          for (let r4 = 0; r4 < s4.length; ++r4) {
            const i4 = n3 ? n3[r4] : s4[r4], o2 = c3[r4];
            null == i4 ? o2.onerror && o2.onerror(t4[r4]) : o2.onsuccess && o2.onsuccess("put" === e4.type && l3[r4] ? e4.values[r4] : i4);
          }
          return { failures: t4, results: n3, numFailures: r3, lastResult: i3 };
        }).catch((e5) => (c3.forEach((t4) => t4.onerror && t4.onerror(e5)), Promise.reject(e5)));
      });
    }
    function c2(e4, t3, s4) {
      return n2.query({ trans: e4, values: false, query: { index: r2, range: t3 }, limit: s4 }).then(({ result: n3 }) => l2({ type: "delete", keys: n3, trans: e4 }).then((r3) => r3.numFailures > 0 ? Promise.reject(r3.failures[0]) : n3.length < s4 ? { failures: [], numFailures: 0, lastResult: void 0 } : c2(e4, { ...t3, lower: n3[n3.length - 1], lowerOpen: true }, s4)));
    }
  } };
  return s2;
} }) };
function Cn(e2, t2, n2) {
  try {
    if (!t2)
      return null;
    if (t2.keys.length < e2.length)
      return null;
    const r2 = [];
    for (let s2 = 0, i2 = 0; s2 < t2.keys.length && i2 < e2.length; ++s2)
      0 === It(t2.keys[s2], e2[i2]) && (r2.push(n2 ? O(t2.values[s2]) : t2.values[s2]), ++i2);
    return r2.length === e2.length ? r2 : null;
  } catch (e3) {
    return null;
  }
}
const jn = { stack: "dbcore", level: -1, create: (e2) => ({ table: (t2) => {
  const n2 = e2.table(t2);
  return { ...n2, getMany: (e3) => {
    if (!e3.cache)
      return n2.getMany(e3);
    const t3 = Cn(e3.keys, e3.trans._cache, "clone" === e3.cache);
    return t3 ? Ce.resolve(t3) : n2.getMany(e3).then((t4) => (e3.trans._cache = { keys: e3.keys, values: "clone" === e3.cache ? O(t4) : t4 }, t4));
  }, mutate: (e3) => ("add" !== e3.type && (e3.trans._cache = null), n2.mutate(e3)) };
} }) };
function Dn(e2) {
  return !("from" in e2);
}
const In = function(e2, t2) {
  if (!this) {
    const t3 = new In();
    return e2 && "d" in e2 && r(t3, e2), t3;
  }
  r(this, arguments.length ? { d: 1, from: e2, to: arguments.length > 1 ? t2 : e2 } : { d: 0 });
};
function Bn(e2, t2, n2) {
  const s2 = It(t2, n2);
  if (isNaN(s2))
    return;
  if (s2 > 0)
    throw RangeError();
  if (Dn(e2))
    return r(e2, { from: t2, to: n2, d: 1 });
  const i2 = e2.l, o2 = e2.r;
  if (It(n2, e2.from) < 0)
    return i2 ? Bn(i2, t2, n2) : e2.l = { from: t2, to: n2, d: 1, l: null, r: null }, Mn(e2);
  if (It(t2, e2.to) > 0)
    return o2 ? Bn(o2, t2, n2) : e2.r = { from: t2, to: n2, d: 1, l: null, r: null }, Mn(e2);
  It(t2, e2.from) < 0 && (e2.from = t2, e2.l = null, e2.d = o2 ? o2.d + 1 : 1), It(n2, e2.to) > 0 && (e2.to = n2, e2.r = null, e2.d = e2.l ? e2.l.d + 1 : 1);
  const a2 = !e2.r;
  i2 && !e2.l && Tn(e2, i2), o2 && a2 && Tn(e2, o2);
}
function Tn(e2, t2) {
  Dn(t2) || function e3(t3, { from: n2, to: r2, l: s2, r: i2 }) {
    Bn(t3, n2, r2), s2 && e3(t3, s2), i2 && e3(t3, i2);
  }(e2, t2);
}
function Rn(e2, t2) {
  const n2 = Fn(t2);
  let r2 = n2.next();
  if (r2.done)
    return false;
  let s2 = r2.value;
  const i2 = Fn(e2);
  let o2 = i2.next(s2.from), a2 = o2.value;
  for (; !r2.done && !o2.done; ) {
    if (It(a2.from, s2.to) <= 0 && It(a2.to, s2.from) >= 0)
      return true;
    It(s2.from, a2.from) < 0 ? s2 = (r2 = n2.next(a2.from)).value : a2 = (o2 = i2.next(s2.from)).value;
  }
  return false;
}
function Fn(e2) {
  let t2 = Dn(e2) ? null : { s: 0, n: e2 };
  return { next(e3) {
    const n2 = arguments.length > 0;
    for (; t2; )
      switch (t2.s) {
        case 0:
          if (t2.s = 1, n2)
            for (; t2.n.l && It(e3, t2.n.from) < 0; )
              t2 = { up: t2, n: t2.n.l, s: 1 };
          else
            for (; t2.n.l; )
              t2 = { up: t2, n: t2.n.l, s: 1 };
        case 1:
          if (t2.s = 2, !n2 || It(e3, t2.n.to) <= 0)
            return { value: t2.n, done: false };
        case 2:
          if (t2.n.r) {
            t2.s = 3, t2 = { up: t2, n: t2.n.r, s: 0 };
            continue;
          }
        case 3:
          t2 = t2.up;
      }
    return { done: true };
  } };
}
function Mn(e2) {
  var t2, n2;
  const r2 = ((null === (t2 = e2.r) || void 0 === t2 ? void 0 : t2.d) || 0) - ((null === (n2 = e2.l) || void 0 === n2 ? void 0 : n2.d) || 0), s2 = r2 > 1 ? "r" : r2 < -1 ? "l" : "";
  if (s2) {
    const t3 = "r" === s2 ? "l" : "r", n3 = { ...e2 }, r3 = e2[s2];
    e2.from = r3.from, e2.to = r3.to, e2[s2] = r3[s2], n3[s2] = r3[t3], e2[t3] = n3, n3.d = Nn(n3);
  }
  e2.d = Nn(e2);
}
function Nn({ r: e2, l: t2 }) {
  return (e2 ? t2 ? Math.max(e2.d, t2.d) : e2.d : t2 ? t2.d : 0) + 1;
}
a(In.prototype, { add(e2) {
  return Tn(this, e2), this;
}, addKey(e2) {
  return Bn(this, e2, e2), this;
}, addKeys(e2) {
  return e2.forEach((e3) => Bn(this, e3, e3)), this;
}, [j]() {
  return Fn(this);
} });
const qn = { stack: "dbcore", level: 0, create: (e2) => {
  const r2 = e2.schema.name, s2 = new In(e2.MIN_KEY, e2.MAX_KEY);
  return { ...e2, table: (i2) => {
    const o2 = e2.table(i2), { schema: a2 } = o2, { primaryKey: u2 } = a2, { extractKey: l2, outbound: c2 } = u2, h2 = { ...o2, mutate: (e3) => {
      const t2 = e3.trans, u3 = t2.mutatedParts || (t2.mutatedParts = {}), l3 = (e4) => {
        const t3 = `idb://${r2}/${i2}/${e4}`;
        return u3[t3] || (u3[t3] = new In());
      }, c3 = l3(""), h3 = l3(":dels"), { type: d3 } = e3;
      let [f3, p2] = "deleteRange" === e3.type ? [e3.range] : "delete" === e3.type ? [e3.keys] : e3.values.length < 50 ? [[], e3.values] : [];
      const y2 = e3.trans._cache;
      return o2.mutate(e3).then((e4) => {
        if (n(f3)) {
          "delete" !== d3 && (f3 = e4.results), c3.addKeys(f3);
          const t3 = Cn(f3, y2);
          t3 || "add" === d3 || h3.addKeys(f3), (t3 || p2) && function(e5, t4, r3, s3) {
            function i3(t5) {
              const i4 = e5(t5.name || "");
              function o3(e6) {
                return null != e6 ? t5.extractKey(e6) : null;
              }
              const a3 = (e6) => t5.multiEntry && n(e6) ? e6.forEach((e7) => i4.addKey(e7)) : i4.addKey(e6);
              (r3 || s3).forEach((e6, t6) => {
                const n2 = r3 && o3(r3[t6]), i5 = s3 && o3(s3[t6]);
                0 !== It(n2, i5) && (null != n2 && a3(n2), null != i5 && a3(i5));
              });
            }
            t4.indexes.forEach(i3);
          }(l3, a2, t3, p2);
        } else if (f3) {
          const e5 = { from: f3.lower, to: f3.upper };
          h3.add(e5), c3.add(e5);
        } else
          c3.add(s2), h3.add(s2), a2.indexes.forEach((e5) => l3(e5.name).add(s2));
        return e4;
      });
    } }, d2 = ({ query: { index: t2, range: n2 } }) => {
      var r3, s3;
      return [t2, new In(null !== (r3 = n2.lower) && void 0 !== r3 ? r3 : e2.MIN_KEY, null !== (s3 = n2.upper) && void 0 !== s3 ? s3 : e2.MAX_KEY)];
    }, f2 = { get: (e3) => [u2, new In(e3.key)], getMany: (e3) => [u2, new In().addKeys(e3.keys)], count: d2, query: d2, openCursor: d2 };
    return t(f2).forEach((e3) => {
      h2[e3] = function(t2) {
        const { subscr: n2 } = Ke;
        if (n2) {
          const a3 = (e4) => {
            const t3 = `idb://${r2}/${i2}/${e4}`;
            return n2[t3] || (n2[t3] = new In());
          }, u3 = a3(""), h3 = a3(":dels"), [d3, p2] = f2[e3](t2);
          if (a3(d3.name || "").add(p2), !d3.isPrimaryKey) {
            if ("count" !== e3) {
              const n3 = "query" === e3 && c2 && t2.values && o2.query({ ...t2, values: false });
              return o2[e3].apply(this, arguments).then((r3) => {
                if ("query" === e3) {
                  if (c2 && t2.values)
                    return n3.then(({ result: e5 }) => (u3.addKeys(e5), r3));
                  const e4 = t2.values ? r3.result.map(l2) : r3.result;
                  t2.values ? u3.addKeys(e4) : h3.addKeys(e4);
                } else if ("openCursor" === e3) {
                  const e4 = r3, n4 = t2.values;
                  return e4 && Object.create(e4, { key: { get: () => (h3.addKey(e4.primaryKey), e4.key) }, primaryKey: { get() {
                    const t3 = e4.primaryKey;
                    return h3.addKey(t3), t3;
                  } }, value: { get: () => (n4 && u3.addKey(e4.primaryKey), e4.value) } });
                }
                return r3;
              });
            }
            h3.add(s2);
          }
        }
        return o2[e3].apply(this, arguments);
      };
    }), h2;
  } };
} };
class $n {
  constructor(e2, t2) {
    this._middlewares = {}, this.verno = 0;
    const n2 = $n.dependencies;
    this._options = t2 = { addons: $n.addons, autoOpen: true, indexedDB: n2.indexedDB, IDBKeyRange: n2.IDBKeyRange, ...t2 }, this._deps = { indexedDB: t2.indexedDB, IDBKeyRange: t2.IDBKeyRange };
    const { addons: r2 } = t2;
    this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
    const s2 = { dbOpenError: null, isBeingOpened: false, onReadyBeingFired: null, openComplete: false, dbReadyResolve: ee, dbReadyPromise: null, cancelOpen: ee, openCanceller: null, autoSchema: true, PR1398_maxLoop: 3 };
    var i2;
    s2.dbReadyPromise = new Ce((e3) => {
      s2.dbReadyResolve = e3;
    }), s2.openCanceller = new Ce((e3, t3) => {
      s2.cancelOpen = t3;
    }), this._state = s2, this.name = e2, this.on = Et(this, "populate", "blocked", "versionchange", "close", { ready: [ue, ee] }), this.on.ready.subscribe = y(this.on.ready.subscribe, (e3) => (t3, n3) => {
      $n.vip(() => {
        const r3 = this._state;
        if (r3.openComplete)
          r3.dbOpenError || Ce.resolve().then(t3), n3 && e3(t3);
        else if (r3.onReadyBeingFired)
          r3.onReadyBeingFired.push(t3), n3 && e3(t3);
        else {
          e3(t3);
          const r4 = this;
          n3 || e3(function e4() {
            r4.on.ready.unsubscribe(t3), r4.on.ready.unsubscribe(e4);
          });
        }
      });
    }), this.Collection = (i2 = this, Pt(Rt.prototype, function(e3, t3) {
      this.db = i2;
      let n3 = wt, r3 = null;
      if (t3)
        try {
          n3 = t3();
        } catch (e4) {
          r3 = e4;
        }
      const s3 = e3._ctx, o2 = s3.table, a2 = o2.hook.reading.fire;
      this._ctx = { table: o2, index: s3.index, isPrimKey: !s3.index || o2.schema.primKey.keyPath && s3.index === o2.schema.primKey.name, range: n3, keysOnly: false, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: true, isMatch: null, offset: 0, limit: 1 / 0, error: r3, or: s3.or, valueMapper: a2 !== te ? a2 : null };
    })), this.Table = function(e3) {
      return Pt(kt.prototype, function(t3, n3, r3) {
        this.db = e3, this._tx = r3, this.name = t3, this.schema = n3, this.hook = e3._allTables[t3] ? e3._allTables[t3].hook : Et(null, { creating: [se, ee], reading: [ne, te], updating: [oe, ee], deleting: [ie, ee] });
      });
    }(this), this.Transaction = function(e3) {
      return Pt(Qt.prototype, function(t3, n3, r3, s3, i3) {
        this.db = e3, this.mode = t3, this.storeNames = n3, this.schema = r3, this.chromeTransactionDurability = s3, this.idbtrans = null, this.on = Et(this, "complete", "error", "abort"), this.parent = i3 || null, this.active = true, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new Ce((e4, t4) => {
          this._resolve = e4, this._reject = t4;
        }), this._completion.then(() => {
          this.active = false, this.on.complete.fire();
        }, (e4) => {
          var t4 = this.active;
          return this.active = false, this.on.error.fire(e4), this.parent ? this.parent._reject(e4) : t4 && this.idbtrans && this.idbtrans.abort(), ht(e4);
        });
      });
    }(this), this.Version = function(e3) {
      return Pt(vn.prototype, function(t3) {
        this.db = e3, this._cfg = { version: t3, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      });
    }(this), this.WhereClause = function(e3) {
      return Pt(Yt.prototype, function(t3, n3, r3) {
        this.db = e3, this._ctx = { table: t3, index: ":id" === n3 ? null : n3, or: r3 };
        const s3 = e3._deps.indexedDB;
        if (!s3)
          throw new X.MissingAPI();
        this._cmp = this._ascending = s3.cmp.bind(s3), this._descending = (e4, t4) => s3.cmp(t4, e4), this._max = (e4, t4) => s3.cmp(e4, t4) > 0 ? e4 : t4, this._min = (e4, t4) => s3.cmp(e4, t4) < 0 ? e4 : t4, this._IDBKeyRange = e3._deps.IDBKeyRange;
      });
    }(this), this.on("versionchange", (e3) => {
      e3.newVersion > 0 ? console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`), this.close();
    }), this.on("blocked", (e3) => {
      !e3.newVersion || e3.newVersion < e3.oldVersion ? console.warn(`Dexie.delete('${this.name}') was blocked`) : console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${e3.oldVersion / 10}`);
    }), this._maxKey = en(t2.IDBKeyRange), this._createTransaction = (e3, t3, n3, r3) => new this.Transaction(e3, t3, n3, this._options.chromeTransactionDurability, r3), this._fireOnBlocked = (e3) => {
      this.on("blocked").fire(e3), yt.filter((e4) => e4.name === this.name && e4 !== this && !e4._state.vcFired).map((t3) => t3.on("versionchange").fire(e3));
    }, this.use(On), this.use(An), this.use(qn), this.use(jn), this.vip = Object.create(this, { _vip: { value: true } }), r2.forEach((e3) => e3(this));
  }
  version(e2) {
    if (isNaN(e2) || e2 < 0.1)
      throw new X.Type("Given version is not a positive number");
    if (e2 = Math.round(10 * e2) / 10, this.idbdb || this._state.isBeingOpened)
      throw new X.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, e2);
    const t2 = this._versions;
    var n2 = t2.filter((t3) => t3._cfg.version === e2)[0];
    return n2 || (n2 = new this.Version(e2), t2.push(n2), t2.sort(cn), n2.stores({}), this._state.autoSchema = false, n2);
  }
  _whenReady(e2) {
    return this.idbdb && (this._state.openComplete || Ke.letThrough || this._vip) ? e2() : new Ce((e3, t2) => {
      if (this._state.openComplete)
        return t2(new X.DatabaseClosed(this._state.dbOpenError));
      if (!this._state.isBeingOpened) {
        if (!this._options.autoOpen)
          return void t2(new X.DatabaseClosed());
        this.open().catch(ee);
      }
      this._state.dbReadyPromise.then(e3, t2);
    }).then(e2);
  }
  use({ stack: e2, create: t2, level: n2, name: r2 }) {
    r2 && this.unuse({ stack: e2, name: r2 });
    const s2 = this._middlewares[e2] || (this._middlewares[e2] = []);
    return s2.push({ stack: e2, create: t2, level: null == n2 ? 10 : n2, name: r2 }), s2.sort((e3, t3) => e3.level - t3.level), this;
  }
  unuse({ stack: e2, name: t2, create: n2 }) {
    return e2 && this._middlewares[e2] && (this._middlewares[e2] = this._middlewares[e2].filter((e3) => n2 ? e3.create !== n2 : !!t2 && e3.name !== t2)), this;
  }
  open() {
    return xn(this);
  }
  _close() {
    const e2 = this._state, t2 = yt.indexOf(this);
    if (t2 >= 0 && yt.splice(t2, 1), this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e3) {
      }
      this._novip.idbdb = null;
    }
    e2.dbReadyPromise = new Ce((t3) => {
      e2.dbReadyResolve = t3;
    }), e2.openCanceller = new Ce((t3, n2) => {
      e2.cancelOpen = n2;
    });
  }
  close() {
    this._close();
    const e2 = this._state;
    this._options.autoOpen = false, e2.dbOpenError = new X.DatabaseClosed(), e2.isBeingOpened && e2.cancelOpen(e2.dbOpenError);
  }
  delete() {
    const e2 = arguments.length > 0, t2 = this._state;
    return new Ce((n2, r2) => {
      const s2 = () => {
        this.close();
        var e3 = this._deps.indexedDB.deleteDatabase(this.name);
        e3.onsuccess = We(() => {
          !function({ indexedDB: e4, IDBKeyRange: t3 }, n3) {
            !bn(e4) && "__dbnames" !== n3 && gn(e4, t3).delete(n3).catch(ee);
          }(this._deps, this.name), n2();
        }), e3.onerror = zt(r2), e3.onblocked = this._fireOnBlocked;
      };
      if (e2)
        throw new X.InvalidArgument("Arguments not allowed in db.delete()");
      t2.isBeingOpened ? t2.dbReadyPromise.then(s2) : s2();
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return null !== this.idbdb;
  }
  hasBeenClosed() {
    const e2 = this._state.dbOpenError;
    return e2 && "DatabaseClosed" === e2.name;
  }
  hasFailed() {
    return null !== this._state.dbOpenError;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return t(this._allTables).map((e2) => this._allTables[e2]);
  }
  transaction() {
    const e2 = En.apply(this, arguments);
    return this._transaction.apply(this, e2);
  }
  _transaction(e2, t2, n2) {
    let r2 = Ke.trans;
    r2 && r2.db === this && -1 === e2.indexOf("!") || (r2 = null);
    const s2 = -1 !== e2.indexOf("?");
    let i2, o2;
    e2 = e2.replace("!", "").replace("?", "");
    try {
      if (o2 = t2.map((e3) => {
        var t3 = e3 instanceof this.Table ? e3.name : e3;
        if ("string" != typeof t3)
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return t3;
      }), "r" == e2 || "readonly" === e2)
        i2 = "readonly";
      else {
        if ("rw" != e2 && "readwrite" != e2)
          throw new X.InvalidArgument("Invalid transaction mode: " + e2);
        i2 = "readwrite";
      }
      if (r2) {
        if ("readonly" === r2.mode && "readwrite" === i2) {
          if (!s2)
            throw new X.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
          r2 = null;
        }
        r2 && o2.forEach((e3) => {
          if (r2 && -1 === r2.storeNames.indexOf(e3)) {
            if (!s2)
              throw new X.SubTransaction("Table " + e3 + " not included in parent transaction.");
            r2 = null;
          }
        }), s2 && r2 && !r2.active && (r2 = null);
      }
    } catch (e3) {
      return r2 ? r2._promise(null, (t3, n3) => {
        n3(e3);
      }) : ht(e3);
    }
    const a2 = Pn.bind(null, this, i2, o2, r2, n2);
    return r2 ? r2._promise(i2, a2, "lock") : Ke.trans ? ot(Ke.transless, () => this._whenReady(a2)) : this._whenReady(a2);
  }
  table(e2) {
    if (!o(this._allTables, e2))
      throw new X.InvalidTable(`Table ${e2} does not exist`);
    return this._allTables[e2];
  }
}
const Un = "undefined" != typeof Symbol && "observable" in Symbol ? Symbol.observable : "@@observable";
class Ln {
  constructor(e2) {
    this._subscribe = e2;
  }
  subscribe(e2, t2, n2) {
    return this._subscribe(e2 && "function" != typeof e2 ? e2 : { next: e2, error: t2, complete: n2 });
  }
  [Un]() {
    return this;
  }
}
function Vn(e2, n2) {
  return t(n2).forEach((t2) => {
    Tn(e2[t2] || (e2[t2] = new In()), n2[t2]);
  }), e2;
}
function Wn(e2) {
  return new Ln((n2) => {
    const r2 = T(e2);
    let s2 = false, i2 = {}, o2 = {};
    const a2 = { get closed() {
      return s2;
    }, unsubscribe: () => {
      s2 = true, Ht.storagemutated.unsubscribe(h2);
    } };
    n2.start && n2.start(a2);
    let u2 = false, l2 = false;
    function c2() {
      return t(o2).some((e3) => i2[e3] && Rn(i2[e3], o2[e3]));
    }
    const h2 = (e3) => {
      Vn(i2, e3), c2() && d2();
    }, d2 = () => {
      if (u2 || s2)
        return;
      i2 = {};
      const t2 = {}, f2 = function(t3) {
        r2 && Ze();
        const n3 = () => Je(e2, { subscr: t3, trans: null }), s3 = Ke.trans ? ot(Ke.transless, n3) : n3();
        return r2 && s3.then(et, et), s3;
      }(t2);
      l2 || (Ht("storagemutated", h2), l2 = true), u2 = true, Promise.resolve(f2).then((e3) => {
        u2 = false, s2 || (c2() ? d2() : (i2 = {}, o2 = t2, n2.next && n2.next(e3)));
      }, (e3) => {
        u2 = false, n2.error && n2.error(e3), a2.unsubscribe();
      });
    };
    return d2(), a2;
  });
}
let Yn;
try {
  Yn = { indexedDB: e.indexedDB || e.mozIndexedDB || e.webkitIndexedDB || e.msIndexedDB, IDBKeyRange: e.IDBKeyRange || e.webkitIDBKeyRange };
} catch (e2) {
  Yn = { indexedDB: null, IDBKeyRange: null };
}
const zn = $n;
function Gn(e2) {
  let t2 = Hn;
  try {
    Hn = true, Ht.storagemutated.fire(e2);
  } finally {
    Hn = t2;
  }
}
a(zn, { ...Z, delete: (e2) => new zn(e2, { addons: [] }).delete(), exists: (e2) => new zn(e2, { addons: [] }).open().then((e3) => (e3.close(), true)).catch("NoSuchDatabaseError", () => false), getDatabaseNames(e2) {
  try {
    return function({ indexedDB: e3, IDBKeyRange: t2 }) {
      return bn(e3) ? Promise.resolve(e3.databases()).then((e4) => e4.map((e5) => e5.name).filter((e5) => "__dbnames" !== e5)) : gn(e3, t2).toCollection().primaryKeys();
    }(zn.dependencies).then(e2);
  } catch (e3) {
    return ht(new X.MissingAPI());
  }
}, defineClass: () => function(e2) {
  r(this, e2);
}, ignoreTransaction: (e2) => Ke.trans ? ot(Ke.transless, e2) : e2(), vip: _n, async: function(e2) {
  return function() {
    try {
      var t2 = kn(e2.apply(this, arguments));
      return t2 && "function" == typeof t2.then ? t2 : Ce.resolve(t2);
    } catch (e3) {
      return ht(e3);
    }
  };
}, spawn: function(e2, t2, n2) {
  try {
    var r2 = kn(e2.apply(n2, t2 || []));
    return r2 && "function" == typeof r2.then ? r2 : Ce.resolve(r2);
  } catch (e3) {
    return ht(e3);
  }
}, currentTransaction: { get: () => Ke.trans || null }, waitFor: function(e2, t2) {
  const n2 = Ce.resolve("function" == typeof e2 ? zn.ignoreTransaction(e2) : e2).timeout(t2 || 6e4);
  return Ke.trans ? Ke.trans.waitFor(n2) : n2;
}, Promise: Ce, debug: { get: () => R, set: (e2) => {
  F(e2, "dexie" === e2 ? () => true : bt);
} }, derive: c, extend: r, props: a, override: y, Events: Et, on: Ht, liveQuery: Wn, extendObservabilitySet: Vn, getByKeyPath: b, setByKeyPath: _, delByKeyPath: function(e2, t2) {
  "string" == typeof t2 ? _(e2, t2, void 0) : "length" in t2 && [].map.call(t2, function(t3) {
    _(e2, t3, void 0);
  });
}, shallowClone: w, deepClone: O, getObjectDiff: Sn, cmp: It, asap: v, minKey: -(1 / 0), addons: [], connections: yt, errnames: H, dependencies: Yn, semVer: "3.2.3", version: "3.2.3".split(".").map((e2) => parseInt(e2)).reduce((e2, t2, n2) => e2 + t2 / Math.pow(10, 2 * n2)) }), zn.maxKey = en(zn.dependencies.IDBKeyRange), "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (Ht("storagemutated", (e2) => {
  if (!Hn) {
    let t2;
    t2 = new CustomEvent("x-storagemutated-1", { detail: e2 }), Hn = true, dispatchEvent(t2), Hn = false;
  }
}), addEventListener("x-storagemutated-1", ({ detail: e2 }) => {
  Hn || Gn(e2);
}));
let Hn = false;
if ("undefined" != typeof BroadcastChannel) {
  const e2 = new BroadcastChannel("x-storagemutated-1");
  "function" == typeof e2.unref && e2.unref(), Ht("storagemutated", (t2) => {
    Hn || e2.postMessage(t2);
  }), e2.onmessage = (e3) => {
    e3.data && Gn(e3.data);
  };
} else if ("undefined" != typeof self && false) {
  Ht("storagemutated", (e3) => {
    try {
      Hn || ("undefined" != typeof localStorage && localStorage.setItem("x-storagemutated-1", JSON.stringify({ trig: Math.random(), changedParts: e3 })), "object" == typeof self.clients && [...self.clients.matchAll({ includeUncontrolled: true })].forEach((t2) => t2.postMessage({ type: "x-storagemutated-1", changedParts: e3 })));
    } catch (e4) {
    }
  }), "undefined" != typeof addEventListener && addEventListener("storage", (e3) => {
    if ("x-storagemutated-1" === e3.key) {
      const t2 = JSON.parse(e3.newValue);
      t2 && Gn(t2.changedParts);
    }
  });
  const e2 = self.document && navigator.serviceWorker;
  e2 && e2.addEventListener("message", function({ data: e3 }) {
    e3 && "x-storagemutated-1" === e3.type && Gn(e3.changedParts);
  });
}
Ce.rejectionMapper = function(e2, t2) {
  if (!e2 || e2 instanceof W || e2 instanceof TypeError || e2 instanceof SyntaxError || !e2.name || !J[e2.name])
    return e2;
  var n2 = new J[e2.name](t2 || e2.message, e2);
  return "stack" in e2 && l(n2, "stack", { get: function() {
    return this.inner.stack;
  } }), n2;
}, F(R, bt);
function useIDB(options) {
  const isStorageDisabled = useState(() => false, "$bCnfMlhiEw");
  if (options == null ? void 0 : options.disableStorage) {
    isStorageDisabled.value = true;
  }
  const isStorageAvailable = () => {
    if (isStorageDisabled.value) {
      return false;
    }
    try {
      const x2 = "__storage_test__";
      localStorage.setItem(x2, x2);
      localStorage.removeItem(x2);
      const db = new $n("test");
      db.version(1).stores({
        test: "id"
      });
      return true;
    } catch (e2) {
      return false;
    }
  };
  if (isStorageAvailable() && false) {
    const db = new $n("gepeto");
    db.version(3).stores({
      knowledge: "id, title, type, sections, metadata, updatedAt, createdAt",
      conversations: "id, title, messages, metadata, settings, createdAt, updatedAt",
      personas: "id, title, instructions"
    });
    return db;
  } else {
    return {
      table: (tableName) => {
        const state = useState(`idb-${tableName}`, () => []);
        return {
          async add(item) {
            state.value.push(item);
            return item.id;
          },
          async delete(id) {
            state.value = state.value.filter((item) => item.id !== id);
          },
          async toArray() {
            return state.value;
          },
          async get(id) {
            return state.value.find((item) => item.id === id);
          },
          async put(item) {
            const index = state.value.findIndex((i2) => i2.id === item.id);
            state.value[index] = item;
          },
          async clear() {
            state.value = [];
          }
        };
      }
    };
  }
}
function customFetch(input, init) {
  return globalThis.$fetch.raw(input.toString(), init).catch((e2) => {
    if (e2 instanceof FetchError && e2.response) {
      return e2.response;
    }
    throw e2;
  }).then((response) => ({
    ...response,
    json: () => Promise.resolve(response._data)
  }));
}
function httpBatchLink(opts) {
  const headers = useRequestHeaders(opts == null ? void 0 : opts.pickHeaders);
  return httpBatchLink$1({
    url: "/api/trpc",
    headers() {
      return headers;
    },
    fetch: customFetch,
    ...opts
  });
}
function getQueryKey(path, input) {
  return input === void 0 ? path : `${path}-${hash(input || "")}`;
}
function createNuxtProxyDecoration(name, client) {
  return createRecursiveProxy((opts) => {
    const args = opts.args;
    const pathCopy = [name, ...opts.path];
    const lastArg = pathCopy.pop();
    const path = pathCopy.join(".");
    const [input, otherOptions] = args;
    if (lastArg === "useQuery") {
      const { trpc, ...asyncDataOptions } = otherOptions || {};
      let controller;
      if (trpc == null ? void 0 : trpc.abortOnUnmount) {
        if (getCurrentInstance()) {
          onScopeDispose(() => {
            var _a;
            (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller);
          });
        }
        controller = typeof AbortController !== "undefined" ? new AbortController() : {};
      }
      const queryKey = getQueryKey(path, input);
      return useAsyncData(queryKey, () => client[path].query(input, {
        signal: controller == null ? void 0 : controller.signal,
        ...trpc
      }), asyncDataOptions);
    }
    return client[path][lastArg](...args);
  });
}
function createTRPCNuxtClient(opts) {
  const client = createTRPCProxyClient(opts);
  const decoratedClient = createFlatProxy((key) => {
    return createNuxtProxyDecoration(key, client);
  });
  return decoratedClient;
}
function useClient() {
  const client = createTRPCNuxtClient({
    links: [
      httpBatchLink({
        url: "/api/trpc"
      })
    ]
  });
  return client;
}
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
const logger = consola.create({
  level: 3
});
function useDeta() {
  const idb = useIDB();
  const client = useClient();
  const isDetaEnabled = useState("is-deta-enabled", () => false);
  const deta = {
    conversation: {
      async get(id) {
        const result = await client.deta.conversations.get.query({ id });
        return parseDateFields(result, ["updatedAt", "createdAt"]);
      },
      async create(conversation) {
        logger.info("Creating conversation", conversation);
        return await client.deta.conversations.create.mutate(conversation);
      },
      async update(conversation) {
        logger.info("Updating conversation", conversation);
        return await client.deta.conversations.update.mutate(conversation);
      },
      async delete(id) {
        const res = await client.deta.conversations.delete.mutate({ id });
        const conversationMessageList = await client.deta.messages.list.query({ conversationId: id });
        const messageIds = conversationMessageList.map((item) => item.id);
        const limit = pLimit(10);
        await Promise.all(messageIds.map((id2) => limit(() => client.deta.messages.delete.mutate({ id: id2 }))));
        logger.info("Deleted conversation", id, "and", messageIds.length, "messages");
        return res;
      },
      async list() {
        const conversations = await client.deta.conversations.list.query();
        return conversations.map((conversation) => parseDateFields(conversation, ["updatedAt", "createdAt"]));
      },
      async sync(id) {
        const conversation = await deta.conversation.get(id);
        if (!conversation) {
          throw new DetaError(`Conversation not found with id ${id}`, "NOT_FOUND");
        }
        const messages = await client.deta.messages.list.query({ conversationId: id });
        const localConversation = await idb.table("conversations").get(id);
        const newConversation = {
          id: conversation.key,
          title: conversation.title,
          updatedAt: conversation.updatedAt,
          createdAt: conversation.createdAt,
          metadata: conversation.metadata,
          messages: messages.map((message) => parseDateFields(message, ["updatedAt", "createdAt"]))
        };
        if (!localConversation) {
          logger.info("Creating conversation", newConversation.id);
          await idb.table("conversations").add(newConversation);
        } else {
          logger.info("Updating conversation", newConversation.id);
          try {
            await idb.table("conversations").put(newConversation);
          } catch (e2) {
            logger.error(e2);
          }
        }
      }
    },
    message: {
      async get(id) {
        return await client.deta.messages.get.query({ id });
      },
      async create(message) {
        logger.info("Creating message", message.id);
        return await client.deta.messages.create.mutate(message);
      },
      update: async (message) => {
        logger.info("Updating message", message.id);
        return await client.deta.messages.update.mutate(message);
      },
      delete: async (id) => {
        logger.info("Deleting message", id);
        return await client.deta.messages.delete.mutate({ id });
      }
    }
  };
  return {
    isDetaEnabled,
    deta
  };
}
class DetaError extends Error {
  constructor(message, code) {
    super(message);
    __publicField(this, "code", null);
    this.code = code;
  }
}
const deta_NFUzLzz35f = /* @__PURE__ */ defineNuxtPlugin(async () => {
  {
    const { isDetaEnabled } = useDeta();
    const { detaKey } = /* @__PURE__ */ useRuntimeConfig();
    isDetaEnabled.value = Boolean(detaKey);
  }
});
const environment_variable_wXVLHVvJ8P = /* @__PURE__ */ defineNuxtPlugin(() => {
  {
    const { apiKey: apiKeyFromEnv, password } = /* @__PURE__ */ useRuntimeConfig();
    const { isPasswordRequired, instanceApiKey } = useSettings();
    const { isLoggedIn } = useSession();
    if (apiKeyFromEnv) {
      instanceApiKey.value = apiKeyFromEnv;
    }
    if (password) {
      isPasswordRequired.value = true;
      isLoggedIn.value = String(useCookie("golem-password").value) === String(password);
    }
  }
});
const floating_vue_BiOD74u9sH = /* @__PURE__ */ defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(FloatingVue);
});
const _plugins = [
  components_plugin_KR1HBZs4kY,
  unhead_9tcJ5oXlw4,
  vueuse_head_polyfill_oWMPyXAnDP,
  router_Horn1BEOMy,
  plugin_server_RWfeesXBQZ,
  unocss_MzCDxu9LMj,
  deta_NFUzLzz35f,
  environment_variable_wXVLHVvJ8P,
  floating_vue_BiOD74u9sH
];
const Fragment = /* @__PURE__ */ defineComponent({
  name: "FragmentWrapper",
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h$1(component, props === true ? {} : props, slots) : h$1(Fragment, {}, slots) };
};
const layouts = {
  blank: () => import('./_nuxt/blank-72e031ed.mjs').then((m2) => m2.default || m2),
  default: () => import('./_nuxt/default-2d676d15.mjs').then((m2) => m2.default || m2)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r2) => r2.default || r2);
    return () => {
      return h$1(LayoutComponent, context.attrs, context.slots);
    };
  }
});
const __nuxt_component_0 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && {
          key: layout.value,
          name: layout.value,
          ...{},
          ...context.attrs
        }, context.slots).default()
      }).default();
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r2) => {
    var _a;
    return ((_a = route.params[r2.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m2) => {
    var _a;
    return ((_a = m2.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_1 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h$1(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h$1(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h$1(RouteProvider, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  // TODO: Type props
  // eslint-disable-next-line vue/require-prop-types
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h$1(props.routeProps.Component);
    };
  }
});
function useDevice() {
  const breakpoint = useBreakpoints(breakpointsTailwind);
  const isSmallDesktop = breakpoint.smallerOrEqual("lg");
  const isMobile = breakpoint.smallerOrEqual("sm");
  const isMobileSafari = (() => {
    const headers = useRequestHeaders()["user-agent"] || "";
    return headers.includes("iPhone") || headers.includes("iPad");
  })();
  return {
    isMobile,
    isSmallDesktop,
    isMobileSafari
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Golem",
      meta: [
        { name: "description", content: "Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT." },
        { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1" },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" }
      ],
      link: [
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "150x150", href: "/mstile-150x150.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "256x256", href: "/android-chrome-256x256.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" }
      ]
    });
    const { isMobileSafari } = useDevice();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        relative: "",
        "overflow-hidden": "",
        "h-100vh": "",
        "w-screen": "",
        class: [
          unref(isMobileSafari) && "!h-100dvh"
        ]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, { "h-full": "" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage, { "h-full": "" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-component-567f80f5.mjs').then((r2) => r2.default || r2));
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/island-renderer-0bc02508.mjs').then((r2) => r2.default || r2));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p2 = callWithNuxt(nuxtApp, showError, [err]);
        onServerPrefetch(() => p2);
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$1), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/nuxt@3.3.1_eslint@8.36.0_typescript@4.9.5/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { useDevice as a, useElementHover as b, createError as c, onClickOutside as d, entry$1 as default, useIDB as e, useState as f, useDeta as g, useSettings as h, useSession as i, useClient as j, useCookie as k, logger as l, useMouseInElement as m, navigateTo as n, onLongPress as o, useTransition as p, useDebounceFn as q, useStorage as r, useRouter as s, useHead as t, useRoute as u };
//# sourceMappingURL=server.mjs.map
