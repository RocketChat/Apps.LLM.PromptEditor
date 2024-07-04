import { _ as _sfc_main$1 } from './button-10b3008b.mjs';
import { e as useIDB, f as useState } from '../server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { nanoid } from 'nanoid';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

function usePersona() {
  const db = useIDB();
  const personaList = useState("personaList", () => []);
  async function initPersonaList() {
    personaList.value = await db.table("personas").toArray();
    if (!personaList.value.length) {
      await createPersona({
        id: nanoid(),
        title: "Golem",
        instructions: "You are Golem, a large language model based assistant. Answer as concisely as possible."
      });
    }
  }
  async function createPersona(persona) {
    const newPersona = {
      ...persona,
      id: nanoid()
    };
    await db.table("personas").add(newPersona);
    personaList.value.push(newPersona);
    await updatePersonaList();
  }
  async function deletePersona(personaId) {
    await db.table("personas").delete(personaId);
    personaList.value = personaList.value.filter((p) => p.id !== personaId);
    await updatePersonaList();
  }
  async function updatePersona(personaId, update) {
    const persona = personaList.value.find((p) => p.id === personaId);
    if (persona) {
      await db.table("personas").put({ ...persona, ...update });
    }
    await updatePersonaList();
  }
  async function updatePersonaList() {
    personaList.value = await db.table("personas").toArray();
  }
  return {
    initPersonaList,
    personaList,
    createPersona,
    deletePersona,
    updatePersona
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "personas",
  __ssrInlineRender: true,
  setup(__props) {
    const { personaList } = usePersona();
    function onCreatePersona() {
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_GoButton = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ "p-4": "" }, _attrs))}><div font-bold font-title text-14px sm:text-22px text-color mb-2 flex items-center><div> Personas </div></div><div max-h-100 overflow-y-auto overflow-x-hidden w-full p-2 rounded-2 mt-6 class="light:bg-gray-1/50 dark:bg-dark-3 dark:shadow-dark" shadow shadow-inset>${ssrInterpolate(unref(personaList))}</div><div flex items-center children:grow gap-3 mt-2>`);
      _push(ssrRenderComponent(_component_GoButton, {
        secondary: "",
        icon: "i-tabler-plus",
        onClick: onCreatePersona
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` New persona `);
          } else {
            return [
              createTextVNode(" New persona ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/personas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=personas-ec1acf9b.mjs.map
