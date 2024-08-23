import {
    IAppAccessors,
    ILogger,
    IRead,
    IHttp,
    IPersistence,
    IModify,
    IConfigurationExtend
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    ApiSecurity,
    ApiVisibility,
} from "@rocket.chat/apps-engine/definition/api";
import { UIActionButtonContext } from "@rocket.chat/apps-engine/definition/ui";
import {
    ApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from "@rocket.chat/apps-engine/definition/api";
import {addNewMessageToConversation, checkOrCreateUser, conversateWithLLM, getConversationWithID, getOrCreateConversation} from "./helpers"
import {EntriJScompressedString, PagePayloadCompressedString, BaseContent} from "./bundle"
import { Buffer } from "buffer";
import {IMessageLLM} from "./db/schemas/Conversation"
import {Base} from "./BaseCommand"
import { getAllConversationsIDS } from './db/services/conversations';
  
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
            const conversationId: string = request.content.conversationId
            const message: string = request.content.message;
            const messageId = request.content.messageId;

            let finalOutput: IMessageLLM

            await checkOrCreateUser(read, persis, request.user.id)
            await getOrCreateConversation(read, persis, conversationId, request.user.id)
            const conversationData = await getConversationWithID(read, conversationId)

            let oldMsgData : IMessageLLM[] = [
                ...conversationData.messages,
                {
                    sentBy: "user",
                    message
                }
            ]

            const reply = await conversateWithLLM(http, oldMsgData, messageId, read)

            const newMsgData = [
                {
                    sentBy: "user",
                    message
                },
                {
                    sentBy: "assistant",
                    message: reply
                }
            ]

            await addNewMessageToConversation(read, persis, request.user.id, conversationId, newMsgData)

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
                    conversationId: conversationId,
                    fromMsg : message
                },
            }
        } catch (error) {
            return {
                status: 500,
                content: `Error reading file: ${error.message}`,
            };
        }
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