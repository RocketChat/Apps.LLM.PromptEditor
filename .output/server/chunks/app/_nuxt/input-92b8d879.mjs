import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "input",
  __ssrInlineRender: true,
  props: {
    modelValue: null,
    placeholder: null,
    when: null,
    error: { type: [String, Boolean] }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ "w-full": "" }, _attrs))}><input${ssrRenderAttrs(mergeProps({
        "b-1": "",
        "b-solid": "",
        "b-gray-300": "",
        "focus:b-primary-500": "",
        transition: "",
        "p-2": "",
        "ease-in-out": "",
        "focus:placeholder:translate-x-1": "",
        "placeholder:transition": "",
        "placeholder:ease-in-out": "",
        "outline-none": "",
        "placeholder:text-color": "",
        "placeholder:op-40": "",
        "rounded-2": "",
        class: ["dark:b-white/10 dark:focus:b-primary-400", [
          __props.error && "!b-red-4"
        ]],
        "bg-transparent": "",
        "text-color": "",
        value: __props.modelValue,
        placeholder: __props.placeholder
      }, { ..._ctx.$attrs }))}>`);
      if (__props.error) {
        _push(`<div text-red-400 text-11px sm:text-14px mt-1>${ssrInterpolate(__props.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/go/input.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=input-92b8d879.mjs.map
