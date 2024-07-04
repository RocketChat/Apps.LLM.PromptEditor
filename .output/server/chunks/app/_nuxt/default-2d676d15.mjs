import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { u as useSetup, _ as __nuxt_component_1 } from './setup-32e3f18f.mjs';
import { a as useDevice } from '../server.mjs';
import { defineComponent, computed, withCtx, createVNode, useSSRContext, inject } from 'vue';
import { u as useAppearance } from './appearence-d89fe932.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import '../../handlers/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import '../../nitro/node-server.mjs';
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
import './_plugin-vue_export-helper-cc2b3d55.mjs';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@trpc/client';
import '@trpc/server/shared';
import 'unenv/runtime/npm/consola';
import 'p-limit';
import 'cookie-es';
import 'floating-vue';
import '@bobthered/tailwindcss-palette-generator';

function useUI() {
  const { isSmallDesktop } = useDevice();
  const scrollToBottom = inject("scrollToBottom");
  const getScrollHeight = inject("getScrollHeight");
  const chatScrolledHeight = inject("chatScrolledHeight");
  const isSidebarCompact = computed(() => isSmallDesktop.value);
  return {
    scrollToBottom,
    getScrollHeight,
    chatScrolledHeight,
    isSidebarCompact
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMobile } = useDevice();
    const { isSidebarCompact } = useUI();
    const { navigationBarPosition } = useAppearance();
    computed(() => {
      const positionMapping = {
        top: "top-0 left-0 right-0 h-4rem",
        bottom: "bottom-0 left-0 right-0 h-4rem",
        right: "top-0 bottom-0 right-0 w-4rem",
        left: "top-0 bottom-0 left-0 w-4rem"
      };
      return positionMapping[navigationBarPosition.value];
    });
    computed(() => {
      if (isMobile.value) {
        return "!inset-0 !rounded-0";
      }
      const positionMapping = {
        top: (() => {
          if (isSidebarCompact.value) {
            return "!top-4rem";
          }
          return "!top-4rem !left-15rem";
        })(),
        bottom: (() => {
          if (isSidebarCompact.value) {
            return "!bottom-4rem";
          }
          return "!bottom-4rem !left-15rem";
        })(),
        right: (() => {
          if (isSidebarCompact.value) {
            return "!right-4rem";
          }
          return "!right-4rem !left-15rem";
        })(),
        left: (() => {
          if (isSidebarCompact.value) {
            return "!left-4rem";
          }
          return "!left-19rem";
        })()
      };
      return positionMapping[navigationBarPosition.value];
    });
    useSetup();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      const _component_AppSplashScreen = __nuxt_component_1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
        placeholder: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppSplashScreen, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppSplashScreen)
            ];
          }
        })
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-2d676d15.mjs.map
