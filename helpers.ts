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
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Editor</title>
    <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
    <div id="root"></div>
    <script src="./bundle.js"></script>
</body>
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