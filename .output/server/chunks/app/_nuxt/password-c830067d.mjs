import { _ as _sfc_main$1 } from './input-92b8d879.mjs';
import { _ as _sfc_main$2 } from './button-10b3008b.mjs';
import { defineComponent, ref, mergeProps, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { i as useSession, j as useClient, k as useCookie, n as navigateTo } from '../server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "password",
  __ssrInlineRender: true,
  setup(__props) {
    const password = ref("");
    const error = ref(false);
    const { isLoggedIn } = useSession();
    const client = useClient();
    async function onLogin() {
      const result = await client.auth.login.mutate(password.value);
      if (result) {
        error.value = false;
        useCookie("golem-password").value = password.value;
        isLoggedIn.value = true;
        navigateTo("/");
      } else {
        error.value = true;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GoInput = _sfc_main$1;
      const _component_GoButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "~ col gap-2",
        "items-center": "",
        "justify-center": "",
        "h-full": "",
        "w-full": "",
        "text-color": ""
      }, _attrs))}><div mb-4> This instance is protected by a password. </div>`);
      _push(ssrRenderComponent(_component_GoInput, {
        modelValue: unref(password),
        "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
        type: "password",
        placeholder: "Password",
        class: "min-w-48 max-w-64",
        "text-color": "",
        onKeydown: onLogin
      }, null, _parent));
      _push(ssrRenderComponent(_component_GoButton, {
        class: "min-w-48 max-w-64",
        onClick: onLogin
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Login `);
          } else {
            return [
              createTextVNode(" Login ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(error)) {
        _push(`<div> Invalid password </div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=password-c830067d.mjs.map
