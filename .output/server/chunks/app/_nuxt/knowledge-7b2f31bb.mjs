import { a as useKnowledge, u as useConversations } from './conversation-50c372eb.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import '../server.mjs';
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
  __name: "knowledge",
  __ssrInlineRender: true,
  setup(__props) {
    const { extractFromUrl, knowledgeList, deleteKnowledgeItem } = useKnowledge();
    useConversations();
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ "p-4": "" }, _attrs))}><div text-gray-7 dark:text-gray-1 font-bold text-6> Knowledge </div><div mt-2 text-gray-5 dark:text-gray-3 max-w-640px leading-6> You can ask about anything you want to know. <br>You just need to provide the knowledge.<br> Here you can add sources of knowledge from many different sources, from the web, through Notion, to your PDF files. </div><div grid grid-cols-3 gap-2><!--[-->`);
      ssrRenderList(unref(knowledgeList), (knowledge) => {
        _push(`<div p-3 rounded-2 dark:bg-dark-1 bg-gray-1 cursor-pointer dark:text-gray-3><div font-bold flex><div>${ssrInterpolate(knowledge.title)}</div><div text-gray-5 dark:text-gray-1 ml-2 class="bg-gray-2/50 hover:bg-gray-3/50 dark:bg-dark-2 hover:dark:bg-white/10" hover:text-gray-7 dark:hover:text-gray-1 rounded active:scale-95 transition-all w-6 h-6 flex items-center justify-center><div i-tabler-x text-18px></div></div></div><div>${ssrInterpolate(knowledge.id)}</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/knowledge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=knowledge-7b2f31bb.mjs.map
