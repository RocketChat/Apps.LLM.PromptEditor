import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { _ as __nuxt_component_1 } from './skeleton-040a22c0.mjs';
import { g as useDeta, u as useRoute } from '../server.mjs';
import { defineComponent, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import './_plugin-vue_export-helper-cc2b3d55.mjs';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
import 'destr';
import 'ohash';
import '@trpc/client';
import '@trpc/server/shared';
import 'unenv/runtime/npm/consola';
import 'p-limit';
import 'cookie-es';
import 'floating-vue';
import 'defu';
import '../../nitro/node-server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    useDeta();
    const settingsPageList = [
      {
        name: "API Key",
        icon: "i-tabler-key",
        path: "/settings/api-key"
      },
      {
        name: "Appearance",
        icon: "i-tabler-palette",
        path: "/settings/appearance"
      },
      {
        name: "Model",
        icon: "i-tabler-box-model-2",
        path: "/settings/model"
      }
      // isDetaEnabled.value && {
      //     name: 'Deta',
      //     icon: 'i-tabler-database',
      //     path: '/settings/deta',
      // },
    ].filter(Boolean);
    const route = useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      const _component_Skeleton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div sticky top-0 left-0 right-0 b-0 b-b-1 b-gray-1 dark:b-dark-1 b-solid py-5 z-1 backdrop-blur-4 class="bg-white/90 dark:bg-dark-1/90"><div px-4 flex items-center><div><div text-14px sm:text-6 font-bold font-title text-gray-6 dark:text-gray-2> Settings </div></div></div></div><div mt-2 max-w-1080px mx-auto px-4 md:px-6 grid grid-cols-12 sm:grid-cols-6 gap-3 md:gap-6 items-start pt-2 sm:pt-6><div col-span-4 sm:col-span-2 p-1 sm:p-2 border b-solid b-gray-2 rounded-3 sm:rounded-4 class="dark:b-white/10"><!--[-->`);
      ssrRenderList(unref(settingsPageList), (setting) => {
        _push(`<div flex items-center gap-2 hover:bg-gray-1 hover:dark:bg-dark-1 p-2 sm:p-3 rounded-2 sm:rounded-3 cursor-pointer text-gray-6 transition-all active:translate-y-2px><div text-14px sm:text-5 class="${ssrRenderClass([[
          setting.icon,
          unref(route).path === setting.path ? "!text-primary !text-bold" : ""
        ], "!text-primary-500 dark:!text-primary-400"])}"></div><div text-gray-5 dark:text-gray-2 text-9px sm:text-4 class="${ssrRenderClass([
          unref(route).path === setting.path ? "!text-primary-500 dark:!text-primary-400 !font-bold" : ""
        ])}">${ssrInterpolate(setting.name)}</div></div>`);
      });
      _push(`<!--]--></div><div col-span-7 sm:col-span-4>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        placeholder: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Skeleton, {
              "rounded-4": "",
              "w-full": "",
              "min-h-128": "",
              "m-0.25rem": ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Skeleton, {
                "rounded-4": "",
                "w-full": "",
                "min-h-128": "",
                "m-0.25rem": ""
              })
            ];
          }
        })
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-b15dacd3.mjs.map
