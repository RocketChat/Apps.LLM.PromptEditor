import { p as publicAssetsURL } from '../../handlers/renderer.mjs';
import { useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _imports_0 = "" + publicAssetsURL("image/logo-splash.svg");
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    fixed: "",
    "inset-0": "",
    class: "dark:bg-dark-4 light:bg-gray-1/40",
    flex: "",
    "items-center": "",
    "justify-center": "",
    "text-color": "",
    "text-7": ""
  }, _attrs))} data-v-4e87ae58><img${ssrRenderAttr("src", _imports_0)} w-40 z-2 data-v-4e87ae58><img absolute${ssrRenderAttr("src", _imports_0)} w-40 blur-30 z-1 data-v-4e87ae58></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app-splash-screen.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-4e87ae58"]]);
async function useSetup(options) {
}

export { __nuxt_component_1 as _, useSetup as u };
//# sourceMappingURL=setup-32e3f18f.mjs.map
