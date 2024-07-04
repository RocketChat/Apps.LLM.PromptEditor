import { e as useIDB, f as useState, g as useDeta, h as useSettings, l as logger } from '../server.mjs';
import { computed } from 'vue';
import { nanoid } from 'nanoid';
import { u as useLanguageModel } from './language-model-56d12d75.mjs';
import pLimit from 'p-limit';

const useKnowledge = () => {
  const db = useIDB();
  const knowledgeList = useState(() => null, "$qNr5iKtBnI");
  async function listKnowledge() {
    return await db.table("knowledge").toArray();
  }
  async function addKnowledgeItem(item) {
    const newItem = {
      ...item,
      updatedAt: /* @__PURE__ */ new Date()
    };
    const newKey = await db.table("knowledge").add(newItem);
    if (!newKey) {
      throw new Error("Failed to create knowledge item");
    }
    await updateKnowledgeList();
  }
  async function deleteKnowledgeItem(id) {
    await db.table("knowledge").delete(id);
    await updateKnowledgeList();
  }
  async function extractFromUrl(options) {
    const response = await $fetch("/api/knowledge", {
      method: "POST",
      body: {
        type: "url",
        url: options.url
      }
    });
    const data = response;
    const knowledgeItem = {
      id: nanoid(),
      title: data.title,
      type: "url",
      sections: [
        {
          content: data.markdown,
          url: options.url
        }
      ],
      metadata: {
        favicon: data.favicon
      },
      updatedAt: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    await addKnowledgeItem(knowledgeItem);
  }
  async function updateKnowledgeList() {
    knowledgeList.value = await listKnowledge();
  }
  return {
    listKnowledge,
    addKnowledgeItem,
    extractFromUrl,
    updateKnowledgeList,
    deleteKnowledgeItem,
    knowledgeList
  };
};
const useConversations = () => {
  const db = useIDB();
  const { isDetaEnabled, deta } = useDeta();
  useSettings();
  useSettings();
  const { knowledgeList } = useKnowledge();
  useLanguageModel();
  const currentConversationId = useState(() => "", "$eh7cmDuL5s");
  const currentConversation = useState(() => null, "$mf2eZ4OJT6");
  const conversationList = useState(() => null, "$oOyOXm6u9Z");
  const conversationAbortMap = useState(() => ({}), "$igj7WpjgBP");
  const knowledgeUsedInConversation = computed(() => {
    var _a;
    if (currentConversation.value === null) {
      return [];
    }
    return ((_a = currentConversation.value.knowledge) == null ? void 0 : _a.map((knowledgeId) => {
      var _a2;
      return (_a2 = knowledgeList.value) == null ? void 0 : _a2.find((knowledge) => knowledge.id === knowledgeId);
    }).filter((knowledge) => knowledge !== void 0)) || [];
  });
  const isTyping = useState(() => ({}), "$fFQ4eFK0Bb");
  const isTypingInCurrentConversation = computed(() => {
    return isTyping.value[currentConversationId.value] || false;
  });
  const followupQuestions = useState(() => null, "$iJeeiIl3I8");
  async function listConversations() {
    return await db.table("conversations").toArray();
  }
  async function updateConversationList() {
    conversationList.value = await listConversations();
  }
  async function getConversationById(id) {
    return await db.table("conversations").get(id);
  }
  async function createConversation(title, options) {
    const newConversation = {
      id: nanoid(),
      title,
      messages: [],
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      knowledge: [],
      ...options
    };
    const newKey = await db.table("conversations").add(newConversation);
    if (!newKey) {
      throw new Error("Failed to create conversation");
    }
    if (isDetaEnabled.value) {
      deta.conversation.create(newConversation);
    }
    await updateConversationList();
    return newConversation;
  }
  async function cloneConversation(conversationId, lastMessageId, titlePrefix) {
    const titlePrefixWithDefault = titlePrefix || "Copy: ";
    const originConversation = await getConversationById(conversationId);
    let messageList = [];
    if (lastMessageId) {
      const lastMessage = await getMessageById(conversationId, lastMessageId);
      messageList = getMessageChain(originConversation.messages, lastMessage);
    } else {
      messageList = originConversation.messages;
    }
    await createConversation(
      "",
      {
        ...originConversation,
        id: nanoid(),
        title: [titlePrefixWithDefault, originConversation.title].join(""),
        messages: messageList,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    );
  }
  async function forkConversation(id, lastMessageId) {
    await cloneConversation(id, lastMessageId, "Fork: ");
  }
  async function getMessageById(conversationId, id) {
    const conversation = await db.table("conversations").get(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation.messages.find((message) => message.id === id);
  }
  const updateConversation = async (id, update) => {
    const conversation = await db.table("conversations").get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const newConversation = {
      ...conversation,
      ...update
    };
    await db.table("conversations").put(newConversation);
    if (isDetaEnabled.value) {
      deta.conversation.update(newConversation);
    }
    await updateConversationList();
    if (currentConversationId.value === id) {
      currentConversation.value = newConversation;
    }
  };
  const updateConversationSettings = async (id, update) => {
    const conversation = await db.table("conversations").get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const newConversation = {
      ...conversation,
      settings: {
        ...conversation.settings,
        ...update
      }
    };
    logger.info("Updating conversation settings");
    await updateConversation(id, newConversation);
  };
  const deleteConversation = async (id) => {
    await db.table("conversations").delete(id);
    if (isDetaEnabled.value) {
      deta.conversation.delete(id);
    }
    await updateConversationList();
  };
  async function clearErrorMessages() {
    if (!currentConversation.value) {
      return;
    }
    const conversation = await getConversationById(currentConversation.value.id);
    if (!conversation) {
      return;
    }
    const newMessages = conversation.messages.filter((message) => !message.isError);
    await updateConversation(currentConversation.value.id, {
      messages: [...newMessages]
    });
  }
  const sendMessage = async (message) => {
    {
      return;
    }
  };
  const switchConversation = async (id) => {
    var _a;
    currentConversationId.value = id;
    currentConversation.value = await getConversationById(id);
    logger.info("Switched to conversation", (_a = currentConversation.value) == null ? void 0 : _a.id);
  };
  async function removeMessageFromConversation(conversationId, messageId) {
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return;
    }
    conversation.messages = conversation.messages.filter((message) => message.id !== messageId);
    await updateConversation(conversationId, conversation);
    if (isDetaEnabled.value) {
      deta.message.delete(messageId);
    }
  }
  async function clearConversations() {
    if (!conversationList.value) {
      return;
    }
    const limit = pLimit(10);
    await Promise.all(conversationList.value.map(
      (conversation) => limit(() => deleteConversation(conversation.id))
    ));
    const newConversation = await createConversation("Untitled Conversation");
    await switchConversation(newConversation.id);
  }
  async function stopConversationMessageGeneration(conversationId) {
    const abortController = conversationAbortMap.value[conversationId];
    if (abortController) {
      abortController.abort();
    }
  }
  async function updateConversationMessage(conversationId, messageId, message) {
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return;
    }
    const messageIndex = conversation.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) {
      return;
    }
    conversation.messages[messageIndex] = {
      ...conversation.messages[messageIndex],
      ...message
    };
    await updateConversation(conversationId, conversation);
    if (isDetaEnabled.value) {
      deta.message.update(conversation.messages[messageIndex]);
    }
  }
  return {
    clearConversations,
    clearErrorMessages,
    cloneConversation,
    conversationList,
    createConversation,
    currentConversation,
    deleteConversation,
    followupQuestions,
    forkConversation,
    getConversationById,
    isTyping,
    isTypingInCurrentConversation,
    knowledgeUsedInConversation,
    listConversations,
    removeMessageFromConversation,
    sendMessage,
    stopConversationMessageGeneration,
    switchConversation,
    updateConversation,
    updateConversationSettings,
    updateConversationList,
    updateConversationMessage
  };
};
function getMessageChain(messages, message) {
  const parentMessage = messages.find((m) => m.id === message.parentMessageId);
  if (!parentMessage) {
    return [message];
  }
  return [...getMessageChain(messages, parentMessage), message];
}

export { useKnowledge as a, useConversations as u };
//# sourceMappingURL=conversation-50c372eb.mjs.map
