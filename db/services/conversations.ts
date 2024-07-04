import { ILogger, IRead, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
import {
  RocketChatAssociationModel,
  RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import {IConversation} from "../schemas/Conversation"
import {IUserLLM} from "../schemas/User"
import { createNewUser, getUserByID } from "../../helpers";


export const getAllConversationsIDS = async (
    read: IRead,
    persistence: IPersistence,
    userID: string
): Promise<string[]> => {
    let reqDBData= await getUserByID(read, userID)

    if(!reqDBData || !reqDBData.length){
        const newUserData = await createNewUser(persistence, userID)
        reqDBData = [newUserData]
    }

    const finalData: IUserLLM = reqDBData[0] as IUserLLM

  return finalData.conversations;
}