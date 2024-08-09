import {
    IAppAccessors,
    ILogger,
    IRead,
    IHttp,
    IAppInstallationContext,
    IPersistence,
    IModify,
    IConfigurationExtend
} from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { join } from 'path';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { Block } from "@rocket.chat/ui-kit";
import {
    ApiSecurity,
    ApiVisibility,
} from "@rocket.chat/apps-engine/definition/api";
import {
    ButtonElement,
    SectionBlock,
    PlainText,
    LayoutBlockType,
    Markdown,
    ActionsBlock,
    PlainTextInputElement,
    InputBlock,
    Option,
  } from "@rocket.chat/ui-kit";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
  } from "@rocket.chat/apps-engine/definition/metadata";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";
import {
    ApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";
import {addNewConversationToUser, addNewMessageToConversation, BaseContent, checkOrCreateUser, conversateWithLLM, createNewConversation, generateUUID, getConversationWithID} from "./helpers"
import {EntriJScompressedString, PagePayloadCompressedString} from "./bundle"
import { Buffer } from "buffer";
import {MISTRAL, LLAMA} from "./contants"
import {IConversation, IMessageLLM} from "./db/schemas/Conversation"
import {IUserLLM} from "./db/schemas/User"
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { promises as fs } from 'fs';
import {Base} from "./BaseCommand"
import { getAllConversationsIDS } from './db/services/conversations';

const Storage = {
    "USER":{},
    "CONVERSATION":{},
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
export class LLMPromptApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async initialize(
        configuration: IConfigurationExtend
    ): Promise<void> {

        configuration.ui.registerButton({
            actionId: "create-whiteboard-message-box-action-id",
            labelI18n: "create_whiteboard",
            context: UIActionButtonContext.MESSAGE_BOX_ACTION,
        });

        await configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [
                new BaseChatEndpoint(this),
                new EntryNuxtJSEndpoint(this),
                new PagePayloadEndpoint(this),
                new GetAllLLMEndpoint(this),
                new ConversateEndpoint(this),
                new FetchAllConversations(this),
                new FetchConversationWithID(this),
            ],
        });

        const llmPromptCommand: Base = new Base(this.getLogger(), this.getID());
        await configuration.slashCommands.provideSlashCommand(llmPromptCommand);
    }
}

export class BaseChatEndpoint extends ApiEndpoint {
    public path = `prompt-editor/chat`;
    public async get(request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Content-Type": "text/html",
                "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content:BaseContent,
        };
    }
}

export class EntryNuxtJSEndpoint extends ApiEndpoint {
    public path = `_nuxt/entryLLM.js`;
    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const content = Buffer.from(EntriJScompressedString, "base64");
        return {
            status: 200,
            headers: {
                "Content-Type": "text/javascript",
                "Content-Encoding": "br",
            },
            content 
        };
    }
}

export class PagePayloadEndpoint extends ApiEndpoint {
    public path = `prompt-editor/chat/_payload.js`;
    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const content = Buffer.from(PagePayloadCompressedString, "base64");
        return {
            status: 200,
            headers: {
                "Content-Type": "text/javascript",
                "Content-Encoding": "br",
            },
            content,
        };
    }
}

export class ConversateEndpoint extends ApiEndpoint {
    public path = "/conversate";

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        try {
            if(!request.user){
                return {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Security-Policy":
                        "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                    },
                    content: "No user"
                };
            }
            // Replace with the actual path to your index.mjs file
            const conversationId: string | null = request.content.conversationId
            const message: string = request.content.message;

            let finalOutput: IMessageLLM

            await checkOrCreateUser(read, persis, request.user.id)

            if (!conversationId) {
                const reply = await conversateWithLLM(http, message, request.user.id, read)
                const convID = await createNewConversation(persis, request.user.id)
                await addNewConversationToUser(read, persis, request.user.id, convID)
                // save to persistence storage
                let messages : IMessageLLM[] = [
                    {
                        sentBy: "system",
                        message
                    },
                    {
                        sentBy: "assistant",
                        message: reply
                    }
                ]

                await addNewMessageToConversation(read, persis, request.user.id, convID, messages)

                return {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Security-Policy":
                        "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                    },
                    content: {
                        sentBy: "assistant",
                        message: reply,
                        conversationId: convID
                    },
                }
            }
            else {
                const reply =  await conversateWithLLM(http, message, request.user.id, read)
                let messages : IMessageLLM[] = [
                    {
                        sentBy: "system",
                        message
                    },
                    {
                        sentBy: "assistant",
                        message: reply
                    }
                ]

                await addNewMessageToConversation(read, persis, request.user.id, conversationId, messages)
                return {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Security-Policy":
                        "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                    },
                    content: {
                        sentBy: "assistant",
                        message: reply,
                        conversationId: conversationId
                    },
                }
            }

        } catch (error) {
            return {
                status: 500,
                content: `Error reading file: ${error.message}`,
            };
        }
    }
}


export class GetAllLLMEndpoint extends ApiEndpoint {
    public path = "all-llms";

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: [MISTRAL, LLAMA],
        };
    }
}

export class FetchAllConversations extends ApiEndpoint {
    public path = "all-conversations";

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {

        if(!request.user){
            return {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                },
                content: "No user"
            };
        }

        const conversationIDs = await getAllConversationsIDS(read, persis, request.user.id);

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: {
                conversationIDs
            }
        };
    }
}

export class FetchConversationWithID extends ApiEndpoint {
    public path = "conversation-with-id";

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const currentUser = request.user

        if(!currentUser){
            return {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                },
                content: "No user"
            };
        }

        if(!request.content.conversationId){
            return {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                },
                content: "No conv id"
            };
        }

        const conversationData = await getConversationWithID(read, request.content.conversationId)

        if(!conversationData){
            return {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                },
                content: "Invalid conv id",
            };
        }

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: conversationData,
        };
    }
}
