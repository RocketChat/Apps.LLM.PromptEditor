globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=31536000, immutable"}}}},"public":{"pwaManifest":{"name":"Golem","short_name":"","description":"Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.","lang":"en","start_url":"/?standalone=true","display":"standalone","background_color":"#f5f5f5","theme_color":"#3f3f3f","icons":[{"src":"/_nuxt/icons/64x64.02df9a4b.png","type":"image/png","sizes":"64x64","purpose":"any"},{"src":"/_nuxt/icons/64x64.maskable.02df9a4b.png","type":"image/png","sizes":"64x64","purpose":"maskable"},{"src":"/_nuxt/icons/120x120.02df9a4b.png","type":"image/png","sizes":"120x120","purpose":"any"},{"src":"/_nuxt/icons/120x120.maskable.02df9a4b.png","type":"image/png","sizes":"120x120","purpose":"maskable"},{"src":"/_nuxt/icons/144x144.02df9a4b.png","type":"image/png","sizes":"144x144","purpose":"any"},{"src":"/_nuxt/icons/144x144.maskable.02df9a4b.png","type":"image/png","sizes":"144x144","purpose":"maskable"},{"src":"/_nuxt/icons/152x152.02df9a4b.png","type":"image/png","sizes":"152x152","purpose":"any"},{"src":"/_nuxt/icons/152x152.maskable.02df9a4b.png","type":"image/png","sizes":"152x152","purpose":"maskable"},{"src":"/_nuxt/icons/192x192.02df9a4b.png","type":"image/png","sizes":"192x192","purpose":"any"},{"src":"/_nuxt/icons/192x192.maskable.02df9a4b.png","type":"image/png","sizes":"192x192","purpose":"maskable"},{"src":"/_nuxt/icons/384x384.02df9a4b.png","type":"image/png","sizes":"384x384","purpose":"any"},{"src":"/_nuxt/icons/384x384.maskable.02df9a4b.png","type":"image/png","sizes":"384x384","purpose":"maskable"},{"src":"/_nuxt/icons/512x512.02df9a4b.png","type":"image/png","sizes":"512x512","purpose":"any"},{"src":"/_nuxt/icons/512x512.maskable.02df9a4b.png","type":"image/png","sizes":"512x512","purpose":"maskable"}],"categories":["productivity","education"],"id":"golem-1717710108887"}},"detaKey":"","apiKey":"","password":""};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
overrideConfig(_runtimeConfig);
const runtimeConfig = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => runtimeConfig;
deepFreeze(appConfig);
function getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "\"use strict\";const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _tp7CM1S2NL = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const _p5QfurhTuB = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(
      [
        "<script>",
        "if ('serviceWorker' in navigator) {",
        `  window.addEventListener('load', () => navigator.serviceWorker.register('${joinURL(useRuntimeConfig().app.baseURL, "sw.js")}'))`,
        "}",
        "<\/script>"
      ].join("\n")
    );
  });
});

const plugins = [
  _tp7CM1S2NL,
_p5QfurhTuB
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/.gitignore": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"5-WR6OC9f2qzRgXj32kB34g2obNs0\"",
    "mtime": "2024-06-06T21:41:55.934Z",
    "size": 5,
    "path": "../public/.gitignore"
  },
  "/android-chrome-192x192.png": {
    "type": "image/png",
    "etag": "\"4b93-88NjVcTRQvyUGhIQz34nNpcKIXE\"",
    "mtime": "2024-06-06T21:41:55.934Z",
    "size": 19347,
    "path": "../public/android-chrome-192x192.png"
  },
  "/android-chrome-256x256.png": {
    "type": "image/png",
    "etag": "\"2fb0-9a+vAHN8fjaRve3y5CLKBvpAKhk\"",
    "mtime": "2024-06-06T21:41:55.933Z",
    "size": 12208,
    "path": "../public/android-chrome-256x256.png"
  },
  "/android-chrome-512x512.png": {
    "type": "image/png",
    "etag": "\"1a2b2-oA7LcIrFGij3BnxiJQlNer6ljsk\"",
    "mtime": "2024-06-06T21:41:55.933Z",
    "size": 107186,
    "path": "../public/android-chrome-512x512.png"
  },
  "/apple-touch-icon.png": {
    "type": "image/png",
    "etag": "\"4454-KheNDQM/9rrzVtk2j0eVK2nDvvU\"",
    "mtime": "2024-06-06T21:41:55.933Z",
    "size": 17492,
    "path": "../public/apple-touch-icon.png"
  },
  "/browserconfig.xml": {
    "type": "application/xml",
    "etag": "\"f6-l0rqGL2lqVgCwGuAEmqx2W2R1wg\"",
    "mtime": "2024-06-06T21:41:55.933Z",
    "size": 246,
    "path": "../public/browserconfig.xml"
  },
  "/favicon-16x16.png": {
    "type": "image/png",
    "etag": "\"2d7-TfYtL55rxih0qWzhivW1VUgSQ+Q\"",
    "mtime": "2024-06-06T21:41:55.932Z",
    "size": 727,
    "path": "../public/favicon-16x16.png"
  },
  "/favicon-32x32.png": {
    "type": "image/png",
    "etag": "\"713-wpXRourmcPcPqXSORp4pUZ0aWWY\"",
    "mtime": "2024-06-06T21:41:55.932Z",
    "size": 1811,
    "path": "../public/favicon-32x32.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3c2e-C7Z7MdzOa1MOfW3UpgSpfvjVdvY\"",
    "mtime": "2024-06-06T21:41:55.932Z",
    "size": 15406,
    "path": "../public/favicon.ico"
  },
  "/mstile-150x150.png": {
    "type": "image/png",
    "etag": "\"15ba-19xsGPVO8npUcASHP+uoC//c3tI\"",
    "mtime": "2024-06-06T21:41:55.928Z",
    "size": 5562,
    "path": "../public/mstile-150x150.png"
  },
  "/og-image.png": {
    "type": "image/png",
    "etag": "\"908c7-74+67/Xr193247tnXWBRArrCYEo\"",
    "mtime": "2024-06-06T21:41:55.927Z",
    "size": 592071,
    "path": "../public/og-image.png"
  },
  "/safari-pinned-tab.svg": {
    "type": "image/svg+xml",
    "etag": "\"83c-0pFpoVoIV5xfAVBHbssdx/DX+Y0\"",
    "mtime": "2024-06-06T21:41:55.925Z",
    "size": 2108,
    "path": "../public/safari-pinned-tab.svg"
  },
  "/site.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"107-vzG6+RvdL83iSkXj8qG+M3M8b2k\"",
    "mtime": "2024-06-06T21:41:55.808Z",
    "size": 263,
    "path": "../public/site.webmanifest"
  },
  "/sw.js": {
    "type": "application/javascript",
    "etag": "\"74c-q6ZUupOHV3VA4ZYNGoehNHZTiP8\"",
    "mtime": "2024-06-06T21:41:55.779Z",
    "size": 1868,
    "path": "../public/sw.js"
  },
  "/_nuxt/_conversationId_.0212db4b.js": {
    "type": "application/javascript",
    "etag": "\"686-P1wJVg8zV3B3hcp0Q0x7jEpkq8E\"",
    "mtime": "2024-06-06T21:41:55.808Z",
    "size": 1670,
    "path": "../public/_nuxt/_conversationId_.0212db4b.js"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2024-06-06T21:41:55.808Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/_nuxt/api-key.aa3a8734.js": {
    "type": "application/javascript",
    "etag": "\"99d-0CeqAgnm9a8xWPoKTSPnLi+e/hk\"",
    "mtime": "2024-06-06T21:41:55.808Z",
    "size": 2461,
    "path": "../public/_nuxt/api-key.aa3a8734.js"
  },
  "/_nuxt/app-navbar-mobile.642180e8.js": {
    "type": "application/javascript",
    "etag": "\"536-mB5EyqCavaYKWC7Bhdw9+mIrH/k\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 1334,
    "path": "../public/_nuxt/app-navbar-mobile.642180e8.js"
  },
  "/_nuxt/appearance.b78caab1.js": {
    "type": "application/javascript",
    "etag": "\"47a6-LIWuiTc7kJ4J4gUMCBUlVpe/vMQ\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 18342,
    "path": "../public/_nuxt/appearance.b78caab1.js"
  },
  "/_nuxt/blank.afbc776a.js": {
    "type": "application/javascript",
    "etag": "\"329-B0zVQx0Ultc/siqhBxKAEk31KVs\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 809,
    "path": "../public/_nuxt/blank.afbc776a.js"
  },
  "/_nuxt/button.vue.62ed5eac.js": {
    "type": "application/javascript",
    "etag": "\"6cc-iTQPxqmg8OXaNkURFEWbXGnKSDc\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 1740,
    "path": "../public/_nuxt/button.vue.62ed5eac.js"
  },
  "/_nuxt/client-only.06d0591e.js": {
    "type": "application/javascript",
    "etag": "\"52a-dP9dDkOqkF3iCbBXjntjGrB6B+s\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 1322,
    "path": "../public/_nuxt/client-only.06d0591e.js"
  },
  "/_nuxt/composables.895f1fb5.js": {
    "type": "application/javascript",
    "etag": "\"5a-pe1ZL8KY4a0MRSgyT9Z0BfgIyuQ\"",
    "mtime": "2024-06-06T21:41:55.807Z",
    "size": 90,
    "path": "../public/_nuxt/composables.895f1fb5.js"
  },
  "/_nuxt/conversation-tab.1080a7df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"37-nFggZVfJBG1GgXOI7kv8Tp1dSoA\"",
    "mtime": "2024-06-06T21:41:55.806Z",
    "size": 55,
    "path": "../public/_nuxt/conversation-tab.1080a7df.css"
  },
  "/_nuxt/conversation-tab.220cdddd.js": {
    "type": "application/javascript",
    "etag": "\"f50-c0+pe+vwUsblJjBHDiZy03/5GPI\"",
    "mtime": "2024-06-06T21:41:55.806Z",
    "size": 3920,
    "path": "../public/_nuxt/conversation-tab.220cdddd.js"
  },
  "/_nuxt/conversation.a2f82f2b.js": {
    "type": "application/javascript",
    "etag": "\"168bf2-0DaWZqZH9ByEej/H2WlJLEqRXNM\"",
    "mtime": "2024-06-06T21:41:55.805Z",
    "size": 1477618,
    "path": "../public/_nuxt/conversation.a2f82f2b.js"
  },
  "/_nuxt/default.31babd7f.js": {
    "type": "application/javascript",
    "etag": "\"bc2-RvO3CxKLS2g+/sl8Mg8uP1LxwEY\"",
    "mtime": "2024-06-06T21:41:55.804Z",
    "size": 3010,
    "path": "../public/_nuxt/default.31babd7f.js"
  },
  "/_nuxt/deta.20fc44af.js": {
    "type": "application/javascript",
    "etag": "\"496-xs5yX4izPB87lx/Yi9a55b4rg6E\"",
    "mtime": "2024-06-06T21:41:55.804Z",
    "size": 1174,
    "path": "../public/_nuxt/deta.20fc44af.js"
  },
  "/_nuxt/entry.1008e4b1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"183a5-WfQbGnZ9RrsMJMuqwMy9pmiA6WY\"",
    "mtime": "2024-06-06T21:41:55.803Z",
    "size": 99237,
    "path": "../public/_nuxt/entry.1008e4b1.css"
  },
  "/_nuxt/entry.3cc83cf9.js": {
    "type": "application/javascript",
    "etag": "\"4f603-FR5aQW3Nt+LuMNXSx5ZYHBE9ubs\"",
    "mtime": "2024-06-06T21:41:55.803Z",
    "size": 325123,
    "path": "../public/_nuxt/entry.3cc83cf9.js"
  },
  "/_nuxt/error-404.8927d478.js": {
    "type": "application/javascript",
    "etag": "\"195a-tAsasSWCWLRM6Fb+1KkWXTCgh+4\"",
    "mtime": "2024-06-06T21:41:55.803Z",
    "size": 6490,
    "path": "../public/_nuxt/error-404.8927d478.js"
  },
  "/_nuxt/error-404.dd29d79a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-JYQmAncl9ODY78yRqUt9FOyUmA4\"",
    "mtime": "2024-06-06T21:41:55.802Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.dd29d79a.css"
  },
  "/_nuxt/error-500.02bce5ae.js": {
    "type": "application/javascript",
    "etag": "\"78e-cTClRpQUcI5YUTUGrZ7Rx1Pwm0Y\"",
    "mtime": "2024-06-06T21:41:55.802Z",
    "size": 1934,
    "path": "../public/_nuxt/error-500.02bce5ae.js"
  },
  "/_nuxt/error-500.26873dcc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-fa2OB1jZnGuSyj7jz6LP6nKsFoY\"",
    "mtime": "2024-06-06T21:41:55.802Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.26873dcc.css"
  },
  "/_nuxt/error-component.f969b354.js": {
    "type": "application/javascript",
    "etag": "\"4bf-i4+MnoEeAB6FjAsN1967I/xmH5A\"",
    "mtime": "2024-06-06T21:41:55.802Z",
    "size": 1215,
    "path": "../public/_nuxt/error-component.f969b354.js"
  },
  "/_nuxt/history.c0891781.js": {
    "type": "application/javascript",
    "etag": "\"776-GPj4qHYeWOhyCz7OtEcFkz98XX8\"",
    "mtime": "2024-06-06T21:41:55.801Z",
    "size": 1910,
    "path": "../public/_nuxt/history.c0891781.js"
  },
  "/_nuxt/index.83d3a98a.js": {
    "type": "application/javascript",
    "etag": "\"90-rro8WC2e/0lJdWi3qj6jhwcKjPk\"",
    "mtime": "2024-06-06T21:41:55.801Z",
    "size": 144,
    "path": "../public/_nuxt/index.83d3a98a.js"
  },
  "/_nuxt/index.browser.7e542916.js": {
    "type": "application/javascript",
    "etag": "\"b8-FaJuNHgvJT6Ygtqxqt0p9fuKGNk\"",
    "mtime": "2024-06-06T21:41:55.801Z",
    "size": 184,
    "path": "../public/_nuxt/index.browser.7e542916.js"
  },
  "/_nuxt/index.c306efd7.js": {
    "type": "application/javascript",
    "etag": "\"357-06ij7Za5rJL7ckdTKDyWwCFWXZ0\"",
    "mtime": "2024-06-06T21:41:55.801Z",
    "size": 855,
    "path": "../public/_nuxt/index.c306efd7.js"
  },
  "/_nuxt/index.ce3528c8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"215-S/3wRGIH2X2tDdfFXxdsy47Yeno\"",
    "mtime": "2024-06-06T21:41:55.801Z",
    "size": 533,
    "path": "../public/_nuxt/index.ce3528c8.css"
  },
  "/_nuxt/index.da28dbfc.js": {
    "type": "application/javascript",
    "etag": "\"727-A8Bs5lqc/7OFZEuDeQfNllYxFuk\"",
    "mtime": "2024-06-06T21:41:55.800Z",
    "size": 1831,
    "path": "../public/_nuxt/index.da28dbfc.js"
  },
  "/_nuxt/index.e1323437.js": {
    "type": "application/javascript",
    "etag": "\"357-06ij7Za5rJL7ckdTKDyWwCFWXZ0\"",
    "mtime": "2024-06-06T21:41:55.800Z",
    "size": 855,
    "path": "../public/_nuxt/index.e1323437.js"
  },
  "/_nuxt/index.f202e0a5.js": {
    "type": "application/javascript",
    "etag": "\"55d4-YmL7lg05SiN9rCBpuK+lh9hjcFw\"",
    "mtime": "2024-06-06T21:41:55.800Z",
    "size": 21972,
    "path": "../public/_nuxt/index.f202e0a5.js"
  },
  "/_nuxt/index.vue.01d39d70.js": {
    "type": "application/javascript",
    "etag": "\"22e01-nRz7Z+7TFe1HZkratIxcIT20RT4\"",
    "mtime": "2024-06-06T21:41:55.800Z",
    "size": 142849,
    "path": "../public/_nuxt/index.vue.01d39d70.js"
  },
  "/_nuxt/input.vue.0d9c8040.js": {
    "type": "application/javascript",
    "etag": "\"408-T/nr0VhSnlzcF8sXqyNw3bL8HyQ\"",
    "mtime": "2024-06-06T21:41:55.799Z",
    "size": 1032,
    "path": "../public/_nuxt/input.vue.0d9c8040.js"
  },
  "/_nuxt/knowledge.c257fbc9.js": {
    "type": "application/javascript",
    "etag": "\"648-P72xkym6l9xPyoHOrimnsqHVt3s\"",
    "mtime": "2024-06-06T21:41:55.799Z",
    "size": 1608,
    "path": "../public/_nuxt/knowledge.c257fbc9.js"
  },
  "/_nuxt/language-model.c5e8ba07.js": {
    "type": "application/javascript",
    "etag": "\"e8d3-D6XvPftPd6rd1L8ObI2BnWvgM5I\"",
    "mtime": "2024-06-06T21:41:55.799Z",
    "size": 59603,
    "path": "../public/_nuxt/language-model.c5e8ba07.js"
  },
  "/_nuxt/link.vue.7e87621e.js": {
    "type": "application/javascript",
    "etag": "\"16e-Q6K/fY7VEt/szPA8eFhKx6Lm6WQ\"",
    "mtime": "2024-06-06T21:41:55.799Z",
    "size": 366,
    "path": "../public/_nuxt/link.vue.7e87621e.js"
  },
  "/_nuxt/local-storage-ref.b5ec8d15.js": {
    "type": "application/javascript",
    "etag": "\"87-qx3ak+KIUcsO+ae9Nd6nHRTBfjM\"",
    "mtime": "2024-06-06T21:41:55.798Z",
    "size": 135,
    "path": "../public/_nuxt/local-storage-ref.b5ec8d15.js"
  },
  "/_nuxt/long-press-button.575abe54.js": {
    "type": "application/javascript",
    "etag": "\"794-EvKryW56SimqNBEImBoUSdf5/AM\"",
    "mtime": "2024-06-06T21:41:55.798Z",
    "size": 1940,
    "path": "../public/_nuxt/long-press-button.575abe54.js"
  },
  "/_nuxt/long-press-button.923ee76b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"59-6pjOZ3VAkVeuwhp9iXXvP49uzTM\"",
    "mtime": "2024-06-06T21:41:55.798Z",
    "size": 89,
    "path": "../public/_nuxt/long-press-button.923ee76b.css"
  },
  "/_nuxt/model.e97a0ef7.js": {
    "type": "application/javascript",
    "etag": "\"7bf-2Qf3Ekrn1T5+vLP3XSaEKIcOaiU\"",
    "mtime": "2024-06-06T21:41:55.798Z",
    "size": 1983,
    "path": "../public/_nuxt/model.e97a0ef7.js"
  },
  "/_nuxt/password.5b87fb9c.js": {
    "type": "application/javascript",
    "etag": "\"c4a-VcG7HSF7PKNH2VDwQCaWMJDZu4g\"",
    "mtime": "2024-06-06T21:41:55.798Z",
    "size": 3146,
    "path": "../public/_nuxt/password.5b87fb9c.js"
  },
  "/_nuxt/persona.78db4550.js": {
    "type": "application/javascript",
    "etag": "\"34b-lNZyWmddMYMy08EMgnx9xvZIARE\"",
    "mtime": "2024-06-06T21:41:55.797Z",
    "size": 843,
    "path": "../public/_nuxt/persona.78db4550.js"
  },
  "/_nuxt/personas.07bb6976.js": {
    "type": "application/javascript",
    "etag": "\"3ab-uiWx3qZJI+fulZGwefLtL0bmkAY\"",
    "mtime": "2024-06-06T21:41:55.797Z",
    "size": 939,
    "path": "../public/_nuxt/personas.07bb6976.js"
  },
  "/_nuxt/settings.2d3b326a.js": {
    "type": "application/javascript",
    "etag": "\"8da-cZYE6UwymHIHiC4/lGLFnnZGKf8\"",
    "mtime": "2024-06-06T21:41:55.797Z",
    "size": 2266,
    "path": "../public/_nuxt/settings.2d3b326a.js"
  },
  "/_nuxt/setup.0f062202.js": {
    "type": "application/javascript",
    "etag": "\"7fc-ujbCaLFUyNuQVbGgynHeOt2/YRE\"",
    "mtime": "2024-06-06T21:41:55.797Z",
    "size": 2044,
    "path": "../public/_nuxt/setup.0f062202.js"
  },
  "/_nuxt/setup.7bd32f24.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9b-rHw/FYRu1vHEIS3o1UxsbUq68OI\"",
    "mtime": "2024-06-06T21:41:55.797Z",
    "size": 155,
    "path": "../public/_nuxt/setup.7bd32f24.css"
  },
  "/_nuxt/shiki.62655d8c.js": {
    "type": "application/javascript",
    "etag": "\"483-uuqpWdQ1q++UCsQBD1iZZNU3IkM\"",
    "mtime": "2024-06-06T21:41:55.796Z",
    "size": 1155,
    "path": "../public/_nuxt/shiki.62655d8c.js"
  },
  "/_nuxt/shiki.95612873.js": {
    "type": "application/javascript",
    "etag": "\"191a5-w3VvaF0aYqdIrho+3lI9t03lwOM\"",
    "mtime": "2024-06-06T21:41:55.796Z",
    "size": 102821,
    "path": "../public/_nuxt/shiki.95612873.js"
  },
  "/_nuxt/sk.af4ad047.js": {
    "type": "application/javascript",
    "etag": "\"289-D9knJSS1j0cBZvVDPAv7RHJ2IQE\"",
    "mtime": "2024-06-06T21:41:55.796Z",
    "size": 649,
    "path": "../public/_nuxt/sk.af4ad047.js"
  },
  "/_nuxt/skeleton.46954ab9.js": {
    "type": "application/javascript",
    "etag": "\"11a-BKlIwyVq6/KYZfFXP3Vls2v0F9A\"",
    "mtime": "2024-06-06T21:41:55.796Z",
    "size": 282,
    "path": "../public/_nuxt/skeleton.46954ab9.js"
  },
  "/_nuxt/skeleton.8b8464be.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"146-NnbnZ3iZpS4H9wTRWBhuKfWi128\"",
    "mtime": "2024-06-06T21:41:55.795Z",
    "size": 326,
    "path": "../public/_nuxt/skeleton.8b8464be.css"
  },
  "/_nuxt/ui.5d6d809f.js": {
    "type": "application/javascript",
    "etag": "\"11a-l8z7ohyk+ZnG41Dt2ExoNfRddMc\"",
    "mtime": "2024-06-06T21:41:55.795Z",
    "size": 282,
    "path": "../public/_nuxt/ui.5d6d809f.js"
  },
  "/image/logo-dark-lettered.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b8d-D3jgiJESm7L0d3y4YmU5sw1VSXs\"",
    "mtime": "2024-06-06T21:41:55.931Z",
    "size": 7053,
    "path": "../public/image/logo-dark-lettered.svg"
  },
  "/image/logo-dark-square-transparent.svg": {
    "type": "image/svg+xml",
    "etag": "\"a5a-jP77YNianiD2FjvOfH34/U34emA\"",
    "mtime": "2024-06-06T21:41:55.931Z",
    "size": 2650,
    "path": "../public/image/logo-dark-square-transparent.svg"
  },
  "/image/logo-dark-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"a91-EmF+/H2wbIP/MqGXUAFPt9pJu/Y\"",
    "mtime": "2024-06-06T21:41:55.930Z",
    "size": 2705,
    "path": "../public/image/logo-dark-square.svg"
  },
  "/image/logo-light-lettered.svg": {
    "type": "image/svg+xml",
    "etag": "\"1b95-CDUhsNPRprVCyiqqefCkou2P0z0\"",
    "mtime": "2024-06-06T21:41:55.930Z",
    "size": 7061,
    "path": "../public/image/logo-light-lettered.svg"
  },
  "/image/logo-light-square-transparent.svg": {
    "type": "image/svg+xml",
    "etag": "\"a73-BJV5Pc03H70StNndx6dle/HI2yA\"",
    "mtime": "2024-06-06T21:41:55.929Z",
    "size": 2675,
    "path": "../public/image/logo-light-square-transparent.svg"
  },
  "/image/logo-light-square.svg": {
    "type": "image/svg+xml",
    "etag": "\"aa3-q066ZHJ8bzYcb3ZikGIiI2/V15Y\"",
    "mtime": "2024-06-06T21:41:55.929Z",
    "size": 2723,
    "path": "../public/image/logo-light-square.svg"
  },
  "/image/logo-splash.svg": {
    "type": "image/svg+xml",
    "etag": "\"17f9-v48f1JLbPhVxyOFt/8FvR4ufZUo\"",
    "mtime": "2024-06-06T21:41:55.928Z",
    "size": 6137,
    "path": "../public/image/logo-splash.svg"
  },
  "/_nuxt/icons/120x120.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"39b4-llvm7i28TbHxPovrfAw2MlIFmak\"",
    "mtime": "2024-06-06T21:41:55.794Z",
    "size": 14772,
    "path": "../public/_nuxt/icons/120x120.02df9a4b.png"
  },
  "/_nuxt/icons/120x120.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"2a4f-hN5WJ+DB0qMG5Muw/cq4HOsasfM\"",
    "mtime": "2024-06-06T21:41:55.794Z",
    "size": 10831,
    "path": "../public/_nuxt/icons/120x120.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/144x144.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"4c9d-ki666OZKFA+udYWG7u1ZdrIKxK8\"",
    "mtime": "2024-06-06T21:41:55.794Z",
    "size": 19613,
    "path": "../public/_nuxt/icons/144x144.02df9a4b.png"
  },
  "/_nuxt/icons/144x144.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"36e0-8neijd7FwfiK10tKIxORoJahtNc\"",
    "mtime": "2024-06-06T21:41:55.793Z",
    "size": 14048,
    "path": "../public/_nuxt/icons/144x144.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/152x152.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"537e-hlZZrEp8PuerP/Y1tX1B2L6h/UA\"",
    "mtime": "2024-06-06T21:41:55.793Z",
    "size": 21374,
    "path": "../public/_nuxt/icons/152x152.02df9a4b.png"
  },
  "/_nuxt/icons/152x152.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"3ba5-R5UJrULXrSbeIQomTv+KXujKFuA\"",
    "mtime": "2024-06-06T21:41:55.793Z",
    "size": 15269,
    "path": "../public/_nuxt/icons/152x152.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/192x192.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"7882-kPgK6frcyJPManR0t+433aCxY3E\"",
    "mtime": "2024-06-06T21:41:55.792Z",
    "size": 30850,
    "path": "../public/_nuxt/icons/192x192.02df9a4b.png"
  },
  "/_nuxt/icons/192x192.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"56c0-cVtJ/Uzo5F1T2qVfj3NNJRYJzvE\"",
    "mtime": "2024-06-06T21:41:55.792Z",
    "size": 22208,
    "path": "../public/_nuxt/icons/192x192.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/384x384.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"191f6-s2MJOsy2Ttc1clCv1m5/E36YvQ4\"",
    "mtime": "2024-06-06T21:41:55.791Z",
    "size": 102902,
    "path": "../public/_nuxt/icons/384x384.02df9a4b.png"
  },
  "/_nuxt/icons/384x384.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"1156e-d+D4Xzvu0hzsm+E4yIu/MHXFyVU\"",
    "mtime": "2024-06-06T21:41:55.791Z",
    "size": 71022,
    "path": "../public/_nuxt/icons/384x384.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/512x512.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"15fc8-nPeU3Pkuyr5uEVoQcxNhQLhXz+E\"",
    "mtime": "2024-06-06T21:41:55.790Z",
    "size": 90056,
    "path": "../public/_nuxt/icons/512x512.02df9a4b.png"
  },
  "/_nuxt/icons/512x512.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"1d377-vjLc9puU7jauSF0S/j2Lhywczn8\"",
    "mtime": "2024-06-06T21:41:55.789Z",
    "size": 119671,
    "path": "../public/_nuxt/icons/512x512.maskable.02df9a4b.png"
  },
  "/_nuxt/icons/64x64.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"1605-4pvFkcVv6eKxgA2HqS9wxuqpdu8\"",
    "mtime": "2024-06-06T21:41:55.788Z",
    "size": 5637,
    "path": "../public/_nuxt/icons/64x64.02df9a4b.png"
  },
  "/_nuxt/icons/64x64.maskable.02df9a4b.png": {
    "type": "image/png",
    "etag": "\"1031-dH0P9wz/cNq+qWDSIE88FqrpoWw\"",
    "mtime": "2024-06-06T21:41:55.787Z",
    "size": 4145,
    "path": "../public/_nuxt/icons/64x64.maskable.02df9a4b.png"
  },
  "/shiki/dist/onig.wasm": {
    "type": "application/wasm",
    "etag": "\"71eb2-sWRKnnRfEwkGBTHc1IeyNBzS478\"",
    "mtime": "2024-06-06T21:41:55.924Z",
    "size": 466610,
    "path": "../public/shiki/dist/onig.wasm"
  },
  "/shiki/themes/css-variables.json": {
    "type": "application/json",
    "etag": "\"f9b-O9mndwg2Z7ROGGVe7pmND5x52TY\"",
    "mtime": "2024-06-06T21:41:55.825Z",
    "size": 3995,
    "path": "../public/shiki/themes/css-variables.json"
  },
  "/shiki/themes/dark-plus.json": {
    "type": "application/json",
    "etag": "\"34b7-0/FcS6rzCfblmiAHJdTDlQq0fzU\"",
    "mtime": "2024-06-06T21:41:55.825Z",
    "size": 13495,
    "path": "../public/shiki/themes/dark-plus.json"
  },
  "/shiki/themes/dracula-soft.json": {
    "type": "application/json",
    "etag": "\"7bc7-TlpUtT3Wdt5WVWVfI2WfOixTN08\"",
    "mtime": "2024-06-06T21:41:55.825Z",
    "size": 31687,
    "path": "../public/shiki/themes/dracula-soft.json"
  },
  "/shiki/themes/dracula.json": {
    "type": "application/json",
    "etag": "\"7bc2-OPFLRK+IpIMtv08/75yjL7IL8BI\"",
    "mtime": "2024-06-06T21:41:55.824Z",
    "size": 31682,
    "path": "../public/shiki/themes/dracula.json"
  },
  "/shiki/themes/github-dark-dimmed.json": {
    "type": "application/json",
    "etag": "\"46b5-rMayVenBdWzOxECsvHuILisx62g\"",
    "mtime": "2024-06-06T21:41:55.824Z",
    "size": 18101,
    "path": "../public/shiki/themes/github-dark-dimmed.json"
  },
  "/shiki/themes/github-dark.json": {
    "type": "application/json",
    "etag": "\"46ae-htHUVOO8/spAhkG7bOqXodR3GWo\"",
    "mtime": "2024-06-06T21:41:55.824Z",
    "size": 18094,
    "path": "../public/shiki/themes/github-dark.json"
  },
  "/shiki/themes/github-light.json": {
    "type": "application/json",
    "etag": "\"4532-ee49Lzl7KkjXralH/R5te5/2jOM\"",
    "mtime": "2024-06-06T21:41:55.823Z",
    "size": 17714,
    "path": "../public/shiki/themes/github-light.json"
  },
  "/shiki/themes/hc_light.json": {
    "type": "application/json",
    "etag": "\"31c3-5TkJlMMSE0cNhuF91nAES74qKmE\"",
    "mtime": "2024-06-06T21:41:55.823Z",
    "size": 12739,
    "path": "../public/shiki/themes/hc_light.json"
  },
  "/shiki/themes/light-plus.json": {
    "type": "application/json",
    "etag": "\"393d-dS6RzA+hCrNI1s2lfDOdj3uxcAg\"",
    "mtime": "2024-06-06T21:41:55.822Z",
    "size": 14653,
    "path": "../public/shiki/themes/light-plus.json"
  },
  "/shiki/themes/material-darker.json": {
    "type": "application/json",
    "etag": "\"65c0-D7N4jrcA1J7QA9bySL05dL5zMYg\"",
    "mtime": "2024-06-06T21:41:55.822Z",
    "size": 26048,
    "path": "../public/shiki/themes/material-darker.json"
  },
  "/shiki/themes/material-default.json": {
    "type": "application/json",
    "etag": "\"65c1-UB6icQTaU53goSgkjsRlYfBTaAY\"",
    "mtime": "2024-06-06T21:41:55.821Z",
    "size": 26049,
    "path": "../public/shiki/themes/material-default.json"
  },
  "/shiki/themes/material-lighter.json": {
    "type": "application/json",
    "etag": "\"65c3-3rm57MdXoeRe04of6At5wgIcSjA\"",
    "mtime": "2024-06-06T21:41:55.821Z",
    "size": 26051,
    "path": "../public/shiki/themes/material-lighter.json"
  },
  "/shiki/themes/material-ocean.json": {
    "type": "application/json",
    "etag": "\"65c1-0FsdfU66pR3AqO3zeU7v8HLsiRE\"",
    "mtime": "2024-06-06T21:41:55.820Z",
    "size": 26049,
    "path": "../public/shiki/themes/material-ocean.json"
  },
  "/shiki/themes/material-palenight.json": {
    "type": "application/json",
    "etag": "\"65c3-99hvaMTgm5DDzgiSvpxHmLD0eSs\"",
    "mtime": "2024-06-06T21:41:55.820Z",
    "size": 26051,
    "path": "../public/shiki/themes/material-palenight.json"
  },
  "/shiki/themes/min-dark.json": {
    "type": "application/json",
    "etag": "\"2108-ygVSGZLLsxOyrZnwKZlCQf7sDvQ\"",
    "mtime": "2024-06-06T21:41:55.819Z",
    "size": 8456,
    "path": "../public/shiki/themes/min-dark.json"
  },
  "/shiki/themes/min-light.json": {
    "type": "application/json",
    "etag": "\"23ae-BElcvsCMyTKmeho7vRSxgMoZL/4\"",
    "mtime": "2024-06-06T21:41:55.818Z",
    "size": 9134,
    "path": "../public/shiki/themes/min-light.json"
  },
  "/shiki/themes/monokai.json": {
    "type": "application/json",
    "etag": "\"2f68-adClRxZmFrI5I/C7EXMlEsGJ3LQ\"",
    "mtime": "2024-06-06T21:41:55.818Z",
    "size": 12136,
    "path": "../public/shiki/themes/monokai.json"
  },
  "/shiki/themes/nord.json": {
    "type": "application/json",
    "etag": "\"a37e-wAL7NEUoQPvY4gTfHWy7fbRKfDw\"",
    "mtime": "2024-06-06T21:41:55.818Z",
    "size": 41854,
    "path": "../public/shiki/themes/nord.json"
  },
  "/shiki/themes/one-dark-pro.json": {
    "type": "application/json",
    "etag": "\"db3f-ecaSGphkRxLgigYsxP6cSXbNlSU\"",
    "mtime": "2024-06-06T21:41:55.817Z",
    "size": 56127,
    "path": "../public/shiki/themes/one-dark-pro.json"
  },
  "/shiki/themes/poimandres.json": {
    "type": "application/json",
    "etag": "\"a3c2-9U4tA0maye54GzAcDrLjgA2NZ/Y\"",
    "mtime": "2024-06-06T21:41:55.815Z",
    "size": 41922,
    "path": "../public/shiki/themes/poimandres.json"
  },
  "/shiki/themes/rose-pine-dawn.json": {
    "type": "application/json",
    "etag": "\"6249-1ZQ6ENOCvIwHglGfxZa9kuLxoXY\"",
    "mtime": "2024-06-06T21:41:55.814Z",
    "size": 25161,
    "path": "../public/shiki/themes/rose-pine-dawn.json"
  },
  "/shiki/themes/rose-pine-moon.json": {
    "type": "application/json",
    "etag": "\"6248-5Kmo0qCIuDfIXVchCwarqJvqPE0\"",
    "mtime": "2024-06-06T21:41:55.814Z",
    "size": 25160,
    "path": "../public/shiki/themes/rose-pine-moon.json"
  },
  "/shiki/themes/rose-pine.json": {
    "type": "application/json",
    "etag": "\"6243-SYyrUpubqjZrkvnL8GdKoKY9+Hs\"",
    "mtime": "2024-06-06T21:41:55.813Z",
    "size": 25155,
    "path": "../public/shiki/themes/rose-pine.json"
  },
  "/shiki/themes/slack-dark.json": {
    "type": "application/json",
    "etag": "\"3565-2cVIJ7y9sysQ1rkMnqbTdOr9cyA\"",
    "mtime": "2024-06-06T21:41:55.812Z",
    "size": 13669,
    "path": "../public/shiki/themes/slack-dark.json"
  },
  "/shiki/themes/slack-ochin.json": {
    "type": "application/json",
    "etag": "\"3444-gxwQOHtXFA31W2RWydDaqyhg8bs\"",
    "mtime": "2024-06-06T21:41:55.812Z",
    "size": 13380,
    "path": "../public/shiki/themes/slack-ochin.json"
  },
  "/shiki/themes/solarized-dark.json": {
    "type": "application/json",
    "etag": "\"281f-oyYH/6npCyCk7p7ZlGy2D/4C+es\"",
    "mtime": "2024-06-06T21:41:55.812Z",
    "size": 10271,
    "path": "../public/shiki/themes/solarized-dark.json"
  },
  "/shiki/themes/solarized-light.json": {
    "type": "application/json",
    "etag": "\"267f-bPIQgwNap9GaE6scKBdNeZSeG7g\"",
    "mtime": "2024-06-06T21:41:55.811Z",
    "size": 9855,
    "path": "../public/shiki/themes/solarized-light.json"
  },
  "/shiki/themes/vitesse-black.json": {
    "type": "application/json",
    "etag": "\"6aa8-p0JSLJ/rBvDrpg1Ar82+OQE0Arw\"",
    "mtime": "2024-06-06T21:41:55.811Z",
    "size": 27304,
    "path": "../public/shiki/themes/vitesse-black.json"
  },
  "/shiki/themes/vitesse-dark-soft.json": {
    "type": "application/json",
    "etag": "\"6aac-kXxAx16A8bnn8/Mh0WJYICk2UW0\"",
    "mtime": "2024-06-06T21:41:55.810Z",
    "size": 27308,
    "path": "../public/shiki/themes/vitesse-dark-soft.json"
  },
  "/shiki/themes/vitesse-dark.json": {
    "type": "application/json",
    "etag": "\"6afb-JtXcXxTfr7vOtV3D/JGb40GArao\"",
    "mtime": "2024-06-06T21:41:55.810Z",
    "size": 27387,
    "path": "../public/shiki/themes/vitesse-dark.json"
  },
  "/shiki/themes/vitesse-light-soft.json": {
    "type": "application/json",
    "etag": "\"6a4c-Q8yYRDKJ3oXbDmkYK2TsVSmqc4w\"",
    "mtime": "2024-06-06T21:41:55.810Z",
    "size": 27212,
    "path": "../public/shiki/themes/vitesse-light-soft.json"
  },
  "/shiki/themes/vitesse-light.json": {
    "type": "application/json",
    "etag": "\"6a47-NqxhET8Xy1BcwwoJLWPI79WPN24\"",
    "mtime": "2024-06-06T21:41:55.809Z",
    "size": 27207,
    "path": "../public/shiki/themes/vitesse-light.json"
  },
  "/shiki/languages/abap.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"37ea-0nssbAvB3Zd52zFbofbw0RsYVjw\"",
    "mtime": "2024-06-06T21:41:55.923Z",
    "size": 14314,
    "path": "../public/shiki/languages/abap.tmLanguage.json"
  },
  "/shiki/languages/actionscript-3.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5832-JobvSg5QgE12AGq4wtYQblDT3c4\"",
    "mtime": "2024-06-06T21:41:55.922Z",
    "size": 22578,
    "path": "../public/shiki/languages/actionscript-3.tmLanguage.json"
  },
  "/shiki/languages/ada.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"15a55-ZivusMnkl0uF8/6ItYppGVDdqAo\"",
    "mtime": "2024-06-06T21:41:55.922Z",
    "size": 88661,
    "path": "../public/shiki/languages/ada.tmLanguage.json"
  },
  "/shiki/languages/apache.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"4411-OydPtBY3x0OBqhZuS0zResD0V6k\"",
    "mtime": "2024-06-06T21:41:55.921Z",
    "size": 17425,
    "path": "../public/shiki/languages/apache.tmLanguage.json"
  },
  "/shiki/languages/apex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13f11-mF280ryhsyCVkgY93lD0w1AzM2I\"",
    "mtime": "2024-06-06T21:41:55.920Z",
    "size": 81681,
    "path": "../public/shiki/languages/apex.tmLanguage.json"
  },
  "/shiki/languages/apl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"aba6-i0BK5QmSObGys/ya/Ws+EttZ4/8\"",
    "mtime": "2024-06-06T21:41:55.919Z",
    "size": 43942,
    "path": "../public/shiki/languages/apl.tmLanguage.json"
  },
  "/shiki/languages/applescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b7cd-kC2U0OsfuM5lS6YeQWv24ESaEJI\"",
    "mtime": "2024-06-06T21:41:55.919Z",
    "size": 47053,
    "path": "../public/shiki/languages/applescript.tmLanguage.json"
  },
  "/shiki/languages/asm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b0eb-sA2093ZcuI+kRShzZqqq8tMW2Tg\"",
    "mtime": "2024-06-06T21:41:55.918Z",
    "size": 45291,
    "path": "../public/shiki/languages/asm.tmLanguage.json"
  },
  "/shiki/languages/astro.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6395-LvgL4YuIoyB6AfWdL+VB8Z3GiFE\"",
    "mtime": "2024-06-06T21:41:55.918Z",
    "size": 25493,
    "path": "../public/shiki/languages/astro.tmLanguage.json"
  },
  "/shiki/languages/awk.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"221c-7b7lEfk/uGVvxcT92CQQZpbWiiU\"",
    "mtime": "2024-06-06T21:41:55.917Z",
    "size": 8732,
    "path": "../public/shiki/languages/awk.tmLanguage.json"
  },
  "/shiki/languages/ballerina.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"172c9-FjBw5zdU96XNlSY7avXM5WfW7DA\"",
    "mtime": "2024-06-06T21:41:55.916Z",
    "size": 94921,
    "path": "../public/shiki/languages/ballerina.tmLanguage.json"
  },
  "/shiki/languages/bat.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"58cc-TdVse2MbW1ibFjC7XySSGEMPL70\"",
    "mtime": "2024-06-06T21:41:55.916Z",
    "size": 22732,
    "path": "../public/shiki/languages/bat.tmLanguage.json"
  },
  "/shiki/languages/berry.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"9d3-BiTtooZ5Go5UwfiHaDIENVk50Co\"",
    "mtime": "2024-06-06T21:41:55.915Z",
    "size": 2515,
    "path": "../public/shiki/languages/berry.tmLanguage.json"
  },
  "/shiki/languages/bibtex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1bc7-zDugB8Qe45xEYQnp8wMrxCUHbbI\"",
    "mtime": "2024-06-06T21:41:55.914Z",
    "size": 7111,
    "path": "../public/shiki/languages/bibtex.tmLanguage.json"
  },
  "/shiki/languages/bicep.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1796-oVSDEOnkAsq5V9zJg+60r1vPoDo\"",
    "mtime": "2024-06-06T21:41:55.914Z",
    "size": 6038,
    "path": "../public/shiki/languages/bicep.tmLanguage.json"
  },
  "/shiki/languages/blade.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"26260-u9hagA6v5c86OtAXk1PY9I2PFtE\"",
    "mtime": "2024-06-06T21:41:55.914Z",
    "size": 156256,
    "path": "../public/shiki/languages/blade.tmLanguage.json"
  },
  "/shiki/languages/c.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1dec6-SE58pRWIqZ4QM6FnVvsIq6JMwyo\"",
    "mtime": "2024-06-06T21:41:55.912Z",
    "size": 122566,
    "path": "../public/shiki/languages/c.tmLanguage.json"
  },
  "/shiki/languages/cadence.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"48ff-Zu1QAhRSmA+fr+91mghlh65nZTw\"",
    "mtime": "2024-06-06T21:41:55.911Z",
    "size": 18687,
    "path": "../public/shiki/languages/cadence.tmLanguage.json"
  },
  "/shiki/languages/clarity.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5d54-AUBvqCFeI39pjHwE9lENaRaQmOM\"",
    "mtime": "2024-06-06T21:41:55.910Z",
    "size": 23892,
    "path": "../public/shiki/languages/clarity.tmLanguage.json"
  },
  "/shiki/languages/clojure.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2a53-aBmquM8Dpr9OEbuK5fi+NnMRlxk\"",
    "mtime": "2024-06-06T21:41:55.910Z",
    "size": 10835,
    "path": "../public/shiki/languages/clojure.tmLanguage.json"
  },
  "/shiki/languages/cmake.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2beb-Nsi8gyYDS9/AFUK3S/sXGWbB5Qk\"",
    "mtime": "2024-06-06T21:41:55.909Z",
    "size": 11243,
    "path": "../public/shiki/languages/cmake.tmLanguage.json"
  },
  "/shiki/languages/cobol.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b793-4H7J6ZRt9Wx4vTwbpfiFnhIBR50\"",
    "mtime": "2024-06-06T21:41:55.909Z",
    "size": 46995,
    "path": "../public/shiki/languages/cobol.tmLanguage.json"
  },
  "/shiki/languages/codeql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"b419-nEfVXogYxCd8x1TLnXj6XeTW1es\"",
    "mtime": "2024-06-06T21:41:55.908Z",
    "size": 46105,
    "path": "../public/shiki/languages/codeql.tmLanguage.json"
  },
  "/shiki/languages/coffee.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a1b4-4Ny2igle2SNFBdBiLjkJ0e2pRJw\"",
    "mtime": "2024-06-06T21:41:55.908Z",
    "size": 41396,
    "path": "../public/shiki/languages/coffee.tmLanguage.json"
  },
  "/shiki/languages/cpp-macro.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"57f71-6XFpjtHFHtwaXOVMkW6nqbjI88w\"",
    "mtime": "2024-06-06T21:41:55.907Z",
    "size": 360305,
    "path": "../public/shiki/languages/cpp-macro.tmLanguage.json"
  },
  "/shiki/languages/cpp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"9e741-LUBpbvhhplIUgXJmlx0farzd0HM\"",
    "mtime": "2024-06-06T21:41:55.904Z",
    "size": 649025,
    "path": "../public/shiki/languages/cpp.tmLanguage.json"
  },
  "/shiki/languages/crystal.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c02c-CxSBssEUISYmKL8o4/aHdbuQpFs\"",
    "mtime": "2024-06-06T21:41:55.902Z",
    "size": 49196,
    "path": "../public/shiki/languages/crystal.tmLanguage.json"
  },
  "/shiki/languages/csharp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"21a91-qyYNbS+vWe5b7dqep9E6D5cCXLU\"",
    "mtime": "2024-06-06T21:41:55.901Z",
    "size": 137873,
    "path": "../public/shiki/languages/csharp.tmLanguage.json"
  },
  "/shiki/languages/css.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13a7d-R+P55QEzVlpyDkRMFl0sPwUcRIE\"",
    "mtime": "2024-06-06T21:41:55.900Z",
    "size": 80509,
    "path": "../public/shiki/languages/css.tmLanguage.json"
  },
  "/shiki/languages/cue.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"815f-leuwDfS2RhCFD8qZ87kIemrH7s4\"",
    "mtime": "2024-06-06T21:41:55.899Z",
    "size": 33119,
    "path": "../public/shiki/languages/cue.tmLanguage.json"
  },
  "/shiki/languages/d.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1201a-dvazsoWT5QibJBY8KRAP/q3Q+VE\"",
    "mtime": "2024-06-06T21:41:55.896Z",
    "size": 73754,
    "path": "../public/shiki/languages/d.tmLanguage.json"
  },
  "/shiki/languages/dart.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3042-3ecgl5BXERUS6kjCy2T3iQiJ6yU\"",
    "mtime": "2024-06-06T21:41:55.895Z",
    "size": 12354,
    "path": "../public/shiki/languages/dart.tmLanguage.json"
  },
  "/shiki/languages/diff.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"105a-agJ3+GlHhHEjhhjk+nT1i1+S0mg\"",
    "mtime": "2024-06-06T21:41:55.895Z",
    "size": 4186,
    "path": "../public/shiki/languages/diff.tmLanguage.json"
  },
  "/shiki/languages/docker.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"aec-0kwy5UHFJsUmeCEYHFJLzerYZKo\"",
    "mtime": "2024-06-06T21:41:55.895Z",
    "size": 2796,
    "path": "../public/shiki/languages/docker.tmLanguage.json"
  },
  "/shiki/languages/dream-maker.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"421a-WuPmbJXo1QsM9imVA5Xyi/kFqtQ\"",
    "mtime": "2024-06-06T21:41:55.894Z",
    "size": 16922,
    "path": "../public/shiki/languages/dream-maker.tmLanguage.json"
  },
  "/shiki/languages/elixir.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"72cd-IEJx4LFqEOr5O1pExMp4sy7vZL8\"",
    "mtime": "2024-06-06T21:41:55.894Z",
    "size": 29389,
    "path": "../public/shiki/languages/elixir.tmLanguage.json"
  },
  "/shiki/languages/elm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"43a8-534SGjmuzEmrnvdwy1jsA/M1rSg\"",
    "mtime": "2024-06-06T21:41:55.892Z",
    "size": 17320,
    "path": "../public/shiki/languages/elm.tmLanguage.json"
  },
  "/shiki/languages/erb.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"eab-GkYZSiybyseTy3PMVHIM+Hf5hYY\"",
    "mtime": "2024-06-06T21:41:55.891Z",
    "size": 3755,
    "path": "../public/shiki/languages/erb.tmLanguage.json"
  },
  "/shiki/languages/erlang.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bfda-Yl8Uyh5k0r5Xv94mRMA5GfvBGBE\"",
    "mtime": "2024-06-06T21:41:55.890Z",
    "size": 49114,
    "path": "../public/shiki/languages/erlang.tmLanguage.json"
  },
  "/shiki/languages/fish.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1b57-8zm3E0dOtpJO/hJFa+8cUCJ9rvo\"",
    "mtime": "2024-06-06T21:41:55.890Z",
    "size": 6999,
    "path": "../public/shiki/languages/fish.tmLanguage.json"
  },
  "/shiki/languages/fsharp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bbd2-AgpA+5TfI+PwAchDEe+XqXsvspg\"",
    "mtime": "2024-06-06T21:41:55.890Z",
    "size": 48082,
    "path": "../public/shiki/languages/fsharp.tmLanguage.json"
  },
  "/shiki/languages/gherkin.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"346e-OLNtadLYa8FJHB+Aq7K7+KhuTGE\"",
    "mtime": "2024-06-06T21:41:55.889Z",
    "size": 13422,
    "path": "../public/shiki/languages/gherkin.tmLanguage.json"
  },
  "/shiki/languages/git-commit.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"105a-Hqe8cQZjZrFakZPKVxENmZ6ZHFI\"",
    "mtime": "2024-06-06T21:41:55.889Z",
    "size": 4186,
    "path": "../public/shiki/languages/git-commit.tmLanguage.json"
  },
  "/shiki/languages/git-rebase.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6a5-VcjezS+9AAGYiKHkk8Q9Ckf5EHg\"",
    "mtime": "2024-06-06T21:41:55.889Z",
    "size": 1701,
    "path": "../public/shiki/languages/git-rebase.tmLanguage.json"
  },
  "/shiki/languages/glsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1028-43FEvoW8k+aEVxv14aGyGlJQFDI\"",
    "mtime": "2024-06-06T21:41:55.888Z",
    "size": 4136,
    "path": "../public/shiki/languages/glsl.tmLanguage.json"
  },
  "/shiki/languages/gnuplot.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7573-N+OPlgVDtJkj//Qf//vWOh4OcXM\"",
    "mtime": "2024-06-06T21:41:55.888Z",
    "size": 30067,
    "path": "../public/shiki/languages/gnuplot.tmLanguage.json"
  },
  "/shiki/languages/go.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7ba2-m+WJ1VeEi1o9fhcKz2szvGBzXw8\"",
    "mtime": "2024-06-06T21:41:55.887Z",
    "size": 31650,
    "path": "../public/shiki/languages/go.tmLanguage.json"
  },
  "/shiki/languages/graphql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"78c0-yWquhb7tywZ4KNnbml5cixTkWwU\"",
    "mtime": "2024-06-06T21:41:55.887Z",
    "size": 30912,
    "path": "../public/shiki/languages/graphql.tmLanguage.json"
  },
  "/shiki/languages/groovy.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"8bdb-wtbvX3u/Jg8O3wmp/JVm755dzJ0\"",
    "mtime": "2024-06-06T21:41:55.886Z",
    "size": 35803,
    "path": "../public/shiki/languages/groovy.tmLanguage.json"
  },
  "/shiki/languages/hack.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1bd90-GeddGkperefUFuLpcK77qqdp9P0\"",
    "mtime": "2024-06-06T21:41:55.886Z",
    "size": 114064,
    "path": "../public/shiki/languages/hack.tmLanguage.json"
  },
  "/shiki/languages/haml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3582-pDBwMHqxH1kzGszf4StaP8Ry6Bs\"",
    "mtime": "2024-06-06T21:41:55.885Z",
    "size": 13698,
    "path": "../public/shiki/languages/haml.tmLanguage.json"
  },
  "/shiki/languages/handlebars.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"542d-am2ofeb9GsGO8b2sotR8A1ELVVk\"",
    "mtime": "2024-06-06T21:41:55.884Z",
    "size": 21549,
    "path": "../public/shiki/languages/handlebars.tmLanguage.json"
  },
  "/shiki/languages/haskell.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"146f7-yQ6Tv978pQta/jBKaXSq0za1AlI\"",
    "mtime": "2024-06-06T21:41:55.884Z",
    "size": 83703,
    "path": "../public/shiki/languages/haskell.tmLanguage.json"
  },
  "/shiki/languages/hcl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"494a-N17Jg27SPap+rcZBng1cQFi6iPg\"",
    "mtime": "2024-06-06T21:41:55.883Z",
    "size": 18762,
    "path": "../public/shiki/languages/hcl.tmLanguage.json"
  },
  "/shiki/languages/hlsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23a9-5Gs3IcRedjyFrc1XZdLFV7JlOFw\"",
    "mtime": "2024-06-06T21:41:55.882Z",
    "size": 9129,
    "path": "../public/shiki/languages/hlsl.tmLanguage.json"
  },
  "/shiki/languages/html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1976f-WPg//XtpAJP7LZwHdSo3KMeQkHo\"",
    "mtime": "2024-06-06T21:41:55.882Z",
    "size": 104303,
    "path": "../public/shiki/languages/html.tmLanguage.json"
  },
  "/shiki/languages/imba.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13b77-cBG+aD7bsNLcOhbDtR6Ghf9DOzQ\"",
    "mtime": "2024-06-06T21:41:55.882Z",
    "size": 80759,
    "path": "../public/shiki/languages/imba.tmLanguage.json"
  },
  "/shiki/languages/ini.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"ad3-TUGv2CFTA/y5sVCmmX8w1nmOZmM\"",
    "mtime": "2024-06-06T21:41:55.881Z",
    "size": 2771,
    "path": "../public/shiki/languages/ini.tmLanguage.json"
  },
  "/shiki/languages/java.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bffc-M+5xeV8ME+0asl/+JmF2rxteV9A\"",
    "mtime": "2024-06-06T21:41:55.880Z",
    "size": 49148,
    "path": "../public/shiki/languages/java.tmLanguage.json"
  },
  "/shiki/languages/javascript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3c084-twrliqFBH9jAG8bkE3blg4+OnlA\"",
    "mtime": "2024-06-06T21:41:55.879Z",
    "size": 245892,
    "path": "../public/shiki/languages/javascript.tmLanguage.json"
  },
  "/shiki/languages/jinja-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"221-+pOnOKt15nUR5fgUOdeOQYjwMak\"",
    "mtime": "2024-06-06T21:41:55.878Z",
    "size": 545,
    "path": "../public/shiki/languages/jinja-html.tmLanguage.json"
  },
  "/shiki/languages/jinja.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"20f9-+TPDpsz2F8+AubiHjqImjmD/3CA\"",
    "mtime": "2024-06-06T21:41:55.877Z",
    "size": 8441,
    "path": "../public/shiki/languages/jinja.tmLanguage.json"
  },
  "/shiki/languages/json.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"170b-3JHT3Wu/2O/b4RwGzSGqEZHTqw0\"",
    "mtime": "2024-06-06T21:41:55.877Z",
    "size": 5899,
    "path": "../public/shiki/languages/json.tmLanguage.json"
  },
  "/shiki/languages/json5.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1928-pGMGeF3QdNNLcHQb1YwUOOtzHRw\"",
    "mtime": "2024-06-06T21:41:55.877Z",
    "size": 6440,
    "path": "../public/shiki/languages/json5.tmLanguage.json"
  },
  "/shiki/languages/jsonc.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"181a-WUkf3rkKO0N1irGKWTwV2GQE7Q0\"",
    "mtime": "2024-06-06T21:41:55.876Z",
    "size": 6170,
    "path": "../public/shiki/languages/jsonc.tmLanguage.json"
  },
  "/shiki/languages/jsonnet.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"154a-Ds2nmWW7jFG39tnPvSXM/JJ9sPQ\"",
    "mtime": "2024-06-06T21:41:55.876Z",
    "size": 5450,
    "path": "../public/shiki/languages/jsonnet.tmLanguage.json"
  },
  "/shiki/languages/jssm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"f69-VbVuf+mQyqjrTQNBypDKdnmKqfo\"",
    "mtime": "2024-06-06T21:41:55.875Z",
    "size": 3945,
    "path": "../public/shiki/languages/jssm.tmLanguage.json"
  },
  "/shiki/languages/jsx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3cc05-bdGS01FyYIQ+a3LmDbvx0WcL3jc\"",
    "mtime": "2024-06-06T21:41:55.875Z",
    "size": 248837,
    "path": "../public/shiki/languages/jsx.tmLanguage.json"
  },
  "/shiki/languages/julia.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a223-BkiJBrdLHdpcP8tCuEKo+lmYwk8\"",
    "mtime": "2024-06-06T21:41:55.874Z",
    "size": 41507,
    "path": "../public/shiki/languages/julia.tmLanguage.json"
  },
  "/shiki/languages/kotlin.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"438f-lcpbQBQjUD4rL5Uh26+8aCGg6ew\"",
    "mtime": "2024-06-06T21:41:55.873Z",
    "size": 17295,
    "path": "../public/shiki/languages/kotlin.tmLanguage.json"
  },
  "/shiki/languages/latex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"f8dc-aN+2s5IqfNkFZcvfoFwYpWTGjmQ\"",
    "mtime": "2024-06-06T21:41:55.873Z",
    "size": 63708,
    "path": "../public/shiki/languages/latex.tmLanguage.json"
  },
  "/shiki/languages/less.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"35ee-CYtkYIVLxQXv1K7lSq014qo8Ii0\"",
    "mtime": "2024-06-06T21:41:55.872Z",
    "size": 13806,
    "path": "../public/shiki/languages/less.tmLanguage.json"
  },
  "/shiki/languages/liquid.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5f20-tHO+kEA+3Bb68eXP1MNcvyAg9so\"",
    "mtime": "2024-06-06T21:41:55.872Z",
    "size": 24352,
    "path": "../public/shiki/languages/liquid.tmLanguage.json"
  },
  "/shiki/languages/lisp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3993-YLNn95TlZuor9XyjHFINP8/AcCE\"",
    "mtime": "2024-06-06T21:41:55.871Z",
    "size": 14739,
    "path": "../public/shiki/languages/lisp.tmLanguage.json"
  },
  "/shiki/languages/logo.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"e2c-M6kux7Zm+V14VtyRSxx68/EYu0Y\"",
    "mtime": "2024-06-06T21:41:55.871Z",
    "size": 3628,
    "path": "../public/shiki/languages/logo.tmLanguage.json"
  },
  "/shiki/languages/lua.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6124-1wJZvrugEIS5Gh0oKadHGobgvIc\"",
    "mtime": "2024-06-06T21:41:55.871Z",
    "size": 24868,
    "path": "../public/shiki/languages/lua.tmLanguage.json"
  },
  "/shiki/languages/make.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3fd6-lOTp35gOu0IXTu+sUS5pbgr0cC0\"",
    "mtime": "2024-06-06T21:41:55.870Z",
    "size": 16342,
    "path": "../public/shiki/languages/make.tmLanguage.json"
  },
  "/shiki/languages/markdown.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"151ea-5WtYB/JrdHvxDAot+gN6hh0iAYo\"",
    "mtime": "2024-06-06T21:41:55.870Z",
    "size": 86506,
    "path": "../public/shiki/languages/markdown.tmLanguage.json"
  },
  "/shiki/languages/marko.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"bac1-vzDakAAjVHPG6sGykX4+hbdM5tQ\"",
    "mtime": "2024-06-06T21:41:55.870Z",
    "size": 47809,
    "path": "../public/shiki/languages/marko.tmLanguage.json"
  },
  "/shiki/languages/matlab.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"908f-nkQsRZrm4aEKpxxGMheWk95IY2M\"",
    "mtime": "2024-06-06T21:41:55.869Z",
    "size": 37007,
    "path": "../public/shiki/languages/matlab.tmLanguage.json"
  },
  "/shiki/languages/mdx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"52a-IQDs5RJr5P0uzr740TDOB2kORWY\"",
    "mtime": "2024-06-06T21:41:55.868Z",
    "size": 1322,
    "path": "../public/shiki/languages/mdx.tmLanguage.json"
  },
  "/shiki/languages/mermaid.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a571-GRExFwZhyt/a6c1YVU6sRLwzc6A\"",
    "mtime": "2024-06-06T21:41:55.867Z",
    "size": 42353,
    "path": "../public/shiki/languages/mermaid.tmLanguage.json"
  },
  "/shiki/languages/nginx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"cf09-YFy3yGozK50glGTMDKn9O0XVO2o\"",
    "mtime": "2024-06-06T21:41:55.867Z",
    "size": 53001,
    "path": "../public/shiki/languages/nginx.tmLanguage.json"
  },
  "/shiki/languages/nim.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"9b2e-ff40nqth9Fzq5Qc/hdLZ59AbExc\"",
    "mtime": "2024-06-06T21:41:55.864Z",
    "size": 39726,
    "path": "../public/shiki/languages/nim.tmLanguage.json"
  },
  "/shiki/languages/nix.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6de7-F8JgvefdzBp14Qv+WtDhvzS7Hx4\"",
    "mtime": "2024-06-06T21:41:55.863Z",
    "size": 28135,
    "path": "../public/shiki/languages/nix.tmLanguage.json"
  },
  "/shiki/languages/objective-c.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"27551-X2EGZrL9hP8dctD70xwbWhC8s8Y\"",
    "mtime": "2024-06-06T21:41:55.862Z",
    "size": 161105,
    "path": "../public/shiki/languages/objective-c.tmLanguage.json"
  },
  "/shiki/languages/objective-cpp.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"452f9-Hq5BGIdfHNNyJeI1xESKg8mQh7A\"",
    "mtime": "2024-06-06T21:41:55.861Z",
    "size": 283385,
    "path": "../public/shiki/languages/objective-cpp.tmLanguage.json"
  },
  "/shiki/languages/ocaml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1825a-wP8+EEO0mHqDvbm+bCfkHQkAY0s\"",
    "mtime": "2024-06-06T21:41:55.860Z",
    "size": 98906,
    "path": "../public/shiki/languages/ocaml.tmLanguage.json"
  },
  "/shiki/languages/pascal.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1150-L+RotDUg2BHPOQO/YYHCVWPcx3M\"",
    "mtime": "2024-06-06T21:41:55.859Z",
    "size": 4432,
    "path": "../public/shiki/languages/pascal.tmLanguage.json"
  },
  "/shiki/languages/perl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"134d3-+g7nEB4jRkB3kLGvTzimximDgt8\"",
    "mtime": "2024-06-06T21:41:55.858Z",
    "size": 79059,
    "path": "../public/shiki/languages/perl.tmLanguage.json"
  },
  "/shiki/languages/php-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a6a-OlCkzuHNvIcJTBLspPw8FeBnras\"",
    "mtime": "2024-06-06T21:41:55.857Z",
    "size": 2666,
    "path": "../public/shiki/languages/php-html.tmLanguage.json"
  },
  "/shiki/languages/php.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"25fe0-WjxpryUpG7PsRrCVX6WixqrhM/c\"",
    "mtime": "2024-06-06T21:41:55.857Z",
    "size": 155616,
    "path": "../public/shiki/languages/php.tmLanguage.json"
  },
  "/shiki/languages/plsql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2687-Fo6F6PALtar2y4niYU/bREgBhmI\"",
    "mtime": "2024-06-06T21:41:55.857Z",
    "size": 9863,
    "path": "../public/shiki/languages/plsql.tmLanguage.json"
  },
  "/shiki/languages/postcss.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23e2-2Sp96p8VpD3FodTaxNycF7XaH3U\"",
    "mtime": "2024-06-06T21:41:55.856Z",
    "size": 9186,
    "path": "../public/shiki/languages/postcss.tmLanguage.json"
  },
  "/shiki/languages/powershell.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7f6a-xW1nCgH0gqNt3ZU8guj8jV0lgfs\"",
    "mtime": "2024-06-06T21:41:55.856Z",
    "size": 32618,
    "path": "../public/shiki/languages/powershell.tmLanguage.json"
  },
  "/shiki/languages/prisma.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2790-R0tsK7ShrnMlMFNphh9ugWfuTmg\"",
    "mtime": "2024-06-06T21:41:55.855Z",
    "size": 10128,
    "path": "../public/shiki/languages/prisma.tmLanguage.json"
  },
  "/shiki/languages/prolog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3800-xwmuzq+iEfA/HRrKFe2KchBaG78\"",
    "mtime": "2024-06-06T21:41:55.855Z",
    "size": 14336,
    "path": "../public/shiki/languages/prolog.tmLanguage.json"
  },
  "/shiki/languages/proto.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2a64-9Nu+pOY8pbKsd8Omsv9dheEkVsc\"",
    "mtime": "2024-06-06T21:41:55.855Z",
    "size": 10852,
    "path": "../public/shiki/languages/proto.tmLanguage.json"
  },
  "/shiki/languages/pug.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"62a0-4JTv06HcloWdU5uFzhU9H8pInR0\"",
    "mtime": "2024-06-06T21:41:55.854Z",
    "size": 25248,
    "path": "../public/shiki/languages/pug.tmLanguage.json"
  },
  "/shiki/languages/puppet.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"4a43-sKJsfU2BuIJnY7+qpAUhl0tMyVg\"",
    "mtime": "2024-06-06T21:41:55.854Z",
    "size": 19011,
    "path": "../public/shiki/languages/puppet.tmLanguage.json"
  },
  "/shiki/languages/purescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6b39-P4EXDnlnYeeUjloPcTzfcYhibBs\"",
    "mtime": "2024-06-06T21:41:55.853Z",
    "size": 27449,
    "path": "../public/shiki/languages/purescript.tmLanguage.json"
  },
  "/shiki/languages/python.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1cee0-ygpiosr2tWRZP11lmwjPTtrEjGU\"",
    "mtime": "2024-06-06T21:41:55.853Z",
    "size": 118496,
    "path": "../public/shiki/languages/python.tmLanguage.json"
  },
  "/shiki/languages/r.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"d05c-yIJD2Kjv7Q6H2ZUV9MOiWMj4Y/Y\"",
    "mtime": "2024-06-06T21:41:55.852Z",
    "size": 53340,
    "path": "../public/shiki/languages/r.tmLanguage.json"
  },
  "/shiki/languages/raku.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"332c-qJJKSxTTPvUHXpmKNn+ioH0syLI\"",
    "mtime": "2024-06-06T21:41:55.852Z",
    "size": 13100,
    "path": "../public/shiki/languages/raku.tmLanguage.json"
  },
  "/shiki/languages/razor.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"a38c-S/qRC1ZK0kabvBMjO0Bcoaanmd0\"",
    "mtime": "2024-06-06T21:41:55.852Z",
    "size": 41868,
    "path": "../public/shiki/languages/razor.tmLanguage.json"
  },
  "/shiki/languages/rel.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1457-tM1cclIIr1ImWGlOJYZMH8xLo24\"",
    "mtime": "2024-06-06T21:41:55.851Z",
    "size": 5207,
    "path": "../public/shiki/languages/rel.tmLanguage.json"
  },
  "/shiki/languages/riscv.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2790-Q9x8m3A2dq7PsYSQcmUkojcsOTM\"",
    "mtime": "2024-06-06T21:41:55.851Z",
    "size": 10128,
    "path": "../public/shiki/languages/riscv.tmLanguage.json"
  },
  "/shiki/languages/rst.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3f2f-mE3cPvceMHdj/zA55pxROE7kTtM\"",
    "mtime": "2024-06-06T21:41:55.850Z",
    "size": 16175,
    "path": "../public/shiki/languages/rst.tmLanguage.json"
  },
  "/shiki/languages/ruby.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"13420-TJhh5tqpWSuAfPNGi4z5d5Xcyrc\"",
    "mtime": "2024-06-06T21:41:55.850Z",
    "size": 78880,
    "path": "../public/shiki/languages/ruby.tmLanguage.json"
  },
  "/shiki/languages/rust.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7648-SI5cUk74zmxyIsYmkirDACslkGs\"",
    "mtime": "2024-06-06T21:41:55.849Z",
    "size": 30280,
    "path": "../public/shiki/languages/rust.tmLanguage.json"
  },
  "/shiki/languages/sas.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"30b4-bKN/8QSDm6v5VoQ2rUBd3xF3S1k\"",
    "mtime": "2024-06-06T21:41:55.848Z",
    "size": 12468,
    "path": "../public/shiki/languages/sas.tmLanguage.json"
  },
  "/shiki/languages/sass.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"36fb-EkLIVfW5knpVuT2NyrhxuMLCucY\"",
    "mtime": "2024-06-06T21:41:55.848Z",
    "size": 14075,
    "path": "../public/shiki/languages/sass.tmLanguage.json"
  },
  "/shiki/languages/scala.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"9c69-yVXUaeKrCxo71p7gjqlVOgVebfA\"",
    "mtime": "2024-06-06T21:41:55.847Z",
    "size": 40041,
    "path": "../public/shiki/languages/scala.tmLanguage.json"
  },
  "/shiki/languages/scheme.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3d17-ISzhSQGPeO0kxcq5zIr24P4t828\"",
    "mtime": "2024-06-06T21:41:55.847Z",
    "size": 15639,
    "path": "../public/shiki/languages/scheme.tmLanguage.json"
  },
  "/shiki/languages/scss.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c49a-OZ+RzvQ0NpStDG1CUFcAAvglhfA\"",
    "mtime": "2024-06-06T21:41:55.847Z",
    "size": 50330,
    "path": "../public/shiki/languages/scss.tmLanguage.json"
  },
  "/shiki/languages/shaderlab.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1f5a-0w4dwoaoC7wy+QUVKN2pHTDKA0c\"",
    "mtime": "2024-06-06T21:41:55.846Z",
    "size": 8026,
    "path": "../public/shiki/languages/shaderlab.tmLanguage.json"
  },
  "/shiki/languages/shellscript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"decc-a6CzcZyTN2CzRIzobU7Epho0tz0\"",
    "mtime": "2024-06-06T21:41:55.846Z",
    "size": 57036,
    "path": "../public/shiki/languages/shellscript.tmLanguage.json"
  },
  "/shiki/languages/smalltalk.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1884-9fcz8C17UasS7Gv7PeIG6Bt2yvc\"",
    "mtime": "2024-06-06T21:41:55.846Z",
    "size": 6276,
    "path": "../public/shiki/languages/smalltalk.tmLanguage.json"
  },
  "/shiki/languages/solidity.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"6a82-xAmX2efdKfyyH6HATpJuygoMRD0\"",
    "mtime": "2024-06-06T21:41:55.845Z",
    "size": 27266,
    "path": "../public/shiki/languages/solidity.tmLanguage.json"
  },
  "/shiki/languages/sparql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"613-t0aadBfnP0DDDpd78AkBX6RMiJE\"",
    "mtime": "2024-06-06T21:41:55.845Z",
    "size": 1555,
    "path": "../public/shiki/languages/sparql.tmLanguage.json"
  },
  "/shiki/languages/sql.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7415-KsB7uIRpBUQA54LdAuzNzzJYVNc\"",
    "mtime": "2024-06-06T21:41:55.845Z",
    "size": 29717,
    "path": "../public/shiki/languages/sql.tmLanguage.json"
  },
  "/shiki/languages/ssh-config.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1078-J4Jin8DBCxmu1kHrlDvbzGLHpb4\"",
    "mtime": "2024-06-06T21:41:55.844Z",
    "size": 4216,
    "path": "../public/shiki/languages/ssh-config.tmLanguage.json"
  },
  "/shiki/languages/stata.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"181b7-9fcf6UpY8JR80h5EEpQe0wHmGaQ\"",
    "mtime": "2024-06-06T21:41:55.844Z",
    "size": 98743,
    "path": "../public/shiki/languages/stata.tmLanguage.json"
  },
  "/shiki/languages/stylus.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"ae96-I+iYJvcDzn2ZynbGO+e8bLlMMXk\"",
    "mtime": "2024-06-06T21:41:55.842Z",
    "size": 44694,
    "path": "../public/shiki/languages/stylus.tmLanguage.json"
  },
  "/shiki/languages/svelte.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"68e1-k2b9gHGCPq8K9YVMos9AwMvz4kU\"",
    "mtime": "2024-06-06T21:41:55.842Z",
    "size": 26849,
    "path": "../public/shiki/languages/svelte.tmLanguage.json"
  },
  "/shiki/languages/swift.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"20436-76jJaTvL+ZNebglcnT9N05yQm9Q\"",
    "mtime": "2024-06-06T21:41:55.841Z",
    "size": 132150,
    "path": "../public/shiki/languages/swift.tmLanguage.json"
  },
  "/shiki/languages/system-verilog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7369-iclnY1G+G9vpA73VJ1enEGTXpzo\"",
    "mtime": "2024-06-06T21:41:55.840Z",
    "size": 29545,
    "path": "../public/shiki/languages/system-verilog.tmLanguage.json"
  },
  "/shiki/languages/tasl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"16c0-14CqPiyqJSVRxWWuyyFfMzehNsU\"",
    "mtime": "2024-06-06T21:41:55.839Z",
    "size": 5824,
    "path": "../public/shiki/languages/tasl.tmLanguage.json"
  },
  "/shiki/languages/tcl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1cea-HdRxRZo51ZlYf8fRA1aiAnKT+zc\"",
    "mtime": "2024-06-06T21:41:55.838Z",
    "size": 7402,
    "path": "../public/shiki/languages/tcl.tmLanguage.json"
  },
  "/shiki/languages/tex.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"2d59-NSzc3MifIrnSxQtgtSwSrAH6XLk\"",
    "mtime": "2024-06-06T21:41:55.837Z",
    "size": 11609,
    "path": "../public/shiki/languages/tex.tmLanguage.json"
  },
  "/shiki/languages/toml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"33b4-rBq1exUf93JH64/Dvnzj+khgfII\"",
    "mtime": "2024-06-06T21:41:55.836Z",
    "size": 13236,
    "path": "../public/shiki/languages/toml.tmLanguage.json"
  },
  "/shiki/languages/tsx.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3c35f-IlYvSz3wLIFOucp2UAvLmu5myP4\"",
    "mtime": "2024-06-06T21:41:55.835Z",
    "size": 246623,
    "path": "../public/shiki/languages/tsx.tmLanguage.json"
  },
  "/shiki/languages/turtle.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"163c-l3tVbLTGVyIsrsppP/Kd9t5qumM\"",
    "mtime": "2024-06-06T21:41:55.833Z",
    "size": 5692,
    "path": "../public/shiki/languages/turtle.tmLanguage.json"
  },
  "/shiki/languages/twig.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"8a0d-qgb/R6E2tXJS+pBfLaiXCggEWgY\"",
    "mtime": "2024-06-06T21:41:55.833Z",
    "size": 35341,
    "path": "../public/shiki/languages/twig.tmLanguage.json"
  },
  "/shiki/languages/typescript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3cad2-SbpBJLPE7uEqG53Z0KHzOJi6wm8\"",
    "mtime": "2024-06-06T21:41:55.832Z",
    "size": 248530,
    "path": "../public/shiki/languages/typescript.tmLanguage.json"
  },
  "/shiki/languages/v.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5d6c-Wu+jSkTKRKPlOhKxS7eFsYT6K98\"",
    "mtime": "2024-06-06T21:41:55.831Z",
    "size": 23916,
    "path": "../public/shiki/languages/v.tmLanguage.json"
  },
  "/shiki/languages/vb.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"20e4-SqeguNCxsvJO9WlxEHxOzsKMUOQ\"",
    "mtime": "2024-06-06T21:41:55.830Z",
    "size": 8420,
    "path": "../public/shiki/languages/vb.tmLanguage.json"
  },
  "/shiki/languages/verilog.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"236d-NXC3Y4iRL7fd2y0nInh4wmtcJtk\"",
    "mtime": "2024-06-06T21:41:55.830Z",
    "size": 9069,
    "path": "../public/shiki/languages/verilog.tmLanguage.json"
  },
  "/shiki/languages/vhdl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"c608-rAU/Ev037sEt3KOTd5sXpxySdzw\"",
    "mtime": "2024-06-06T21:41:55.829Z",
    "size": 50696,
    "path": "../public/shiki/languages/vhdl.tmLanguage.json"
  },
  "/shiki/languages/viml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"628e-zyCfwrDOnxe7FDbSXuiy54uGLF0\"",
    "mtime": "2024-06-06T21:41:55.829Z",
    "size": 25230,
    "path": "../public/shiki/languages/viml.tmLanguage.json"
  },
  "/shiki/languages/vue-html.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"3570-dJ36EQVw3Z3itfof8eGbINdJcGc\"",
    "mtime": "2024-06-06T21:41:55.829Z",
    "size": 13680,
    "path": "../public/shiki/languages/vue-html.tmLanguage.json"
  },
  "/shiki/languages/vue.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"7877-fUQjqIF/I03eAp4EMAqJtH41+NM\"",
    "mtime": "2024-06-06T21:41:55.828Z",
    "size": 30839,
    "path": "../public/shiki/languages/vue.tmLanguage.json"
  },
  "/shiki/languages/wasm.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5dab-kWiEFcOLxJfx8Tm/jASyZZKc55g\"",
    "mtime": "2024-06-06T21:41:55.828Z",
    "size": 23979,
    "path": "../public/shiki/languages/wasm.tmLanguage.json"
  },
  "/shiki/languages/wenyan.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"cc3-sEoEJ6VDHr0YFUif6lx1u4d+MKs\"",
    "mtime": "2024-06-06T21:41:55.828Z",
    "size": 3267,
    "path": "../public/shiki/languages/wenyan.tmLanguage.json"
  },
  "/shiki/languages/xml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"23d8-YGijHOIGfhXYGZAe3A6phkfpkrc\"",
    "mtime": "2024-06-06T21:41:55.827Z",
    "size": 9176,
    "path": "../public/shiki/languages/xml.tmLanguage.json"
  },
  "/shiki/languages/xsl.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"98a-MxIT5UI8aIQ5HHA65+vSl7eXSEY\"",
    "mtime": "2024-06-06T21:41:55.827Z",
    "size": 2442,
    "path": "../public/shiki/languages/xsl.tmLanguage.json"
  },
  "/shiki/languages/yaml.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"5f7d-1Gm+EVk0Q2rWtKQwBYV5eiNiDSQ\"",
    "mtime": "2024-06-06T21:41:55.826Z",
    "size": 24445,
    "path": "../public/shiki/languages/yaml.tmLanguage.json"
  },
  "/shiki/languages/zenscript.tmLanguage.json": {
    "type": "application/json",
    "etag": "\"1a27-Rqautocryu+/+rSrMXczh6DQlBY\"",
    "mtime": "2024-06-06T21:41:55.826Z",
    "size": 6695,
    "path": "../public/shiki/languages/zenscript.tmLanguage.json"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _zzFkUR = defineEventHandler(() => useRuntimeConfig().public.pwaManifest);

const _lazy_qxbTwN = () => import('../login.post.mjs');
const _lazy_vIMLyZ = () => import('../knowledge.post.mjs');
const _lazy_Yvma7p = () => import('../message.post.mjs');
const _lazy_NKaHW1 = () => import('../_trpc_.mjs');
const _lazy_TiYt0M = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/login', handler: _lazy_qxbTwN, lazy: true, middleware: false, method: "post" },
  { route: '/api/knowledge', handler: _lazy_vIMLyZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/message', handler: _lazy_Yvma7p, lazy: true, middleware: false, method: "post" },
  { route: '/api/trpc/:trpc', handler: _lazy_NKaHW1, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_TiYt0M, lazy: true, middleware: false, method: undefined },
  { route: '/manifest.json', handler: _zzFkUR, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_TiYt0M, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useNitroApp as a, getRouteRules as g, nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
