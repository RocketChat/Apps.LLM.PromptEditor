import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { m as useMouseInElement, p as useTransition } from '../server.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "button",
  __ssrInlineRender: true,
  props: {
    outline: { type: Boolean },
    disabled: { type: Boolean },
    secondary: { type: Boolean },
    success: { type: Boolean },
    icon: null,
    color: null
  },
  emits: ["click"],
  setup(__props) {
    const buttonElement = ref();
    const { elementX, elementY, elementWidth, isOutside } = useMouseInElement(buttonElement);
    const backgroundCenterBase = computed(
      () => !isOutside.value ? [elementX.value, elementY.value] : [elementWidth.value / 2, 0]
    );
    const [fromColor, toColor] = [
      "rgba(var(--color-primary-300), 1)",
      "rgba(var(--color-primary-700), 1)"
    ];
    const backgroundCenter = useTransition(backgroundCenterBase, {
      duration: 200
    });
    const gradientStyle = computed(() => {
      const [x, y] = isOutside.value ? backgroundCenter.value : [elementX.value, elementY.value];
      return {
        background: `radial-gradient(circle at ${x}px ${y}px, ${fromColor} 0%, ${toColor} 100%)`
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        ref_key: "buttonElement",
        ref: buttonElement,
        "rounded-6px": "",
        flex: "",
        "items-center": "",
        "justify-center": "",
        "bg-gradient-to-tr": "",
        "from-primary-600": "",
        "to-primary-100": "",
        "border-0": "",
        "transition-all": "",
        "box-border": "",
        "shadow-md": "",
        "select-none": "",
        class: ["shadow-900/10", [
          (__props.secondary || __props.success) && "!bg-none !bg-200/30 !shadow-none dark:!bg-500/20",
          __props.disabled ? "cursor-not-allowed !from-gray-5 !to-gray-2" : ""
        ]],
        "active:scale-98": "",
        "active:shadow-none": "",
        "cursor-pointer": "",
        "p-0": "",
        style: !__props.disabled ? unref(gradientStyle) : {}
      }, _attrs))}><div px-.75em py-.45em text-white text-1em font-bold transition-all box-border rounded-6px class="${ssrRenderClass([[
        __props.secondary && !__props.success && "!bg-transparent !text-primary-600 dark:!text-primary-300",
        __props.success && "!bg-green-500 !text-white",
        __props.disabled ? "!bg-gray-5" : ""
      ], "!w-full !m-0.12rem bg-600/65"])}" flex items-center justify-center gap-1>`);
      if (__props.icon) {
        _push(`<div class="${ssrRenderClass(__props.icon)}"></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/go/button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=button-10b3008b.mjs.map
