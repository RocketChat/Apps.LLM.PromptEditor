import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
  IHttp,
  IModify,
  IPersistence,
  IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

import { Block } from "@rocket.chat/ui-kit";

import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IUserLLM } from "./db/schemas/User";
import { IConversation, IMessageLLM } from "./db/schemas/Conversation";
import {request} from "http"

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

export const createNewConversation = async(persistence: IPersistence, userID: string, convID: string): Promise<string> => {
  const newConvAssociation = new RocketChatAssociationRecord(
    RocketChatAssociationModel.MESSAGE,
    convID
  );

  const conversation = await persistence.createWithAssociation(
    { creator: userID, messages: [] },
    newConvAssociation
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

export const getOrCreateConversation = async (read: IRead, persistence: IPersistence, convID: string, userID: string): Promise<String>  => {
  const conversation = await getConversationWithID(read, convID)
  console.log('conversation : ', conversation);
  if(!conversation) {
    console.log('conversation not found, creating new one');
    await createNewConversation(persistence, userID, convID)
    await addNewConversationToUser(read, persistence, userID, convID)
  }

  return convID
}

export const addNewMessageToConversation = async(read: IRead, persistence: IPersistence, userID: string, convID: string, newMessages: IMessageLLM[]): Promise<void> => {

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

const processingData: any = {
  "test": {
    startedStreaming: false,
    chunks: []
  },
}

// const exportData = async(http, content) => {
//   await http.post("https://9baa-2405-201-3036-4833-a83c-5610-286e-4940.ngrok-free.app/post", {
//     data: { content: content }
//   });
// }

const startChat = async(read, http, messages, msgId) => {

  const postData = JSON.stringify({
    model: "./dist/Llama-2-7b-chat-hf-q4f16_1-MLC/",
    stream: true,
    messages
});


  const options = {
      hostname: "llama3-8b",
      port: 80,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
      },
  };

  const req = request(options, async (res) => {
    let buffer = "";
    
    res.on("data", async (chunk) => {
      buffer += chunk.toString()
  
      let boundary = buffer.indexOf("\n");
      while (boundary !== -1) {
        const chunkStr = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 1);
  
        if (chunkStr.startsWith("data:") && chunkStr.includes("choices")) {
          const jsonStr = chunkStr.slice(5).trim();
          try {
            const parsedChunk = JSON.parse(jsonStr);
            const content = parsedChunk.choices[0].delta.content || "";
            // await exportData(http, content)
            processingData[msgId].chunks.push(content);

          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
        if (chunkStr.includes("[DONE]")) {
          res.destroy();
          processingData[msgId].chunks.push("%ended%");
          processingData[msgId].startedStreaming = false;
          break;
        }
  
        boundary = buffer.indexOf("\n");
      }
    });
  
    res.on("end", async () => {
        processingData[msgId].startedStreaming = false;
        // await exportData(http, "%ended%")
    });
});

req.write(postData);
req.end();

}

const splitChunks = (msgId) => {
  const current = processingData[msgId].chunks.join(" ")
  processingData[msgId].chunks = []

  return current
}

export const conversateWithLLM = async (http: IHttp, messages: Array<any>, msgId: string, read: IRead): Promise<string> => {

  try {
    return "Hey wssup %ended%"
    if(!processingData[msgId]) {
      processingData[msgId] = {
        startedStreaming: false,
        chunks: []
      }
    }

    if(!processingData[msgId].startedStreaming) {
      if(processingData[msgId].chunks.length) {
        processingData[msgId].chunks.push("%ended%")
        return splitChunks(msgId)
      }
      processingData[msgId].startedStreaming = true;
      startChat(read, http, messages, msgId)
      return ""
  }

  if(processingData[msgId].startedStreaming) {
    return splitChunks(msgId)
  }
} catch(error) {
  return "Hey wssup %ended%"
  processingData[msgId].chunks.push("%ended%")
  processingData[msgId].startedStreaming = false;
  return splitChunks(msgId)
}

return ""
}