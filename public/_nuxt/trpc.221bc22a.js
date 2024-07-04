import{Q as K,r as C,a6 as D,a7 as J,a8 as O,E as W,u as Q,a9 as E,aa as V,ab as G}from"./entry.381c0f38.js";function X(n){return{}}const Y=()=>null;function Z(...n){var l;const s=typeof n[n.length-1]=="string"?n.pop():void 0;typeof n[0]!="string"&&n.unshift(s);let[e,t,r={}]=n;if(typeof e!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof t!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");r.server=r.server??!0,r.default=r.default??Y,r.lazy=r.lazy??!1,r.immediate=r.immediate??!0;const o=K(),u=()=>o.isHydrating?o.payload.data[e]:o.static.data[e],c=()=>u()!==void 0;o._asyncData[e]||(o._asyncData[e]={data:C(u()??((l=r.default)==null?void 0:l.call(r))??null),pending:C(!c()),error:C(o.payload._errors[e]?D(o.payload._errors[e]):null)});const i={...o._asyncData[e]};i.refresh=i.execute=(d={})=>{if(o._asyncDataPromises[e]){if(d.dedupe===!1)return o._asyncDataPromises[e];o._asyncDataPromises[e].cancelled=!0}if(d._initial&&c())return u();i.pending.value=!0;const p=new Promise((y,m)=>{try{y(t(o))}catch(g){m(g)}}).then(y=>{if(p.cancelled)return o._asyncDataPromises[e];let m=y;r.transform&&(m=r.transform(y)),r.pick&&(m=tt(m,r.pick)),i.data.value=m,i.error.value=null}).catch(y=>{var m;if(p.cancelled)return o._asyncDataPromises[e];i.error.value=y,i.data.value=Q(((m=r.default)==null?void 0:m.call(r))??null)}).finally(()=>{p.cancelled||(i.pending.value=!1,o.payload.data[e]=i.data.value,i.error.value&&(o.payload._errors[e]=D(i.error.value)),delete o._asyncDataPromises[e])});return o._asyncDataPromises[e]=p,o._asyncDataPromises[e]};const a=()=>i.refresh({_initial:!0}),f=r.server!==!1&&o.payload.serverRendered;{const d=E();if(d&&!d._nuxtOnBeforeMountCbs){d._nuxtOnBeforeMountCbs=[];const y=d._nuxtOnBeforeMountCbs;d&&(J(()=>{y.forEach(m=>{m()}),y.splice(0,y.length)}),O(()=>y.splice(0,y.length)))}f&&o.isHydrating&&c()?i.pending.value=!1:d&&(o.payload.serverRendered&&o.isHydrating||r.lazy)&&r.immediate?d._nuxtOnBeforeMountCbs.push(a):r.immediate&&a(),r.watch&&W(r.watch,()=>i.refresh());const p=o.hook("app:data:refresh",y=>{if(!y||y.includes(e))return i.refresh()});d&&O(p)}const h=Promise.resolve(o._asyncDataPromises[e]).then(()=>i);return Object.assign(h,i),h}function tt(n,s){const e={};for(const t of s)e[t]=n[t];return e}const et={ignoreUnknown:!1,respectType:!1,respectFunctionNames:!1,respectFunctionProperties:!1,unorderedObjects:!0,unorderedArrays:!1,unorderedSets:!1};function rt(n,s={}){s={...et,...s};const e=R(s);return e.dispatch(n),e.toString()}function R(n){const s=[];let e=[];const t=r=>{s.push(r)};return{toString(){return s.join("")},getContext(){return e},dispatch(r){return n.replacer&&(r=n.replacer(r)),this["_"+(r===null?"null":typeof r)](r)},_object(r){const o=/\[object (.*)]/i,u=Object.prototype.toString.call(r),c=o.exec(u),i=c?c[1].toLowerCase():"unknown:["+u.toLowerCase()+"]";let a=null;if((a=e.indexOf(r))>=0)return this.dispatch("[CIRCULAR:"+a+"]");if(e.push(r),typeof Buffer<"u"&&Buffer.isBuffer&&Buffer.isBuffer(r))return t("buffer:"),t(r.toString("utf8"));if(i!=="object"&&i!=="function"&&i!=="asyncfunction")if(this["_"+i])this["_"+i](r);else{if(n.ignoreUnknown)return t("["+i+"]");throw new Error('Unknown object type "'+i+'"')}else{let f=Object.keys(r);n.unorderedObjects&&(f=f.sort()),n.respectType!==!1&&!z(r)&&f.splice(0,0,"prototype","__proto__","letructor"),n.excludeKeys&&(f=f.filter(function(h){return!n.excludeKeys(h)})),t("object:"+f.length+":");for(const h of f)this.dispatch(h),t(":"),n.excludeValues||this.dispatch(r[h]),t(",")}},_array(r,o){if(o=typeof o<"u"?o:n.unorderedArrays!==!1,t("array:"+r.length+":"),!o||r.length<=1){for(const i of r)this.dispatch(i);return}const u=[],c=r.map(i=>{const a=R(n);return a.dispatch(i),u.push(a.getContext()),a.toString()});return e=[...e,...u],c.sort(),this._array(c,!1)},_date(r){return t("date:"+r.toJSON())},_symbol(r){return t("symbol:"+r.toString())},_error(r){return t("error:"+r.toString())},_boolean(r){return t("bool:"+r.toString())},_string(r){t("string:"+r.length+":"),t(r.toString())},_function(r){t("fn:"),z(r)?this.dispatch("[native]"):this.dispatch(r.toString()),n.respectFunctionNames!==!1&&this.dispatch("function-name:"+String(r.name)),n.respectFunctionProperties&&this._object(r)},_number(r){return t("number:"+r.toString())},_xml(r){return t("xml:"+r.toString())},_null(){return t("Null")},_undefined(){return t("Undefined")},_regexp(r){return t("regex:"+r.toString())},_uint8array(r){return t("uint8array:"),this.dispatch(Array.prototype.slice.call(r))},_uint8clampedarray(r){return t("uint8clampedarray:"),this.dispatch(Array.prototype.slice.call(r))},_int8array(r){return t("int8array:"),this.dispatch(Array.prototype.slice.call(r))},_uint16array(r){return t("uint16array:"),this.dispatch(Array.prototype.slice.call(r))},_int16array(r){return t("int16array:"),this.dispatch(Array.prototype.slice.call(r))},_uint32array(r){return t("uint32array:"),this.dispatch(Array.prototype.slice.call(r))},_int32array(r){return t("int32array:"),this.dispatch(Array.prototype.slice.call(r))},_float32array(r){return t("float32array:"),this.dispatch(Array.prototype.slice.call(r))},_float64array(r){return t("float64array:"),this.dispatch(Array.prototype.slice.call(r))},_arraybuffer(r){return t("arraybuffer:"),this.dispatch(new Uint8Array(r))},_url(r){return t("url:"+r.toString())},_map(r){t("map:");const o=[...r];return this._array(o,n.unorderedSets!==!1)},_set(r){t("set:");const o=[...r];return this._array(o,n.unorderedSets!==!1)},_file(r){return t("file:"),this.dispatch([r.name,r.size,r.type,r.lastModfied])},_blob(){if(n.ignoreUnknown)return t("[blob]");throw new Error(`Hashing Blob objects is currently not supported
Use "options.replacer" or "options.ignoreUnknown"
`)},_domwindow(){return t("domwindow")},_bigint(r){return t("bigint:"+r.toString())},_process(){return t("process")},_timer(){return t("timer")},_pipe(){return t("pipe")},_tcp(){return t("tcp")},_udp(){return t("udp")},_tty(){return t("tty")},_statwatcher(){return t("statwatcher")},_securecontext(){return t("securecontext")},_connection(){return t("connection")},_zlib(){return t("zlib")},_context(){return t("context")},_nodescript(){return t("nodescript")},_httpparser(){return t("httpparser")},_dataview(){return t("dataview")},_signal(){return t("signal")},_fsevent(){return t("fsevent")},_tlswrap(){return t("tlswrap")}}}function z(n){return typeof n!="function"?!1:/^function\s+\w*\s*\(\s*\)\s*{\s+\[native code]\s+}$/i.exec(Function.prototype.toString.call(n))!=null}class x{constructor(s,e){s=this.words=s||[],this.sigBytes=e!==void 0?e:s.length*4}toString(s){return(s||nt).stringify(this)}concat(s){if(this.clamp(),this.sigBytes%4)for(let e=0;e<s.sigBytes;e++){const t=s.words[e>>>2]>>>24-e%4*8&255;this.words[this.sigBytes+e>>>2]|=t<<24-(this.sigBytes+e)%4*8}else for(let e=0;e<s.sigBytes;e+=4)this.words[this.sigBytes+e>>>2]=s.words[e>>>2];return this.sigBytes+=s.sigBytes,this}clamp(){this.words[this.sigBytes>>>2]&=4294967295<<32-this.sigBytes%4*8,this.words.length=Math.ceil(this.sigBytes/4)}clone(){return new x([...this.words])}}const nt={stringify(n){const s=[];for(let e=0;e<n.sigBytes;e++){const t=n.words[e>>>2]>>>24-e%4*8&255;s.push((t>>>4).toString(16),(t&15).toString(16))}return s.join("")}},st={stringify(n){const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=[];for(let t=0;t<n.sigBytes;t+=3){const r=n.words[t>>>2]>>>24-t%4*8&255,o=n.words[t+1>>>2]>>>24-(t+1)%4*8&255,u=n.words[t+2>>>2]>>>24-(t+2)%4*8&255,c=r<<16|o<<8|u;for(let i=0;i<4&&t*8+i*6<n.sigBytes*8;i++)e.push(s.charAt(c>>>6*(3-i)&63))}return e.join("")}},it={parse(n){const s=n.length,e=[];for(let t=0;t<s;t++)e[t>>>2]|=(n.charCodeAt(t)&255)<<24-t%4*8;return new x(e,s)}},ot={parse(n){return it.parse(unescape(encodeURIComponent(n)))}};class at{constructor(){this._minBufferSize=0,this.blockSize=512/32,this.reset()}reset(){this._data=new x,this._nDataBytes=0}_append(s){typeof s=="string"&&(s=ot.parse(s)),this._data.concat(s),this._nDataBytes+=s.sigBytes}_doProcessBlock(s,e){}_process(s){let e,t=this._data.sigBytes/(this.blockSize*4);s?t=Math.ceil(t):t=Math.max((t|0)-this._minBufferSize,0);const r=t*this.blockSize,o=Math.min(r*4,this._data.sigBytes);if(r){for(let u=0;u<r;u+=this.blockSize)this._doProcessBlock(this._data.words,u);e=this._data.words.splice(0,r),this._data.sigBytes-=o}return new x(e,o)}}class ct extends at{update(s){return this._append(s),this._process(),this}finalize(s){s&&this._append(s)}}const ut=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],lt=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998],_=[];class ft extends ct{constructor(){super(),this.reset()}reset(){super.reset(),this._hash=new x([...ut])}_doProcessBlock(s,e){const t=this._hash.words;let r=t[0],o=t[1],u=t[2],c=t[3],i=t[4],a=t[5],f=t[6],h=t[7];for(let l=0;l<64;l++){if(l<16)_[l]=s[e+l]|0;else{const w=_[l-15],P=(w<<25|w>>>7)^(w<<14|w>>>18)^w>>>3,B=_[l-2],M=(B<<15|B>>>17)^(B<<13|B>>>19)^B>>>10;_[l]=P+_[l-7]+M+_[l-16]}const d=i&a^~i&f,p=r&o^r&u^o&u,y=(r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22),m=(i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25),g=h+m+d+lt[l]+_[l],A=y+p;h=f,f=a,a=i,i=c+g|0,c=u,u=o,o=r,r=g+A|0}t[0]=t[0]+r|0,t[1]=t[1]+o|0,t[2]=t[2]+u|0,t[3]=t[3]+c|0,t[4]=t[4]+i|0,t[5]=t[5]+a|0,t[6]=t[6]+f|0,t[7]=t[7]+h|0}finalize(s){super.finalize(s);const e=this._nDataBytes*8,t=this._data.sigBytes*8;return this._data.words[t>>>5]|=128<<24-t%32,this._data.words[(t+64>>>9<<4)+14]=Math.floor(e/4294967296),this._data.words[(t+64>>>9<<4)+15]=e,this._data.sigBytes=this._data.words.length*4,this._process(),this._hash}}function ht(n){return new ft().finalize(n).toString(st)}function dt(n,s={}){const e=typeof n=="string"?n:rt(n,s);return ht(e).slice(0,10)}function yt(n){return n}function pt(n){return n.length===0?yt:n.length===1?n[0]:function(e){return n.reduce((t,r)=>r(t),e)}}function I(n){const s={subscribe(e){let t=null,r=!1,o=!1,u=!1;function c(){if(t===null){u=!0;return}o||(o=!0,typeof t=="function"?t():t&&t.unsubscribe())}return t=n({next(i){var a;r||(a=e.next)==null||a.call(e,i)},error(i){var a;r||(r=!0,(a=e.error)==null||a.call(e,i),c())},complete(){var i;r||(r=!0,(i=e.complete)==null||i.call(e),c())}}),u&&c(),{unsubscribe:c}},pipe(...e){return pt(e)(s)}};return s}function mt(n){return s=>{let e=0,t=null;const r=[];function o(){t||(t=s.subscribe({next(c){var i;for(const a of r)(i=a.next)==null||i.call(a,c)},error(c){var i;for(const a of r)(i=a.error)==null||i.call(a,c)},complete(){var c;for(const i of r)(c=i.complete)==null||c.call(i)}}))}function u(){if(e===0&&t){const c=t;t=null,c.unsubscribe()}}return{subscribe(c){return e++,r.push(c),o(),{unsubscribe(){e--,u();const i=r.findIndex(a=>a===c);i>-1&&r.splice(i,1)}}}}}}class T extends Error{constructor(s){super(s),this.name="ObservableAbortError",Object.setPrototypeOf(this,T.prototype)}}function gt(n){let s;return{promise:new Promise((t,r)=>{let o=!1;function u(){o||(o=!0,r(new T("This operation was aborted.")),c.unsubscribe())}const c=n.subscribe({next(i){o=!0,t(i),u()},error(i){o=!0,r(i),u()},complete(){o=!0,u()}});s=u}),abort:s}}class b extends Error{static from(s,e={}){return s instanceof Error?s.name==="TRPCClientError"?s:new b(s.message,{...e,cause:s,result:null}):new b(s.error.message??"",{...e,cause:void 0,result:s})}constructor(s,e){var r,o;const t=e==null?void 0:e.cause;super(s,{cause:t}),this.meta=e==null?void 0:e.meta,this.cause=t,this.shape=(r=e==null?void 0:e.result)==null?void 0:r.error,this.data=(o=e==null?void 0:e.result)==null?void 0:o.error.data,this.name="TRPCClientError",Object.setPrototypeOf(this,b.prototype)}}function bt(n,s){if("error"in n){const t=s.transformer.deserialize(n.error);return{ok:!1,error:{...n,error:t}}}return{ok:!0,result:{...n.result,...(!n.result.type||n.result.type==="data")&&{type:"data",data:s.transformer.deserialize(n.result.data)}}}}function v(n){return!!n&&!Array.isArray(n)&&typeof n=="object"}function _t(n,s){let e;try{e=bt(n,s)}catch{throw new b("Unable to transform response from server")}if(!e.ok&&(!v(e.error.error)||typeof e.error.error.code!="number"))throw new b("Badly formatted response from server");if(e.ok&&!v(e.result))throw new b("Badly formatted response from server");return e}function wt(n){return I(s=>{function e(r=0,o=n.op){const u=n.links[r];if(!u)throw new Error("No more links to execute - did you forget to add an ending link?");return u({op:o,next(i){return e(r+1,i)}})}return e().subscribe(s)})}const U=()=>{};function N(n,s){return new Proxy(U,{get(t,r){if(!(typeof r!="string"||r==="then"))return N(n,[...s,r])},apply(t,r,o){return n({args:o,path:s})}})}const L=n=>N(n,[]),$=n=>new Proxy(U,{get(s,e){if(!(typeof e!="string"||e==="then"))return n(e)}}),j=n=>typeof n=="function";function q(n,s){return j(n.bind)?n.bind(s):n}function xt(n){if(n)return n;if(typeof window<"u"&&j(window.fetch))return q(window.fetch,window);if(typeof globalThis<"u"&&j(globalThis.fetch))return q(globalThis.fetch,globalThis);throw new Error("No fetch implementation found")}function Bt(n){return n||(typeof window<"u"&&window.AbortController?window.AbortController:typeof globalThis<"u"&&globalThis.AbortController?globalThis.AbortController:null)}function Pt(n){const s=n.headers||(()=>({}));return{url:n.url,fetch:xt(n.fetch),AbortController:Bt(n.AbortController),headers:typeof s=="function"?s:()=>s}}function Ct(n){const s={};for(let e=0;e<n.length;e++){const t=n[e];s[e]=t}return s}const St={query:"GET",mutation:"POST"};function H(n){return"input"in n?n.runtime.transformer.serialize(n.input):Ct(n.inputs.map(s=>n.runtime.transformer.serialize(s)))}function F(n){let s=n.url+"/"+n.path;const e=[];if("inputs"in n&&e.push("batch=1"),n.type==="query"){const t=H(n);t!==void 0&&e.push(`input=${encodeURIComponent(JSON.stringify(t))}`)}return e.length&&(s+="?"+e.join("&")),s}function kt(n){if(n.type==="query")return;const s=H(n);return s!==void 0?JSON.stringify(s):void 0}function jt(n){const{type:s}=n,e=n.AbortController?new n.AbortController:null;return{promise:new Promise((o,u)=>{const c=F(n),i=kt(n),a={};Promise.resolve(n.headers()).then(f=>{/* istanbul ignore if -- @preserve */if(s==="subscription")throw new Error("Subscriptions should use wsLink");return n.fetch(c,{method:St[s],signal:e==null?void 0:e.signal,body:i,headers:{"content-type":"application/json",...f}})}).then(f=>(a.response=f,f.json())).then(f=>{o({json:f,meta:a})}).catch(u)}),cancel:()=>{e==null||e.abort()}}}const S=()=>{throw new Error("Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new")};function k(n){let s=null,e=null;const t=()=>{clearTimeout(e),e=null,s=null};function r(c){const i=[[]];let a=0;for(;;){const f=c[a];if(!f)break;const h=i[i.length-1];if(f.aborted){f.reject(new Error("Aborted")),a++;continue}if(n.validate(h.concat(f).map(d=>d.key))){h.push(f),a++;continue}if(h.length===0){f.reject(new Error("Input is too big for a single dispatch")),a++;continue}i.push([])}return i}function o(){const c=r(s);t();for(const i of c){if(!i.length)continue;const a={items:i,cancel:S};for(const l of i)l.batch=a;const{promise:f,cancel:h}=n.fetch(a.items.map(l=>l.key));a.cancel=h,f.then(l=>{for(let d=0;d<l.length;d++){const p=l[d],y=a.items[d];y.resolve(p),y.batch=null}}).catch(l=>{for(const d of a.items)d.reject(l),d.batch=null})}}function u(c){const i={aborted:!1,key:c,batch:null,resolve:S,reject:S},a=new Promise((h,l)=>{i.reject=l,i.resolve=h,s||(s=[]),s.push(i)});return e||(e=setTimeout(o)),{promise:a,cancel:()=>{var h;i.aborted=!0,(h=i.batch)!=null&&h.items.every(l=>l.aborted)&&(i.batch.cancel(),i.batch=null)}}}return{load:u}}function Tt(n){const s=Pt(n);return e=>{const t=n.maxURLLength||1/0,r=a=>({validate:l=>{if(t===1/0)return!0;const d=l.map(m=>m.path).join(","),p=l.map(m=>m.input);return F({...s,runtime:e,type:a,path:d,inputs:p}).length<=t},fetch:l=>{const d=l.map(g=>g.path).join(","),p=l.map(g=>g.input),{promise:y,cancel:m}=jt({...s,runtime:e,type:a,path:d,inputs:p});return{promise:y.then(g=>(Array.isArray(g.json)?g.json:l.map(()=>g.json)).map(P=>({meta:g.meta,json:P}))),cancel:m}}}),o=k(r("query")),u=k(r("mutation")),c=k(r("subscription")),i={query:o,subscription:c,mutation:u};return({op:a})=>I(f=>{const h=i[a.type],{promise:l,cancel:d}=h.load(a);return l.then(p=>{const y=_t(p.json,e);if(!y.ok){f.error(b.from(y.error,{meta:p.meta}));return}f.next({context:p.meta,result:y.result}),f.complete()}).catch(p=>f.error(b.from(p))),()=>{d()}})}}class At{$request({type:s,input:e,path:t,context:r={}}){return wt({links:this.links,op:{id:++this.requestId,type:s,path:t,input:e,context:r}}).pipe(mt())}requestAsPromise(s){const e=this.$request(s),{promise:t,abort:r}=gt(e);return new Promise((u,c)=>{var i;(i=s.signal)==null||i.addEventListener("abort",r),t.then(a=>{u(a.result.data)}).catch(a=>{c(b.from(a))})})}query(s,e,t){return this.requestAsPromise({type:"query",path:s,input:e,context:t==null?void 0:t.context,signal:t==null?void 0:t.signal})}mutation(s,e,t){return this.requestAsPromise({type:"mutation",path:s,input:e,context:t==null?void 0:t.context,signal:t==null?void 0:t.signal})}subscription(s,e,t){return this.$request({type:"subscription",path:s,input:e,context:t==null?void 0:t.context}).subscribe({next(o){var u,c,i;o.result.type==="started"?(u=t.onStarted)==null||u.call(t):o.result.type==="stopped"?(c=t.onStopped)==null||c.call(t):(i=t.onData)==null||i.call(t,o.result.data)},error(o){var u;(u=t.onError)==null||u.call(t,o)},complete(){var o;(o=t.onComplete)==null||o.call(t)}})}constructor(s){this.requestId=0;function e(){const t=s.transformer;return t?"input"in t?{serialize:t.input.serialize,deserialize:t.output.deserialize}:t:{serialize:r=>r,deserialize:r=>r}}this.runtime={transformer:e()},this.links=s.links.map(t=>t(this.runtime))}}const Dt={query:"query",mutate:"mutation",subscribe:"subscription"};function Ot(n){return $(s=>n.hasOwnProperty(s)?n[s]:L(({path:e,args:t})=>{const r=[s,...e],o=r.pop(),u=Dt[o],c=r.join(".");return n[u](c,...t)}))}function zt(n){const s=new At(n);return Ot(s)}function vt(n,s){return globalThis.$fetch.raw(n.toString(),s).catch(e=>{if(e instanceof V&&e.response)return e.response;throw e}).then(e=>({...e,json:()=>Promise.resolve(e._data)}))}function qt(n){const s=X(n==null?void 0:n.pickHeaders);return Tt({url:"/api/trpc",headers(){return s},fetch:vt,...n})}function Et(n,s){return s===void 0?n:`${n}-${dt(s||"")}`}function Rt(n,s){return L(e=>{const t=e.args,r=[n,...e.path],o=r.pop(),u=r.join("."),[c,i]=t;if(o==="useQuery"){const{trpc:a,...f}=i||{};let h;a!=null&&a.abortOnUnmount&&(E()&&G(()=>{var d;(d=h==null?void 0:h.abort)==null||d.call(h)}),h=typeof AbortController<"u"?new AbortController:{});const l=Et(u,c);return Z(l,()=>s[u].query(c,{signal:h==null?void 0:h.signal,...a}),f)}return s[u][o](...t)})}function It(n){const s=zt(n);return $(t=>Rt(t,s))}function Nt(){return It({links:[qt({url:"/api/trpc/"})]})}export{Nt as u};