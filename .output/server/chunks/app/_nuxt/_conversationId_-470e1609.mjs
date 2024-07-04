import { _ as __nuxt_component_1 } from './skeleton-040a22c0.mjs';
import { _ as __nuxt_component_0 } from './client-only-29ef7f45.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { u as useRoute } from '../server.mjs';
import { u as useConversations } from './conversation-50c372eb.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
import 'nanoid';
import './language-model-56d12d75.mjs';
import 'eventsource-parser';
import 'openai';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[conversationId]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute().params.conversationId;
    useConversations();
    ref(false);
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Skeleton = __nuxt_component_1;
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        "flex-col": "",
        "p-.25rem": ""
      }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(ssrRenderComponent(_component_Skeleton, {
            key: i,
            "w-180": "",
            "h-18": "",
            "m-0.25rem": "",
            "rounded-4": "",
            "mx-auto": ""
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          placeholder: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div${_scopeId}><!--[-->`);
              ssrRenderList(5, (i) => {
                _push2(ssrRenderComponent(_component_Skeleton, {
                  key: i,
                  "w-180": "",
                  "h-18": "",
                  "m-0.25rem": "",
                  "rounded-4": "",
                  "mx-auto": ""
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", null, [
                  (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                    return createVNode(_component_Skeleton, {
                      key: i,
                      "w-180": "",
                      "h-18": "",
                      "m-0.25rem": "",
                      "rounded-4": "",
                      "mx-auto": ""
                    });
                  }), 64))
                ])
              ];
            }
          })
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat/share/[conversationId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_conversationId_-470e1609.mjs.map
