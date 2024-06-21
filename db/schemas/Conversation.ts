export type IConversation = {
    creator : string;
    model : string; // llmModel Id
    messages : IMessage[]
}

export type IMessage = {
    messageId : string;
    message : string;
    sentBy : string;
}