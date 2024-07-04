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
<title>Golem</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
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
<link rel="icon" href="/_nuxt/icons/64x64.7ac2c7b2.png">
<link rel="apple-touch-icon" href="/_nuxt/icons/512x512.maskable.7ac2c7b2.png" sizes="512x512">
<link rel="manifest" href="/manifest.json"><link rel="modulepreload" as="script" crossorigin href="/_nuxt/entry.9a773cc7.js"><link rel="preload" as="style" href="/_nuxt/entry.1008e4b1.css"><link rel="prefetch" as="script" crossorigin href="/_nuxt/prefix.middleware.6c436002.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/blank.e4721e58.js"><link rel="prefetch" as="style" href="/_nuxt/setup.7bd32f24.css"><link rel="prefetch" as="script" crossorigin href="/_nuxt/setup.d68652b8.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/_plugin-vue_export-helper.c27b6911.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/appearence.ab15dd4a.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/composables.91487213.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/shiki.59df06ec.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/idb.2861edbd.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/deta.549ffbe9.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/trpc.749db11f.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/log.2adae07e.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/conversation.59e8ca78.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/index.browser.7e542916.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/language-model.629e85c6.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/persona.f1f5f525.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/client-only.955ab5a5.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/default.65ed0367.js"><link rel="prefetch" as="style" href="/_nuxt/skeleton.8b8464be.css"><link rel="prefetch" as="script" crossorigin href="/_nuxt/skeleton.ec9d0163.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/ui.712d2ff9.js"><link rel="prefetch" as="script" crossorigin href="/_nuxt/error-component.d84d9b22.js"><link rel="stylesheet" href="/_nuxt/entry.1008e4b1.css"><script>"use strict";const w=window,de=document.documentElement,knownColorSchemes=["dark","light"],preference=window.localStorage.getItem("nuxt-color-mode")||"system";let value=preference==="system"?getColorScheme():preference;const forcedColorMode=de.getAttribute("data-color-mode-forced");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w["__NUXT_COLOR_MODE__"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.add(o):de.className+=" "+o,t&&de.setAttribute("data-"+t,e)}function removeColorScheme(e){const o=""+e+"",t="";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,"g"),""),t&&de.removeAttribute("data-"+t)}function prefersColorScheme(e){return w.matchMedia("(prefers-color-scheme"+e+")")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme("").media!=="not all"){for(const e of knownColorSchemes)if(prefersColorScheme(":"+e).matches)return e}return"light"}
</script><script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}
</script></head>
<body ><div id="__nuxt"></div><script>window.__NUXT__=(function(a,b,c,d,e,f,g,h,i,j,k){return {serverRendered:false,config:{public:{pwaManifest:{name:"Golem",short_name:d,description:"Golem is an open-source, amazingly crafted conversational UI and alternative to ChatGPT.",lang:"en",start_url:"\u002F?standalone=true",display:"standalone",background_color:"#f5f5f5",theme_color:"#3f3f3f",icons:[{src:"\u002F_nuxt\u002Ficons\u002F64x64.7ac2c7b2.png",type:a,sizes:e,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F64x64.maskable.7ac2c7b2.png",type:a,sizes:e,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F120x120.7ac2c7b2.png",type:a,sizes:f,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F120x120.maskable.7ac2c7b2.png",type:a,sizes:f,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F144x144.7ac2c7b2.png",type:a,sizes:g,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F144x144.maskable.7ac2c7b2.png",type:a,sizes:g,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F152x152.7ac2c7b2.png",type:a,sizes:h,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F152x152.maskable.7ac2c7b2.png",type:a,sizes:h,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F192x192.7ac2c7b2.png",type:a,sizes:i,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F192x192.maskable.7ac2c7b2.png",type:a,sizes:i,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F384x384.7ac2c7b2.png",type:a,sizes:j,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F384x384.maskable.7ac2c7b2.png",type:a,sizes:j,purpose:c},{src:"\u002F_nuxt\u002Ficons\u002F512x512.7ac2c7b2.png",type:a,sizes:k,purpose:b},{src:"\u002F_nuxt\u002Ficons\u002F512x512.maskable.7ac2c7b2.png",type:a,sizes:k,purpose:c}],categories:["productivity","education"],id:"golem-1720117482069"}},app:{baseURL:"\u002F",buildAssetsDir:"\u002F_nuxt\u002F",cdnURL:d}},data:{},state:{}}}("image\u002Fpng","any","maskable","","64x64","120x120","144x144","152x152","192x192","384x384","512x512"))</script><script type="module" src="/_nuxt/entry.9a773cc7.js" crossorigin></script></body>
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