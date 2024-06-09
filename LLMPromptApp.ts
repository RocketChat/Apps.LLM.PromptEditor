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
import {BaseContent} from "./helpers"
import {compressedString} from "./bundle"
import { Buffer } from "buffer";
import {MISTRAL, LLAMA} from "./contants"
import {IConversation, IMessage} from "./db/schemas/Conversation"
import {IUserLLM} from "./db/schemas/User"
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { promises as fs } from 'fs';

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

function ranDomResponses() {



    const responses = [
        "Feeling fantastic, thanks for asking!",
        "Never been better! How about you?",
        "Doing great, ready to conquer the day!",
        "Just chilling, you?",
        "Living the dream, as always!",
        "Fantastic, thanks for checking in!",
        "Couldn't be better, thanks!",
        "Pretty good, what's up?",
        "All good on this end, how about you?",
        "Doing well, how about yourself?"
    ]
}

// export class Base implements ISlashCommand {
//     public command = "botpress";
//     public i18nDescription = "";
//     public providesPreview = false;
//     public i18nParamsExample = "";
//     public _logger: ILogger;
//     public _appId: string;
  
//     constructor(logger: ILogger, appId: string) {
//       this._logger = logger;
//       this._appId = appId;
//     }
  
//     public async executor(
//       context: SlashCommandContext,
//       read: IRead,
//       modify: IModify,
//       http: IHttp,
//       persist: IPersistence
//     ): Promise<void> {

//         const sectionBlock = {
//             type:'section',
//             text: {
//                 type: "plain_text",
//                 text: "Would you like to open Prompt Editor"
//             }
//         }
      
//         const createButtonSectionElement = {
//             type: "button",
//             text: {
//                 type: "plain_text",
//                 text: "Open Prompt Editor"
//             }
//         }
      
//         const appUser = await read.getUserReader().getAppUser() as IUser
//         const room = context.getRoom();
//         const user = context.getSender();

//         const msg = modify
//             .getCreator()
//             .startMessage()
//             .setSender(appUser)
//             .setRoom(room);

//         msg.setBlocks([sectionBlock as SectionBlock, createButtonSectionElement as ButtonElement]);

//         return read.getNotifier().notifyUser(user, msg.getMessage());
//     }
//   }
  

export class LLMPromptApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    // public async extendConfiguration(
    //     configuration: IConfigurationExtend
    //   ): Promise<void> {
    //     const listBotsCommand: Base = new Base(this.getLogger(), this.getID());
    //     await configuration.slashCommands.provideSlashCommand(listBotsCommand);
    //   }

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
                new TestEndPoint(this),
                new BundleJsEndpoint(this),
                new IndexMjsEndpoint(this),
                new GetAllLLMEndpoint(this),
                new ConversateEndpoint(this),
                new FetchAllConversations(this),
                new FetchConversationWithID(this)
            ],
        });
    }
}

export class TestEndPoint extends ApiEndpoint {
    public path = `prompt-editor`;
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

export class BundleJsEndpoint extends ApiEndpoint {
    public path = "bundle.js";

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        const content = Buffer.from(compressedString, "base64");
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

export class IndexMjsEndpoint extends ApiEndpoint {
    public path = "chatt";

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {
        try {
            // Replace with the actual path to your index.mjs file
            const filePath = join(__dirname, ".output/server/index.mjs");
            const content = await fs.readFile(filePath, 'utf-8');
            
            return {
                status: 200,
                headers: {
                    "Content-Type": "text/javascript",
                    // Uncomment the following line if the file is compressed with Brotli
                    // "Content-Encoding": "br",
                },
                content,
            };
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

export class ConversateEndpoint extends ApiEndpoint {
    public path = "conversate";

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<IApiResponse> {

        // try

        // const currentUser = request.user

        // if(!currentUser){
        //     return {
        //         status: 500,
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Content-Security-Policy":
        //             "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
        //         },
        //         content: "No user"
        //     };
        // }

        // if(!Storage["USER"][currentUser.username]){
        //     Storage["USER"][currentUser.username] = {
        //         conversations: []
        //     }
        // }

        // const dbUser = Storage["USER"][currentUser.username]

        // const text = request.content.message, model = request.content.model

        // let conversationId = request.content.conversationId


        // if(!conversationId){

        //     conversationId = generateRandomString(8)

        //     const newConv = {
        //         creator: currentUser.username,
        //         model: model,
        //         messages: []
        //     } as IConversation

        //     Storage["USER"][currentUser.username].conversations.push(conversationId)
        //     Storage["CONVERSATION"][conversationId] = newConv
        // }

        // Storage["CONVERSATION"][conversationId].messages.push(
        //     { role: "user", content: text, user: currentUser.id }
        // )

        // const 

        const headers = {
            "Content-Type": "application/json",
        };
        const modelData = "mistral" == "mistral"? MISTRAL: LLAMA

        const payload = {
            messages: [{ role: "user", content: "rughnr", user: "abcd" }],
            model: modelData.model,
        };

        const response = await http.post(modelData.endpoint + "/chat/completions", {
            headers,
            data: payload,
        });

        const message = response["message"]?.data?.choices?.[0]?.message?.content

        // if(!message){
        //     return {
        //         status: 500,
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Content-Security-Policy":
        //             "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
        //         },
        //         content: "Internal Server Error"
        //     };
        // }


        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: {
                message : message
            },
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
        const userConv = Storage["USER"][currentUser.username]

        if(!userConv){
            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Security-Policy":
                    "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
                },
                content: []
            };
        }
        const convData: any = []

        userConv.conversations.map(convId => {
            convData.push(Storage["CONVERSATION"][convId])
        })

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: userConv,
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

        const convId: string = request.content.conversationId
        const convData = Storage["CONVERSATION"][convId] || []

        return {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Security-Policy":
                "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
            },
            content: convData,
        };
    }
}
