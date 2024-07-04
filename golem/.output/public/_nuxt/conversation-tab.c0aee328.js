import{_ as j}from"./long-press-button.255e7e1b.js";import{u as A}from"./conversation.48b3da9f.js";import{a as G,W as O,r as m,al as W,f as X,j as k,s as q,H as F,X as J,o as l,b as d,i as c,e as _,w as g,u as e,k as v,T as y,m as C,x as V,y as K,z as Q,p as Y,t as Z,c as ee,A as te}from"./entry.381c0f38.js";import{_ as ne}from"./_plugin-vue_export-helper.c27b6911.js";const ae={class:"grid",grid:"","items-center":"","w-full":"","box-border":""},oe={"col-start-1":"","col-end-1":""},se={flex:"","items-center":""},re={key:0,"i-tabler-edit":"","text-18px":"","mr-1":""},ie={key:0,"i-eos-icons-bubble-loading":"","text-18px":"","mr-1":""},le=["readonly","onDblclick"],ce={key:0,"text-gray-5":"","text-10px":"","sm:text-13px":"","dark:text-gray-4":"","max-w-190px":"",truncate:"","inline-block":""},ue={"col-start-2":"","col-end-2":""},de=G({__name:"conversation-tab",props:{conversation:null},setup(h){const n=h,{currentConversation:r,conversationList:u,isTyping:H,switchConversation:b,deleteConversation:w,createConversation:N,updateConversation:z}=A(),{isMobile:L}=O(),T=m(),D=m(),P=W(T),B=X(),E=k(()=>r.value===null?!1:r.value.id===n.conversation.id&&["/","/chat"].includes(B.path)),I=k(()=>r.value===null?!1:H.value[n.conversation.id]),M=k(()=>n.conversation.messages.length===0?null:n.conversation.messages[n.conversation.messages.length-1]),R=async()=>{B.path!=="/"&&te("/"),!E.value&&await b(n.conversation.id)},p=m(),o=m(!1);q(()=>{n.conversation.title&&(p.value=n.conversation.title)});const S=()=>{o.value=!0},U=async s=>{var t;r.value!==null&&await z((t=r.value)==null?void 0:t.id,{title:s.target.value})};F(D,()=>{o.value=!1});const $=async s=>{var a;if(u.value===null)return;if(!(((a=r.value)==null?void 0:a.id)===s)){await w(s);return}const x=u.value.findIndex(i=>i.id===s),f=u.value[x+1]||u.value[x-1];if(f)await b(f.id);else if(u.value.length===1){const i=await N("Untitled Conversation");await b(i.id)}await w(s)};return(s,t)=>{const x=j,f=J("tooltip");return l(),d("div",{ref_key:"element",ref:T,relative:""},[c("div",{transition:"","text-gray-600":"","dark:text-gray-3":"","cursor-pointer":"","p-1":"","px-3":"","sm:p-2":"","sm:px-3":"",class:C(["shadow-gray-900/5",[e(E)?"bg-white text-gray-600 shadow-md dark:bg-dark-1 dark:text-gray-1":"hover:bg-gray-100 hover:dark:bg-dark-3"]]),"text-12px":"","sm:text-15px":"","w-full":"","box-border":"","active:translate-y-2px":"",onClick:R},[c("div",ae,[c("div",oe,[c("div",se,[_(y,{name:"appear-left"},{default:g(()=>[e(o)?(l(),d("div",re)):v("",!0)]),_:1}),_(y,{name:"appear-left"},{default:g(()=>[!e(o)&&e(I)?(l(),d("div",ie)):v("",!0)]),_:1}),_(y,{name:"appear-left"},{default:g(()=>{var a,i;return[!e(o)&&!e(I)?(l(),d("div",{key:0,"text-18px":"","mr-1":"",class:C([(i=(a=h.conversation)==null?void 0:a.metadata)!=null&&i.favorite?"i-tabler-star-filled text-amber":"i-tabler-message-chatbot"])},null,2)):v("",!0)]}),_:1}),V(c("input",{ref_key:"inputElement",ref:D,"onUpdate:modelValue":t[0]||(t[0]=a=>Q(p)?p.value=a:null),readonly:!e(o),"bg-transparent":"","border-none":"","outline-none":"","p-0":"",transition:"","font-bold":"","mr-3":"",truncate:"","text-10px":"","sm:text-14px":"","h-1.75em":"","w-full":"",class:C([e(o)?"text-gray-900 dark:text-gray-1 select-all":"text-gray-700 dark:text-gray-3 select-none cursor-pointer"]),onBlur:t[1]||(t[1]=a=>o.value=!1),onInput:U,onDblclick:Y(S,["stop"])},null,42,le),[[K,e(p)]])]),e(M)?(l(),d("div",ce,Z(e(M).text),1)):v("",!0)]),c("div",ue,[_(y,{name:"appear-right"},{default:g(()=>[e(P)||e(L)?V((l(),ee(x,{key:0,duration:800,icon:"i-tabler-x text-13px","rounded-2px":"",small:"",block:"",class:"!relative","success-style":"!ring-red-500 !text-red-7","progress-bar-style":"bg-red/50",onSuccess:t[2]||(t[2]=a=>$(n.conversation.id))},null,512)),[[f,{content:"Press and hold to delete conversation",delay:450}]]):v("",!0)]),_:1})])])],2)],512)}}});const me=ne(de,[["__scopeId","data-v-7d9f52f0"]]);export{me as _};