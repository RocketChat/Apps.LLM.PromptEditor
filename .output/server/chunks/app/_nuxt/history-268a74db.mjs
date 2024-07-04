import { useSSRContext, defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, ref, watchEffect, resolveDirective } from 'vue';
import { o as onLongPress, a as useDevice, b as useElementHover, u as useRoute, d as onClickOutside } from '../server.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr, ssrGetDirectiveProps } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
import { u as useConversations } from './conversation-50c372eb.mjs';
import { _ as _sfc_main$3 } from './button-10b3008b.mjs';
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
import 'nanoid';
import './language-model-56d12d75.mjs';
import 'eventsource-parser';
import 'openai';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "long-press-button",
  __ssrInlineRender: true,
  props: {
    duration: null,
    progressBarStyle: null,
    successStyle: null,
    icon: null,
    small: { type: Boolean }
  },
  emits: ["success"],
  setup(__props, { emit }) {
    const props = __props;
    const element = ref();
    const progress = ref(0);
    onLongPress(element, () => {
      emit("success");
      setTimeout(() => {
        progress.value = 0;
      }, 100);
    }, { delay: props.duration, modifiers: { stop: true } });
    watchEffect(() => {
      if (element.value) {
        element.value.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
      }
    });
    const transitionStyle = computed(() => {
      return {
        "transition-duration": `${progress.value ? props.duration : 200}ms`,
        "transition-timing-function": "cubic-bezier(0,-0.04, 0.28, 0.94)"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        ref_key: "element",
        ref: element,
        "ring-2": "",
        "b-0": "",
        "px-.75em": "",
        "py-.45em": "",
        "bg-transparent": "",
        relative: "",
        "cursor-pointer": "",
        class: ["ring-#EFEFF0 !bg-#FCFCFC hover:bg-white dark:!bg-#474747 dark:ring-#4F4F50 dark:hover:bg-#4C4C4C", [
          unref(progress) > 0 && props.successStyle,
          __props.small && "!p-.35em"
        ]],
        "rounded-6px": "",
        "overflow-hidden": "",
        "text-color": "",
        "font-bold": "",
        "select-none": "",
        flex: "",
        "items-center": "",
        "justify-center": "",
        "gap-1": "",
        style: {
          transform: `translateY(${unref(progress) / 30}px)`,
          ...unref(transitionStyle)
        }
      }, _attrs))} data-v-68f7aaa3><div absolute top-0 bottom-0 left-0 bg-red transition-all z-1 style="${ssrRenderStyle({
        width: `${unref(progress)}%`,
        ...unref(transitionStyle)
      })}" class="${ssrRenderClass([
        props.progressBarStyle
      ])}" data-v-68f7aaa3></div>`);
      if (__props.icon) {
        _push(`<div relative z-1 class="${ssrRenderClass(__props.icon)}" data-v-68f7aaa3></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<span relative z-1 data-v-68f7aaa3>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/go/long-press-button.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-68f7aaa3"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "conversation-tab",
  __ssrInlineRender: true,
  props: {
    conversation: null
  },
  setup(__props) {
    const props = __props;
    const {
      currentConversation,
      conversationList,
      isTyping,
      switchConversation,
      deleteConversation,
      createConversation,
      updateConversation
    } = useConversations();
    const { isMobile } = useDevice();
    const element = ref();
    const inputElement = ref();
    const isHovering = useElementHover(element);
    const route = useRoute();
    const isCurrentConversation = computed(() => {
      if (currentConversation.value === null) {
        return false;
      }
      return currentConversation.value.id === props.conversation.id && ["/", "/chat"].includes(route.path);
    });
    const isTypingInCurrentConversation = computed(() => {
      if (currentConversation.value === null) {
        return false;
      }
      return isTyping.value[props.conversation.id];
    });
    const lastMessage = computed(() => {
      if (props.conversation.messages.length === 0) {
        return null;
      }
      return props.conversation.messages[props.conversation.messages.length - 1];
    });
    const conversationTitle = ref();
    const isEditingTitle = ref(false);
    watchEffect(() => {
      if (props.conversation.title) {
        conversationTitle.value = props.conversation.title;
      }
    });
    onClickOutside(inputElement, () => {
      isEditingTitle.value = false;
    });
    const onDeleteConversation = async (id) => {
      var _a;
      if (conversationList.value === null) {
        return;
      }
      const isCurrentConversation2 = ((_a = currentConversation.value) == null ? void 0 : _a.id) === id;
      if (!isCurrentConversation2) {
        await deleteConversation(id);
        return;
      }
      const index = conversationList.value.findIndex((conversation) => conversation.id === id);
      const nextConversation = conversationList.value[index + 1] || conversationList.value[index - 1];
      if (nextConversation) {
        await switchConversation(nextConversation.id);
      } else if (conversationList.value.length === 1) {
        const newConversation = await createConversation("Untitled Conversation");
        await switchConversation(newConversation.id);
      }
      await deleteConversation(id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_GoLongPressButton = __nuxt_component_2;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "element",
        ref: element,
        relative: ""
      }, _attrs))} data-v-7d9f52f0><div transition text-gray-600 dark:text-gray-3 cursor-pointer p-1 px-3 sm:p-2 sm:px-3 text-12px sm:text-15px w-full box-border active:translate-y-2px class="${ssrRenderClass([[
        unref(isCurrentConversation) ? "bg-white text-gray-600 shadow-md dark:bg-dark-1 dark:text-gray-1" : "hover:bg-gray-100 hover:dark:bg-dark-3"
      ], "shadow-gray-900/5"])}" data-v-7d9f52f0><div class="grid" grid items-center w-full box-border data-v-7d9f52f0><div col-start-1 col-end-1 data-v-7d9f52f0><div flex items-center data-v-7d9f52f0>`);
      if (unref(isEditingTitle)) {
        _push(`<div i-tabler-edit text-18px mr-1 data-v-7d9f52f0></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isEditingTitle) && unref(isTypingInCurrentConversation)) {
        _push(`<div i-eos-icons-bubble-loading text-18px mr-1 data-v-7d9f52f0></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isEditingTitle) && !unref(isTypingInCurrentConversation)) {
        _push(`<div text-18px mr-1 class="${ssrRenderClass([
          ((_b = (_a = __props.conversation) == null ? void 0 : _a.metadata) == null ? void 0 : _b.favorite) ? "i-tabler-star-filled text-amber" : "i-tabler-message-chatbot"
        ])}" data-v-7d9f52f0></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("value", unref(conversationTitle))}${ssrIncludeBooleanAttr(!unref(isEditingTitle)) ? " readonly" : ""} bg-transparent border-none outline-none p-0 transition font-bold mr-3 truncate text-10px sm:text-14px h-1.75em w-full class="${ssrRenderClass([
        unref(isEditingTitle) ? "text-gray-900 dark:text-gray-1 select-all" : "text-gray-700 dark:text-gray-3 select-none cursor-pointer"
      ])}" data-v-7d9f52f0></div>`);
      if (unref(lastMessage)) {
        _push(`<div text-gray-5 text-10px sm:text-13px dark:text-gray-4 max-w-190px truncate inline-block data-v-7d9f52f0>${ssrInterpolate(unref(lastMessage).text)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div col-start-2 col-end-2 data-v-7d9f52f0>`);
      if (unref(isHovering) || unref(isMobile)) {
        _push(ssrRenderComponent(_component_GoLongPressButton, mergeProps({
          duration: 800,
          icon: "i-tabler-x text-13px",
          "rounded-2px": "",
          small: "",
          block: "",
          class: "!relative",
          "success-style": "!ring-red-500 !text-red-7",
          "progress-bar-style": "bg-red/50",
          onSuccess: ($event) => onDeleteConversation(props.conversation.id)
        }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
          content: "Press and hold to delete conversation",
          delay: 450
        })), null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/conversation-tab.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7d9f52f0"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      conversationList,
      createConversation,
      switchConversation,
      clearConversations
    } = useConversations();
    const conversationsSortedByUpdatedAt = computed(() => {
      if (conversationList.value === null) {
        return null;
      }
      return conversationList.value.sort((a, b) => {
        if (a.updatedAt === null) {
          return 1;
        }
        if (b.updatedAt === null) {
          return -1;
        }
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });
    });
    const onCreateConversation = async () => {
      const newConversation = await createConversation("Untitled Conversation");
      await switchConversation(newConversation.id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_ConversationTab = __nuxt_component_0;
      const _component_GoButton = _sfc_main$3;
      const _component_GoLongPressButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ "p-4": "" }, _attrs))}><div font-bold font-title text-14px sm:text-22px text-color mb-2 flex items-center><div> History </div>`);
      if ((_a = unref(conversationList)) == null ? void 0 : _a.length) {
        _push(`<div ml-auto text-10px sm:text-13px text-color-lighter uppercase>${ssrInterpolate((_b = unref(conversationList)) == null ? void 0 : _b.length)} conversations </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div max-h-100 overflow-y-auto overflow-x-hidden w-full p-2 rounded-2 mt-6 class="light:bg-gray-1/50 dark:bg-dark-3 dark:shadow-dark" shadow shadow-inset><!--[-->`);
      ssrRenderList(unref(conversationsSortedByUpdatedAt), (conversation) => {
        _push(ssrRenderComponent(_component_ConversationTab, {
          key: conversation.id,
          conversation
        }, null, _parent));
      });
      _push(`<!--]--></div><div flex items-center children:grow gap-3 mt-2>`);
      _push(ssrRenderComponent(_component_GoButton, {
        secondary: "",
        icon: "i-tabler-plus",
        onClick: onCreateConversation
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` New chat `);
          } else {
            return [
              createTextVNode(" New chat ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_GoLongPressButton, {
        duration: 1500,
        icon: "i-tabler-arrow-bar-to-up",
        "progress-bar-style": "bg-red/50",
        "success-style": "!ring-red",
        onSuccess: unref(clearConversations)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Clear all `);
          } else {
            return [
              createTextVNode(" Clear all ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=history-268a74db.mjs.map
