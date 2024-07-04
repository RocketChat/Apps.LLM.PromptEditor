import { useSSRContext, defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, isRef } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './input-92b8d879.mjs';
import { h as useSettings, g as useDeta, j as useClient, q as useDebounceFn } from '../server.mjs';
import { u as useLanguageModel, h as handle } from './language-model-56d12d75.mjs';
import { s as syncStorageRef } from './local-storage-ref-eabb4f1d.mjs';
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
import 'eventsource-parser';
import 'openai';
import 'nanoid';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "link",
  __ssrInlineRender: true,
  props: {
    to: null
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: __props.to,
        "text-gray-6": "",
        "dark:text-gray-2": "",
        "cursor-pointer": "",
        "decoration-none": "",
        "b-0": "",
        "b-b-2": "",
        "b-solid": "",
        "b-primary": "",
        "hover:op-80": "",
        transition: ""
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</a>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/go/link.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "api-key",
  __ssrInlineRender: true,
  setup(__props) {
    const { apiKey, instanceApiKey } = useSettings();
    const { isDetaEnabled } = useDeta();
    const { checkIfAPIKeyIsValid } = useLanguageModel();
    const apiKeyInput = syncStorageRef(apiKey);
    const client = useClient();
    const apiKeyError = ref(false);
    const maskedApiKey = computed(() => {
      if (!instanceApiKey.value) {
        return "";
      }
      const apiKeyLength = instanceApiKey.value.length;
      return instanceApiKey.value.slice(0, 4) + "\u2022".repeat(apiKeyLength - 8) + instanceApiKey.value.slice(apiKeyLength - 4);
    });
    async function onBlur(event) {
      var _a;
      const apiKey2 = (_a = event.target) == null ? void 0 : _a.value;
      if (apiKey2) {
        try {
          await checkIfAPIKeyIsValid(apiKey2);
          apiKeyError.value = false;
        } catch (e) {
          apiKeyError.value = "Invalid API key.";
        }
      }
    }
    if (isDetaEnabled.value) {
      const updateAPIKeyOnDeta = useDebounceFn(async () => {
        const { error } = await handle(checkIfAPIKeyIsValid(apiKeyInput.value || ""));
        if (error) {
          apiKeyError.value = "Invalid API key.";
          return;
        }
        await client.deta.preferences.set.mutate({ key: "api-key", value: apiKeyInput.value || "" });
        instanceApiKey.value = apiKeyInput.value || "";
        apiKey.value = apiKeyInput.value || "";
        apiKeyError.value = false;
      }, 300);
      watch(apiKeyInput, (newVal, oldVal) => {
        if (newVal !== oldVal) {
          updateAPIKeyOnDeta();
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GoLink = _sfc_main$1;
      const _component_GoInput = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        "text-gray-6": "",
        "dark:text-gray-2": "",
        "text-11px": "",
        "sm:text-4": ""
      }, _attrs))}><div> To use the application you need to provide an OpenAI API key. </div><div mt-3> You can get your API key from the `);
      _push(ssrRenderComponent(_component_GoLink, {
        to: "https://platform.openai.com/account/api-keys",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` OpenAI dashboard `);
          } else {
            return [
              createTextVNode(" OpenAI dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </div>`);
      if (!(unref(instanceApiKey) && !unref(isDetaEnabled))) {
        _push(`<div text-gray-5 dark:text-gray-1 mt-3>`);
        _push(ssrRenderComponent(_component_GoInput, {
          modelValue: unref(apiKeyInput),
          "onUpdate:modelValue": ($event) => isRef(apiKeyInput) ? apiKeyInput.value = $event : null,
          placeholder: "Enter your API Key",
          "text-11px": "",
          "sm:text-4": "",
          "w-full": "",
          "text-gray-5": "",
          "dark:text-gray-1": "",
          when: {
            blur: onBlur
          },
          error: unref(apiKeyError)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div><div font-bold text-gray-6 dark:text-gray-3 mt-7 text-14px sm:text-5> Instance API Key </div><div my-3></div>`);
        if (unref(isDetaEnabled)) {
          _push(`<div text-color-lighter text-8px sm:text-13px>${ssrInterpolate(unref(isDetaEnabled) ? "The API Key is setup and stored on Deta." : "This instance has a shared API key already set up.")}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div text-color mt-3 font-code p-1 sm:px-3 sm:py-2 rounded text-6px sm:text-3 break-all class="bg-gray-1 dark:bg-gray-1/5 ring-1 ring-gray-2 dark:ring-white/10">${ssrInterpolate(unref(maskedApiKey))}</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/api-key.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=api-key-efde0048.mjs.map
