import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
    ILogger,
  } from "@rocket.chat/apps-engine/definition/accessors";
  import {
    ISlashCommand,
    SlashCommandContext,
  } from "@rocket.chat/apps-engine/definition/slashcommands";

  import { Block } from "@rocket.chat/ui-kit";

  import {
    ButtonElement,
    PlainText,
    SectionBlock, ActionsBlock
  } from "@rocket.chat/ui-kit";

  import { sendNotification} from "./helpers"

  export class Base implements ISlashCommand {
    public command = "llm";
    public i18nDescription = "";
    public providesPreview = false;
    public i18nParamsExample = "";
    public _logger: ILogger;
    public _appId: string;
  
    constructor(logger: ILogger, appId: string) {
      this._logger = logger;
      this._appId = appId;
    }
  
    public async executor(
      context: SlashCommandContext,
      read: IRead,
      modify: IModify,
      http: IHttp,
      persist: IPersistence
    ): Promise<void> {

      const mainSection:SectionBlock = {
        appId: this._appId,

        type:"section",
        text: {
          type: "plain_text",
          text: "Would you like to open prompt editor?"
        },
        accessory: {
          appId: this._appId,
          blockId: "block#create_new_chat",
          actionId: "action#create_new_chat",
          type: "button",
          text: {
            type: "plain_text",
            text: "Yes"
          },
          value: "create_new_chat",
          style: "primary",
          url: "https://safe.dev.rocket.chat/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/prompt-editor/chat"
        },
      }

      await sendNotification(context, modify, read, [mainSection])

      return

    }
  }
  