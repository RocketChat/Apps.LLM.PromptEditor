import { _ as _sfc_main$1 } from './input-92b8d879.mjs';
import { j as useClient, h as useSettings, q as useDebounceFn } from '../server.mjs';
import { u as useLanguageModel, h as handle } from './language-model-56d12d75.mjs';
import { defineComponent, ref, watch, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "deta",
  __ssrInlineRender: true,
  setup(__props) {
    const client = useClient();
    const { instanceApiKey, apiKey } = useSettings();
    const { checkIfAPIKeyIsValid } = useLanguageModel();
    const apiKeyInput = ref(instanceApiKey.value || "");
    const apiKeyError = ref(false);
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GoInput = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div font-bold text-gray-6 dark:text-gray-3 mt-7 text-14px sm:text-5> Instance API Key </div><div my-3 text-color> You can set up a shared API key for this instance. </div>`);
      _push(ssrRenderComponent(_component_GoInput, {
        modelValue: unref(apiKeyInput),
        "onUpdate:modelValue": ($event) => isRef(apiKeyInput) ? apiKeyInput.value = $event : null,
        placeholder: "Enter your API Key",
        "text-11px": "",
        "sm:text-4": "",
        "w-full": "",
        "text-gray-5": "",
        "dark:text-gray-1": "",
        error: unref(apiKeyError)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings/deta.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=deta-7861486a.mjs.map
