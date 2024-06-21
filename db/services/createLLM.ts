import {
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";

import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { ILLM } from "../schemas/LLM";

export const createLLMInsideDB = async (
    persistence: IPersistence,
    modify: IModify,
    read: IRead,
    logger: ILogger,
    llmData: ILLM,
    appId: string
  ) => {
    
    const newLLMAssociation = new RocketChatAssociationRecord(
        RocketChatAssociationModel.MISC,
        appId
    );    

    await persistence.createWithAssociation(llmData ,newLLMAssociation);
}