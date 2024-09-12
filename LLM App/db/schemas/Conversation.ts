export type IConversation = {
    creator : string;
    messages : IMessageLLM[]
}

export type IMessageLLM = {
    content : string;
    role : string;
}