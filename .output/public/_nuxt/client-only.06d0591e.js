import{a as o,r as h,N as p,b as g,j as f,P as u}from"./entry.3cc83cf9.js";const m=o({name:"ClientOnly",inheritAttrs:!1,props:["fallback","placeholder","placeholderTag","fallbackTag"],setup(l,{slots:a,attrs:t}){const n=h(!1);return p(()=>{n.value=!0}),e=>{var r;if(n.value)return(r=a.default)==null?void 0:r.call(a);const s=a.fallback||a.placeholder;if(s)return s();const i=e.fallback||e.placeholder||"",c=e.fallbackTag||e.placeholderTag||"span";return g(c,t,i)}}}),d=new WeakMap;function k(l){if(d.has(l))return d.get(l);const a={...l};return a.render?a.render=(t,...n)=>{if(t.mounted$){const e=l.render(t,...n);return e.children===null||typeof e.children=="string"?f(e.type,e.props,e.children,e.patchFlag,e.dynamicProps,e.shapeFlag):u(e)}else return u("div",t.$attrs??t._.attrs)}:a.template&&(a.template=`
      <template v-if="mounted$">${l.template}</template>
      <template v-else><div></div></template>
    `),a.setup=(t,n)=>{var s;const e=h(!1);return p(()=>{e.value=!0}),Promise.resolve(((s=l.setup)==null?void 0:s.call(l,t,n))||{}).then(i=>typeof i!="function"?{...i,mounted$:e}:(...c)=>{if(e.value){const r=i(...c);return r.children===null||typeof r.children=="string"?f(r.type,r.props,r.children,r.patchFlag,r.dynamicProps,r.shapeFlag):u(r)}else return u("div",n.attrs)})},d.set(l,a),a}export{m as _,k as c};