export type IConversation = {
    creator : string;
    messages : IMessageLLM[]
}

export type IMessageLLM = {
    message : string;
    sentBy : string;
}