import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
  IHttp,
  ILogger,
  IMessageBuilder,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

import { PlainText, ButtonElement, Block } from "@rocket.chat/ui-kit";

import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IUserLLM } from "./db/schemas/User";
import { IConversation, IMessageLLM } from "./db/schemas/Conversation";

export const BaseContent=`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1">
<title>Golem</title>
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Golem">
<meta name="author" content="Henrique Cunha">
<meta name="description" content="Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.">
<meta name="theme-color" content="#3f3f3f">
<meta property="og:type" content="website">
<meta property="og:url" content="https://golem.chat/">
<meta property="og:title" content="Golem">
<meta property="og:site_name" content="app.golem.chat">
<meta property="og:description" content="Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.">
<meta property="og:image" content="https://golem.chat/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="golem.chat">
<meta name="twitter:creator" content="@henrycunh">
<link rel="icon" href="/_nuxt/icons/64x64.283bdbe1.png" data-hid="2c9d455">
<link rel="apple-touch-icon" href="/_nuxt/icons/512x512.maskable.283bdbe1.png" sizes="512x512" data-hid="bc1de16">
<link rel="manifest" href="/manifest.json">
<meta name="description" content="Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.">
<meta property="og:image" content="/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="150x150" href="/mstile-150x150.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="256x256" href="/android-chrome-256x256.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"><link rel="modulepreload" href="/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/prompt-editor/chat/_payload.js"><link rel="modulepreload" as="script" crossorigin href="/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/_nuxt/entryLLM.js"><style>
body {
    transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;
    margin: 0;
    /* background-color: #f9fafb; */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}.dark body{--un-bg-opacity:1;background-color:rgba(34,34,34,var(--un-bg-opacity));}.light body{--un-bg-opacity:1;background-color:rgba(250,250,251,var(--un-bg-opacity));}

/** Dark mode scrollbar */
html.dark ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
}
html.dark ::-webkit-scrollbar-thumb {
        background: hsla(0,0%,100%,.2);
        border-radius: 4px;
}
html.dark ::-webkit-scrollbar-thumb:hover {
        background: hsla(0,0%,100%,.4);
}
html.dark ::-webkit-scrollbar-track {
        background: hsla(0,0%,100%,.1);
        border-radius: 4px;
}
</style><style>
@keyframes pulse-4e87ae58 {
0% {
        transform: scale(1);
}
50% {
        transform: scale(1.4);
}
to {
        transform: scale(1);
}
}
img[data-v-4e87ae58] {
    animation: pulse-4e87ae58 2s infinite;
}
</style><script>"use strict";const w=window,de=document.documentElement,knownColorSchemes=["dark","light"],preference=window.localStorage.getItem("nuxt-color-mode")||"system";let value=preference==="system"?getColorScheme():preference;const forcedColorMode=de.getAttribute("data-color-mode-forced");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w["__NUXT_COLOR_MODE__"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.add(o):de.className+=" "+o,t&&de.setAttribute("data-"+t,e)}function removeColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,"g"),""),t&&de.removeAttribute("data-"+t)}function prefersColorScheme(e){return w.matchMedia("(prefers-color-scheme"+e+")")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme("").media!=="not all"){for(const e of knownColorSchemes)if(prefersColorScheme(":"+e).matches)return e}return"light"}
</script><script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}
</script></head>
<body ><div id="__nuxt"><div relative overflow-hidden h-100vh w-screen class=""><!--[--><!--[--><div fixed inset-0 class="dark:bg-dark-4 light:bg-gray-1/40" flex items-center justify-center text-color text-7 data-v-4e87ae58><img src="/image/logo-splash.svg" w-40 z-2 data-v-4e87ae58><img absolute src="/image/logo-splash.svg" w-40 blur-30 z-1 data-v-4e87ae58></div><!--]--><!--]--></div></div><script type="module">import p from "/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/prompt-editor/chat/_payload.js";window.__NUXT__={...p,...((function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){return {state:{"$scolor-mode":{preference:e,value:e,unknown:f,forced:d},"$sgolem-instance-api-key":null,"$sgolem-is-password-required":d,"$sis-logged-in":d},_errors:{},serverRendered:f,config:{public:{pwaManifest:{name:"Golem",short_name:g,description:"Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.",lang:"en",start_url:"\u002F?standalone=true",display:"standalone",background_color:"#f5f5f5",theme_color:"#3f3f3f",icons:[{src:"\u002F_nuxt\u002Ficons\u002F64x64.283bdbe1.png",type:a,sizes:h,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F64x64.maskable.283bdbe1.png",type:a,sizes:h,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F120x120.283bdbe1.png",type:a,sizes:i,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F120x120.maskable.283bdbe1.png",type:a,sizes:i,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F144x144.283bdbe1.png",type:a,sizes:j,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F144x144.maskable.283bdbe1.png",type:a,sizes:j,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F152x152.283bdbe1.png",type:a,sizes:k,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F152x152.maskable.283bdbe1.png",type:a,sizes:k,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F192x192.283bdbe1.png",type:a,sizes:l,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F192x192.maskable.283bdbe1.png",type:a,sizes:l,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F384x384.283bdbe1.png",type:a,sizes:m,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F384x384.maskable.283bdbe1.png",type:a,sizes:m,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F512x512.283bdbe1.png",type:a,sizes:n,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F512x512.maskable.283bdbe1.png",type:a,sizes:n,purpose:c}],categories:["productivity","education"],id:"golem-1721826291003"}},app:{baseURL:"\u002F",buildAssetsDir:"\u002F_nuxt\u002F",cdnURL:g}},prerenderedAt:1721826307604}}("image\u002Fpng","any","maskable",false,"system",true,"","64x64","120x120","144x144","152x152","192x192","384x384","512x512")))}</script><script type="module" src="/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/_nuxt/entryLLM.js" crossorigin></script></body>
</html>`

export const sendNotification = async (
  context: SlashCommandContext,
  modify: IModify,
  read: IRead,
  messageBlocks: Array<Block>
) => {
  const appUser = (await read.getUserReader().getAppUser()) as IUser;
  const room = context.getRoom();
  const user = context.getSender();

  const msg = modify
    .getCreator()
    .startMessage()
    .setSender(appUser)
    .setRoom(room);

  msg.setBlocks(messageBlocks);

  return read.getNotifier().notifyUser(user, msg.getMessage());
};

export const generateUUID = (): string => {
  function randomHexDigit() {
      return Math.floor(Math.random() * 16).toString(16);
  }

  function randomHexDigitInRange8ToB() {
      return (8 + Math.floor(Math.random() * 4)).toString(16);
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      if (c === 'x') {
          return randomHexDigit();
      } else {
          return randomHexDigitInRange8ToB();
      }
  });
}


export const createNewConversation = async(persistence: IPersistence, userID: string): Promise<string> => {
  const convID = generateUUID()
  const newBotAssociation = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MESSAGE,
    convID
  );

  await persistence.createWithAssociation(
    { creator: userID, messages: [] },
    newBotAssociation
  );

  return convID
  
}

export const getConversationWithID = async(read: IRead, convID: string): Promise<IConversation> => {
  const convData = await read
  .getPersistenceReader()
  .readByAssociation(
    new RocketChatAssociationRecord(
      RocketChatAssociationModel.MESSAGE,
      convID
    )
  )
  return convData[0] as IConversation;
}

export const createNewUser = async(persistence: IPersistence, userID: string): Promise<IUserLLM> => {

  const baseData =  { conversations: [] }
  
  const newBotAssociation = new RocketChatAssociationRecord(
    RocketChatAssociationModel.USER,
    userID
  );


  await persistence.createWithAssociation(
    baseData,
    newBotAssociation
  );

  return baseData as IUserLLM

}

export const getUserByID = async(read: IRead, userID: string): Promise<Object[]> => {
  const userData = await read
  .getPersistenceReader()
  .readByAssociation(
    new RocketChatAssociationRecord(
      RocketChatAssociationModel.USER,
      userID
    )
  )

  return userData
}

export const addNewConversationToUser = async(read: IRead, persistence: IPersistence, userID: string, convID: string): Promise<void> => {
  await checkOrCreateUser(read, persistence, userID)

  const userData = await getUserByID(read, userID)
  
  const typeUser = userData[0] as IUserLLM

  typeUser.conversations.push(convID)

  const newUserData = {
    ...typeUser,
    conversations: typeUser.conversations
  }

  await persistence.updateByAssociation(
    new RocketChatAssociationRecord(
      RocketChatAssociationModel.USER,
      userID
    ),
    newUserData
  )

  return
  
}

export const addNewMessageToConversation = async(read: IRead, persistence: IPersistence, userID: string, convID: string, newMessages: IMessageLLM[]): Promise<void> => {
  await checkOrCreateUser(read, persistence, userID)

  const convData = await getConversationWithID(read, convID)

  const newConvData = {
    ...convData,
    messages: convData.messages.concat(newMessages)
  }

  await persistence.updateByAssociation(
    new RocketChatAssociationRecord(
      RocketChatAssociationModel.MESSAGE,
      convID
    ),
    newConvData
  )

  return
  
}

// export const addNewMessageToConversation = (persistence: IPersistence):


export const checkOrCreateUser = async(read: IRead, persistence: IPersistence, userID: string): Promise<void> => {
  const user = await getUserByID(read, userID)

  if(!user || !user.length) {
    await createNewUser(persistence, userID)
  }

  return
}


export const conversateWithLLM = async(http: IHttp, message: string): Promise<string> => {
  const {data : response} = await http.post('https://jusbills-gpt4-vision.openai.azure.com/openai/deployments/jusbills-gpt4-vision/chat/completions?api-version=2024-02-15-preview', {
    data: {
        "messages": [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": message
              }
            ]
          }
        ],
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 800
      },
    headers: {
        'api-key': `b95b3975e68640e9b57161e5098d856c`,
        'Content-Type': 'application/json'
    }
    });
    const reply = response.choices[0].message.content as string

    return reply
}