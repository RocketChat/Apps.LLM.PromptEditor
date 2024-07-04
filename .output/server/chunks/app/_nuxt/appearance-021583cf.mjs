import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { g as useDeta, j as useClient, f as useState } from '../server.mjs';
import { u as useAppearance } from './appearence-d89fe932.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import tinycolor from 'tinycolor2';
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
import '@bobthered/tailwindcss-palette-generator';

const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "appearance",
  __ssrInlineRender: true,
  setup(__props) {
    const currentColorMode = useColorMode();
    useDeta();
    useClient();
    const { setPalette, color: currentColor, navigationBarPosition } = useAppearance();
    const colorModeOptions = [
      { value: "light", label: "Light", icon: "i-tabler-sun" },
      { value: "dark", label: "Dark", icon: "i-tabler-moon" },
      { value: "system", label: "System", icon: "i-tabler-3d-cube-sphere" }
    ];
    const navigationBarPositionOptions = [
      { value: "top", label: "Top", icon: "i-tabler-box-align-top" },
      { value: "bottom", label: "Bottom", icon: "i-tabler-box-align-bottom" },
      { value: "left", label: "Left", icon: "i-tabler-box-align-left" },
      { value: "right", label: "Right", icon: "i-tabler-box-align-right" }
    ];
    const hueSteppedThemeColorOptions = computed(() => {
      const hueSteps = Array.from({ length: 24 }, (_, i) => i * 15);
      const mappedHueSteps = hueSteps.map((hue) => {
        const color = tinycolor({ h: hue, s: 0.6, l: 0.5 });
        return color.toHexString();
      });
      return mappedHueSteps.slice(19).concat(mappedHueSteps.slice(0, 19));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div font-bold text-gray-6 dark:text-gray-3 mb-3 text-14px sm:text-5> Color Mode </div><div grid grid-cols-3 gap-2 sm:gap-3><!--[-->`);
      ssrRenderList(unref(colorModeOptions), (option) => {
        _push(`<div grow flex flex-col items-center p-2 rounded-2 ring-1 cursor-pointer text-gray-5 dark:text-gray-3 gap-2 text-11px sm:text-4 class="${ssrRenderClass([[
          unref(currentColorMode).preference === option.value ? "!ring-primary-400 !dark:ring-primary-400 ring-2 !text-primary-600 dark:!text-primary-400" : ""
        ], "dark:ring-white/10 ring-gray-2"])}"><div class="${ssrRenderClass(option.icon)}" text-5 sm:text-6></div><div>${ssrInterpolate(option.label)}</div></div>`);
      });
      _push(`<!--]--></div><div font-bold text-gray-6 dark:text-gray-3 mb-3 mt-6 text-14px sm:text-5> Theme color </div><div grid grid-gap-2 class="grid-cols-[repeat(auto-fill,minmax(32px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(64px,1fr))]"><!--[-->`);
      ssrRenderList(unref(hueSteppedThemeColorOptions), (color) => {
        _push(`<div w-full h-8 sm:h-12 style="${ssrRenderStyle({ backgroundColor: color })}" transition-all ring-0 cursor-pointer rounded class="${ssrRenderClass([
          color === unref(currentColor) ? "ring-4 ring-primary-300 z-1" : ""
        ])}"></div>`);
      });
      _push(`<!--]--></div><div font-bold text-gray-6 dark:text-gray-3 mb-3 mt-6 text-14px sm:text-5> Navigation bar position </div><div grid grid-cols-4 gap-2 sm:gap-3><!--[-->`);
      ssrRenderList(navigationBarPositionOptions, (option) => {
        _push(`<div grow flex flex-col items-center p-2 rounded-2 ring-1 cursor-pointer text-gray-5 dark:text-gray-3 gap-2 text-11px sm:text-4 class="${ssrRenderClass([[
          unref(navigationBarPosition) === option.value ? "!ring-primary-400 !dark:ring-primary-400 ring-2 !text-primary-600 dark:!text-primary-400" : ""
        ], "dark:ring-white/10 ring-gray-2"])}"><div class="${ssrRenderClass(option.icon)}" text-5 sm:text-6></div><div>${ssrInterpolate(option.label)}</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/appearance.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=appearance-021583cf.mjs.map
